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

import java.util.Map;



/**
 * RequestState is a placeholder for server side state that is passed to client
 * methods (Controller methods) when they declare it as a parameter.  It 
 * holds request args, cookies and the user session (if any) in a server
 * agnostic manner.
 * 
 * @author Darren Davison
 * @since 0.7
 */
public class RequestState {
    
    private Map<String, Object> session;
    
    private Map<String, String> cookies;
    
    private Map<String, Object> requestArgs;

    
    /**
     * @param cookies
     * @param requestArgs
     * @param session
     */
    public RequestState(Map<String, String> cookies, Map<String, Object> requestArgs, Map<String, Object> session) {
        this.requestArgs = requestArgs;
        this.session = session;
        this.cookies = cookies;
    }

    /**
     * @return a map of all the cookie name/value pairs found in the 
     * HTTP request
     */
    public Map<String, String> getCookies() {
        return cookies;
    }
    
    /**
     * @return a map of all request arguments.  These could be name/value pairs
     * from either a GET (query string) or POST
     */
    public Map<String, Object> getRequestArgs() {
        return requestArgs;
    }

    /**
     * @return the session map for the user making the request
     */
    public Map<String, Object> getSession() {
        return session;
    }
    
}
