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

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import net.sf.ooweb.sessions.SessionManager;
import net.sf.ooweb.util.Codes;



/**
 * ResponseState can be returned by any controller method in order to have the
 * framework set cookies, update or invalidate a session and take advantage
 * of the inbuilt templating support (depending on the version of Ooweb in
 * use)
 * 
 * @author Darren Davison
 * @since 0.7
 */
public class ResponseState {
    
    private List<Cookie> responseCookies = new LinkedList<Cookie>();

    private List<Object> body = new LinkedList<Object>();
    
    private String mimeType = Codes.TEXT_HTML;

    private String nextLocation;

    /**
     * @param cookie the cookie to add to the outgoing response
     */
    public void addCookie(Cookie cookie) {
        responseCookies.add(cookie);
    }
    
    /**
     * convenience cookie creation method that uses default values for
     * the expires, path, secure and domain values
     * 
     * @param name the name of the cookie to add
     * @param value the value of the cookie to place in the response
     */
    public void addCookie(String name, String value) {
        addCookie(new Cookie(name, value));
    }

    /**
     * @param cookieName the name of the cookie to remove from the client
     */
    public void deleteCookie(String cookieName) {
        // not just remove from responseCookies, set a new one telling
        // the client to expire it immediately
        Cookie del = new Cookie(cookieName, "removed", new Date(0), null, null, false);
        responseCookies .add(del);
    }
    
    /**
     * deletes the session cookie from the next response - effectively
     * invalidating the session
     */
    public void invalidateSession() {
    	//TODO: should really clear the session.. memory issues under
    	// load otherwise.  Possible security problem (v. unlikely tho')
        deleteCookie(SessionManager.COOKIE_NAME);
    }

    /**
     * adds to the list of body sections that will eventually be streamed as
     * a whole
     * 
     * @param body the output of the response
     */
    public void setBody(Object body) {
        this.body.add(body);
    }
    
    /**
     * @param mimeType override the default mime type of the response
     */
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    /**
     * creates a response that instructs the client to request a new
     * page from the site
     * 
     * @param nextLocation the URL to request.  Should be fully qualified
     */
    public void sendRedirect(String nextLocation) {
        this.nextLocation = nextLocation;
    }
    
    /**
     * @return the response about to be sent
     */
    public List<Object> getBody() {
        return body;
    }

    /**
     * @return the response mime type
     */
    public String getMimeType() {
        return mimeType;
    }

    /**
     * @return how many cookies are going to be set in the response
     */
    public int getNumCookies() {
        return responseCookies.size();
    }
    
    /**
     * @return all cookies in the response
     */
    public List<Cookie> getCookies() {
        return responseCookies;
    }
    
    /**
     * @return the redirect url if specified
     */
    public String getNextLocation() {
        return nextLocation;
    }
    
    /**
     * @return true if a redirect will occur, false otherwise
     */
    public boolean isRedirect() {
        return nextLocation != null;
    }
    
}
