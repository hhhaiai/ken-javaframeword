/*
 * ooweb
 *    
 * Copyright(c)2005, ooweb developers (see the accompanying "AUTHORS" file)
 *
 * This software is licensed under the 
 * APACHE LICENSE, Version 2.0
 *    
 * For more information on distributing and using this program, please
 * see the accompanying "COPYING" file.
 */
package net.sf.ooweb.http.pygmy;

import java.io.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import net.sf.ooweb.http.*;
import net.sf.ooweb.sessions.SessionManager;
import net.sf.ooweb.sessions.SessionManager.Strategy;
import net.sf.ooweb.util.Codes;
import pygmy.core.*;
import pygmy.core.Server;


/**
 * The implementation of the Pygmy httpd plugin interface.  Delegates to the 
 * ooweb request handler after converting all pygmy-specific API's to ooweb
 * ones. 
 * 
 * @author Darren Davison
 * @since 0.7
 */
public class OowebHandler extends AbstractHandler {

    protected final Logger logger = Logger.getLogger(getClass().getName());
	
	/**
	 *  value that pygmy will extract from the properties files for us 
	 */
	public static final ConfigOption SESSION_TIMEOUT = 
		new ConfigOption( "sessiontimeout", "1800", "The session timeout value in seconds." );
	
	/**
	 * value that pygmy will extract from the properties files for us 
	 */
	public static final ConfigOption SESSION_STRATEGY = 
		new ConfigOption( "sessionstrategy", "def", "Default, replicated or other session handling strategy." );

	
	/**
	 * @see pygmy.core.AbstractHandler#initialize(java.lang.String, pygmy.core.Server)
	 */
	@Override
	public boolean initialize(String handlerName, Server server) {
		super.initialize(handlerName, server);

		SessionManager sm = SessionManager.getInstance();
		sm.setTimeout(Long.valueOf(SESSION_TIMEOUT.getProperty(server, handlerName)));
		logger.config("Setting session timeout to " + sm.getTimeout());
		
		Strategy strategy = Strategy.DEFAULT;
		if (SESSION_STRATEGY.getProperty(server, handlerName).contains("rep"))
			strategy = Strategy.REPLICATED;
		sm.setStrategy(strategy);
		logger.config("session strategy is " + sm.getStrategy());
		
		return true;
	}
	

	/**
	 * @return true in all cases
	 * @see pygmy.core.AbstractHandler#isRequestdForHandler(pygmy.core.HttpRequest)
	 */
	@Override
	protected boolean isRequestdForHandler(HttpRequest request) {
		return true;
	}

	/**
	 * delegates the request to a {@link RequestHandler} after converting Pygmy
	 * specific API objects to OOWeb ones
	 * 
	 * @see pygmy.core.AbstractHandler#handleBody(pygmy.core.HttpRequest, pygmy.core.HttpResponse)
	 */
	@Override
	protected boolean handleBody(HttpRequest request, HttpResponse response) throws IOException {

        
        String orig = request.getUrl();
        String context = orig.substring(0, orig.lastIndexOf('/'));
        
        HttpHeaders hh = request.getHeaders();
        Iterator iter = hh.iterator();
        Map<String, String> headers = new HashMap<String, String>();
        while (iter.hasNext()) {
        	String key = (String) iter.next();
        	headers.put(key, hh.get(key));
        }
        
        RequestHandler rh = new RequestHandler(
            context,
            orig,
            request.getQuery(),
            headers,
            request.getPostData()
        );
        
        try {
            ResponseState applicationResponse = rh.handle();
            
            // null return is unable to handle
            if (applicationResponse == null)
                return false;            
        
            //logger.debug("Received response [{}] ", applicationResponse); 
            if (applicationResponse.isRedirect()) {
                createRedirectResponse(response, applicationResponse);
            }
            else {
                createResponse(response, Codes.OK, applicationResponse);
            }
            return true;
            
        }
        catch (HandlingException e) {
        	// was a custom response embedded in the exception?
        	ResponseState errorState = e.getResponseState();
        	if (errorState != null)
        		createResponse(response, Codes.INTERNAL_SERVER_ERROR, errorState);
        	else
        		createErrorResponse(response, Codes.INTERNAL_SERVER_ERROR, e.getCause());
            return true;
            
        } 
        catch (NotAuthenticatedException e) {
        	response.addHeader(Codes.WWW_AUTHENTICATE, "Basic realm=\"" + e.getRealm() + "\"");
        	createErrorResponse(response, Codes.UNAUTHORIZED, e);
            return true;
            
        } 
        catch (NotAuthorisedException e) {
            createErrorResponse(response, Codes.FORBIDDEN, e);
            return true;
            
        }
	}
    
    /**
     * @param resp
     * @param code
     * @param state
     * @throws IOException
     */
    protected void createResponse(HttpResponse resp, int code, ResponseState state)
    throws IOException {
        resp.setStatusCode(code);
        resp.setMimeType(state.getMimeType());
        List<Object> body = state.getBody();
        
        // cookies?
        if (state.getNumCookies() > 0)
            for (Cookie c : state.getCookies())
                resp.addHeader(Codes.SET_COOKIE, c.getHeaderValue());
        
        if (body != null) {
        	for (Object part: body) {
        		if (part instanceof String)
        			stream(resp, (String) part);
        		else if (part instanceof File)
        			stream(resp, new FileInputStream((File) part));
        		else if (part instanceof InputStream)
        			stream(resp, (InputStream) part);
        		else
        			logger.warning("Unable to stream response section [" + part.toString() + "]; unknown or unsupported type.");
        	}
        }
    	
    }

    /**
     * @param resp
     * @param state
     * @throws IOException 
     */
    protected void createRedirectResponse(HttpResponse resp, ResponseState state) throws IOException {
        resp.setStatusCode(Codes.FOUND);         
        resp.setMimeType(state.getMimeType());
        resp.addHeader(Codes.LOCATION, state.getNextLocation());
        
        // some clients don't like empty payloads in 302's
        String redirect = "<html><body><h1>" + Codes.FOUND + "</h1></body></html>";
        stream(resp, redirect);        
    }
    
    /**
     * a basic error response when the application didn't define any custom handler
     * for the exception.  We build a trivial view here
     * @param resp
     * @param err the HTTP error code
     * @param e the Throwable that we are creating the response for
     * @throws IOException
     */
    protected void createErrorResponse(HttpResponse resp, int err, Throwable e) 
    throws IOException {
        resp.setStatusCode(err);         
        resp.setMimeType(Codes.TEXT_HTML);
        
        String body = "<html><body><h1>" + err +"</h1><p>" + 
        	e.getMessage() + "</p></body></html>";        
        stream(resp, body);        
    }

	/**
	 * @param resp
	 * @param body
	 * @throws IOException
	 */
	private void stream(HttpResponse resp, String body) throws IOException {
		resp.sendResponse(new ByteArrayInputStream(body.getBytes()), body.length());
	}
	
	/**
	 * @param resp
	 * @param is
	 * @throws IOException
	 */
	private void stream(HttpResponse resp, InputStream is) throws IOException {
		resp.sendResponse(is, -1);
	}

}
