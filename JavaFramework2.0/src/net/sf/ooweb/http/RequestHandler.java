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
package net.sf.ooweb.http;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import net.sf.ooweb.objectmapping.ErrorHandler;
import net.sf.ooweb.objectmapping.ObjectAndMethod;
import net.sf.ooweb.objectmapping.Registry;
import net.sf.ooweb.sessions.SessionManager;
import net.sf.ooweb.util.Codes;
import net.sf.ooweb.util.StringUtils;




/**
 * RequestHandler - methods to assist with request operations and parsing
 * without being tied to any given HTTP or application implementation.
 * Each specific underlying HTTP connection class should delegate all 
 * request processing functionality here.
 * 
 * @author Darren Davison
 * @author Robin Rawson-Tetley
 * @since 0.7
 */
public class RequestHandler {

    private final Logger logger = Logger.getLogger(getClass().getName());
    
    private final Registry registry = AbstractServer.getRegistry();
    
    private final Cache cache = AbstractServer.getCache();
    
    private Map<String, String> headers;
    
    private Map<String, String> cookieMap;
    
    private String context;

    private Cookie sessionCookie = null;

    private ObjectAndMethod oam;

    private String queryString;

    private SecurityManager sm;
    
    private Map<String, Object> parameterMap;
    
    private byte[] body = new byte[0];

    /**
     * @param context the first component of the path - ie where it was deployed
     * @param path the remainder of the path of the HTTP request
     * @param queryString the name/value pairs from the query string of the
     * HTTP request
     * @param headers all of the HTTP headers sent by the client
     * @param body the POST data (if any) from the HTTP request
     */
    public RequestHandler(String context, String path, String queryString, Map<String, String> headers, byte[] body) {
        this.context = context;
        this.headers = headers;
        this.oam = new ObjectAndMethod(path);
        
        // if any security is being used, there must be an authenticator
        if (registry.hasAuthenticator())
            sm = new SecurityManager(registry);
        
        this.queryString = queryString;
        if (body != null)
        	this.body = body;
    }
    
    /**
     * Generic OOWeb request handler.  This is called by the server
     * specific handlers to manage the request.  All processing of
     * OOWeb functionality shouild be delegated here by the 
     * underlying server.
     * 
     * @return a ResponseState object detailing the response to be
     * marshalled to the underlying application or http server
     */
    public ResponseState handle() 
    throws HandlingException, NotAuthenticatedException, NotAuthorisedException 
    {
        
        ResponseState securityResponse = null;
        if (sm != null) {
            Map<String, String> cookies = getCookies();
            securityResponse = sm.checkRequest(
                context,
                oam, 
                cookies, 
                getRequestParametersAsMap(),
                headers.get(Codes.AUTHORIZATION),
                getSession(cookies.get(SessionManager.COOKIE_NAME))
            );
            
            if (securityResponse != null)
                return securityResponse;
        }
        
        // make sure it's for us before we do any real work
        if (!registry.hasMethod(oam))
            return null;
        
        // check cache
        ResponseState out = cache.get(oam);
        if (out != null)
        	return out;
        
        else {
        	out = handleInternal(oam, getCookies());
        	// is this response cacheable?
        	if (registry.isCacheable(oam))
        		cache.put(oam, out, registry.getCacheTimeout(oam));
        }
        
        return out;
    }

    /**
     * @param oam
     * @param cookieMap
     * @return
     * @throws HandlingException
     */
    private ResponseState handleInternal(ObjectAndMethod oam, Map<String, String> cookieMap) 
        throws HandlingException {

        if (logger.isLoggable(Level.INFO))
            logger.info("Attempting to handle [" + oam.getFullPath() + "]");

        // get helpers organised
        Object applicationObject = registry.getController(oam);        
        Method methodToInvoke = registry.getMethod(oam);
        
        boolean isStateRequired = methodToInvoke.getParameterTypes().length == 1;
        
        // Make the call    
        Object applicationResponse = null;
        
        try {

        	if (logger.isLoggable(Level.FINE))
                logger.fine("Calling [" + methodToInvoke.toString() + "]");
            
            
            if (isStateRequired) {
                // build up state for client method
                RequestState state = new RequestState(
                    cookieMap,
                    getRequestParametersAsMap(),
                    getSession(cookieMap.get(SessionManager.COOKIE_NAME))
                );
                
                applicationResponse = methodToInvoke.invoke(applicationObject, new Object[] {state});
            }
            else 
                applicationResponse = methodToInvoke.invoke(applicationObject, (Object[]) null);
            
            return getResponseState(applicationResponse);
            
        }
        catch (InvocationTargetException e) {
            // underlying user method threw something
            logger.log(Level.SEVERE, "Underlying user method threw exception: " + e.getCause().getClass());
            
            // has a custom error handler been defined?
            if (registry.hasErrorHandler()) {
            	ErrorHandler handler = registry.getErrorHandler();
            	throw new HandlingException(getResponseState(handler.onError(e.getCause())));
            }
            else
            	// no..
            	throw new HandlingException("Exception in client code: " + e.getMessage(), e.getCause());
        }
        catch (Exception e) {
            logger.log(Level.SEVERE, "Exception in controller handler", e);
            throw new HandlingException("Exception in client code: " + e.getMessage());
        }
    }

    /**
     * Safe to call multiple times as the result of the parse is stored
     * internally,
     * 
     * @return
     */
    private Map<String, Object> getRequestParametersAsMap() {
        
        if (parameterMap != null)
            return parameterMap;
        
        parameterMap = new HashMap<String, Object>();
        
        String hct = getContentTypeHeader();
        if (queryString != null && queryString.length() > 0) {
            parameterMap = splitNameValuePairs(queryString);
        }
        else if (body.length > 0 && Codes.FORMDATA_URLENCODED.equals(hct)) {
            // post params
            parameterMap = splitNameValuePairs(new String(body));
        }
        else if (hct != null && hct.startsWith(Codes.FORMDATA_MULTIPART)) {
            parameterMap = parseMultipart();
        }
        return parameterMap;
    }

    /**
     * @param applicationResponse
     * @return
     */
    private ResponseState getResponseState(Object applicationResponse) {
        /*
         * although we allow client code to return anything from the methods, 
         * we always convert back to a ResponseState here
         */
        ResponseState respState;
        if (ResponseState.class.isAssignableFrom(applicationResponse.getClass())) {
            respState = (ResponseState) applicationResponse;    
        } 
        else {
            respState = new ResponseState();
            respState.setBody(applicationResponse.toString());
            respState.setMimeType(Codes.TEXT_HTML);
        }

        if (sessionCookie != null)
            respState.addCookie(sessionCookie);
        
        return respState;
    }
    
    /** 
     * Given the "Cookie: " header from the incoming request, parses it
     * to return a Map of the name:value pairs for all cookies.  Safe to call 
     * multiple times as the result of the parse is stored internally.
     *  
     * @param cookieHeader
     * @return a Map of name/value pairs from the cookies in the request. 
     * May be of 0 length, but not null
     */
    private Map<String, String> getCookies() {
        
        if (cookieMap != null)
            return cookieMap;
        
        cookieMap = new HashMap<String, String>();
        String cookieHeader = headers.get(Codes.COOKIE);
        if (cookieHeader != null) {
        	if (logger.isLoggable(Level.FINE))
            	logger.fine("Parsing cookes from request header: " + cookieHeader);   
            
            String[] c = cookieHeader.split(";");
            if (logger.isLoggable(Level.FINE))
            	logger.fine("Got " + c.length + " cookies.");
            for (int z = 0; z < c.length; z++) {
                String cookie = c[z].trim();
                int eqls = cookie.indexOf('=');
                String n = cookie.substring(0, eqls);
                String v = cookie.substring(eqls + 1);
                if (logger.isLoggable(Level.FINE))
                	logger.fine("Adding cookie " + n + "=" + v);
                cookieMap.put(n, v);
            }
            
        } else
        	logger.fine("No cookies found in request headers");
        
        return cookieMap;
    }

    /**
     * Return the existing user's session based on the id parameter, 
     * or a new one (if create = true)
     * 
     * @param id
     * @param create
     * @return a valid user session
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getSession(String id) {
    	SessionManager smgr = SessionManager.getInstance();
        if (id != null) {
            Map sess = smgr.getSession(id);
            if (sess != null)
            	return sess;
        }
        
        id = smgr.createSession();
        Map sess = smgr.getSession(id);
        // add session cookie if this is a new session
        sessionCookie = new Cookie(SessionManager.COOKIE_NAME, id);
        return sess;
    }

    /**
     * @return
     */
    private String getContentTypeHeader() {
        String hct = headers.get(Codes.CONTENT_TYPE);
        return (hct == null ? "" : hct.toLowerCase().trim());
    }

    /**
     * 
     */
    private Map<String, Object> splitNameValuePairs(String holder) {
        // get params
        String[] nvps = holder.split("&");
        Map<String, Object> map = new HashMap<String, Object>();
        
        for (String nvp : nvps) {
            String[] entry = nvp.split("=");
            String pval = "";
            if (entry.length > 1)
            	pval = (entry[1].indexOf('%') > -1 ? StringUtils.decodeURLEncoding(entry[1]) : entry[1]);
            map.put(entry[0], pval);
        }
        return map;
    }

    /**
     * @return
     */
    private Map<String, Object> parseMultipart() {
        Map<String, Object> m = new HashMap<String, Object>();
        String hct = getContentTypeHeader();
        
        logger.fine("Headers specified multipart form data, parsing.");
        
        // Read the boundary info from the Content-Type Header
        int bpos = hct.indexOf("=");
        if (bpos == -1) {
            logger.warning("Couldn't find Boundary marker in formdata content type!");
            return m;
        }
        String boundary = hct.substring(bpos + 1);
        if (logger.isLoggable(Level.FINE))
        	logger.fine("Found formdata boundary marker: " + boundary);
        
        // Loop through the entire form data and break it
        // into chunks based on the boundaries, then process
        // them.
        String dbuff = new String(body);
        int bsp = dbuff.indexOf(boundary);
        
        while (bsp != -1) {
            int bep = dbuff.indexOf(boundary, bsp + boundary.length() + 2);
            if (bep == -1) break;
            String head = dbuff.substring(bsp, bep);
            
            // If the content type for this part has no filename,
            // then it's the data from a form component, get it's
            // name and construct a URL encoded string to send back
            if (head.indexOf("filename=") == -1) {
                // Get its name
                String name = "";
                int sp = head.indexOf("name=");
                if (sp != -1) {
                    int ep = head.indexOf(";", sp);
                    if (ep == -1) ep = head.indexOf("\r", sp);
                    name = head.substring(sp + "name=".length(), ep);
                    if (name.startsWith("\"")) name = name.substring(1);
                    if (name.endsWith("\"")) name = name.substring(0, name.length() -1);
                }
                
                String urldata = head.substring(head.indexOf("\r\n\r\n"));
                urldata = StringUtils.encodeURL(urldata.trim());
                m.put(name, urldata);
                if (logger.isLoggable(Level.FINE))
                	logger.fine("Got URL encoded data [" + name + "=" + urldata);
            }
            else {
                // Otherwise, it must be a file
                FormEncodedFile f = parseEncodedFile(body, bsp + boundary.length(), bep);
                m.put(f.getName(), f);
            }
            // Set to next marker
            bsp = bep + boundary.length();
        }
        
        // Return all form parts
        return m;
    }

    /**
     * Locates the first double break (\r\n\r\n) in a byte
     * array.
     * @param data
     * @param startAt
     * @return The location or -1 if none was found
     */
    private int findDoubleBreak(byte[] data, int startAt) {
        int out = -1;
        for (int i = startAt; i < data.length-4; i++) {
            if (
                (data[i] == 13 || data[i] == 10) && 
                (data[i+1] == 13 || data[i+1] == 10) &&
                (data[i+2] == 13 || data[i+2] == 10) &&
                (data[i+3] == 13 || data[i+3] == 10) 
                ) {
                out = i+4;
                break;
            }
        }
        return out;
    }

    /**
     * Given a lump of data representing a file (including headers),
     * this function will parse the header info/data into a 
     * <code>FormEncodedFile</code> object.
     * 
     * @param data The data as an array of bytes
     * @param start The position in the data where the file
     *              starts (first byte after the $boundary)
     * @param end The position in the data where the file ends
     *            (last byte before the $boundary)
     * @return A parsed FormEncodedFile object
     */
    private FormEncodedFile parseEncodedFile(byte[] data, int start, int end) {
        
        int headerend = findDoubleBreak(data, start);
        
        String name = "";
        String filename = "";
        String mimeType = "";
        byte[] filedata = null;
        
        if (headerend == -1) {
            logger.fine("Couldn't find headers for file - assuming everything under boundary is file.");
            headerend = start;
        }
        else {
            String headers = new String(data, start, headerend - start);
            if (logger.isLoggable(Level.FINE))
            	logger.fine("Found form encoded file headers [" + headers + "]");
            
            // name
            int sp = headers.indexOf("name=");
            if (sp != -1) {
                int ep = headers.indexOf(";", sp);
                if (ep == -1) ep = headers.indexOf("\r", sp);
                name = headers.substring(sp + "name=".length(), ep);
                if (name.startsWith("\"")) name = name.substring(1);
                if (name.endsWith("\"")) name = name.substring(0, name.length() -1);
                if (logger.isLoggable(Level.FINE))
                	logger.fine("Found form name for file [" + name + "]");
            }
            
            // filename
            sp = headers.indexOf("filename=");
            if (sp != -1) {
                int ep = headers.indexOf(";", sp);
                if (ep == -1) ep = headers.indexOf("\r", sp);
                filename = headers.substring(sp + "filename=".length(), ep);
                if (filename.startsWith("\"")) filename = filename.substring(1);
                if (filename.endsWith("\"")) filename = filename.substring(0, filename.length() -1);
                if (logger.isLoggable(Level.FINE))
                	logger.fine("Found file name for file [" + filename + "]");
            }
            
            // Mimetype
            sp = headers.indexOf("Content-Type: ");
            if (sp != -1) {
                sp += "Content-Type: ".length();
                mimeType = headers.substring(sp, headers.indexOf("\r", sp));
                if (logger.isLoggable(Level.FINE))
                	logger.fine("Found mimetype for file [" + mimeType + "]");
            }
        }
        
        // Can't give it a blank name, use the filename if available
        if (name.equals("")) {
            name = filename;
        }
        // If there's no filename, use the hashcode of the string as
        // something
        if (name.equals("")) {
            name = Integer.toString(name.hashCode());
            if (logger.isLoggable(Level.FINE))
            	logger.fine("File item has no name, using arbitrary hashcode [" + name + "]");
        }
        
        // Copy the file data into a new array for storage
        int datalen = end - headerend - 4;
        filedata = new byte[datalen];
        System.arraycopy(data, headerend, filedata, 0, datalen);
        
        FormEncodedFile f = new FormEncodedFile(name, filename, mimeType, filedata);
        return f;
    }

}
