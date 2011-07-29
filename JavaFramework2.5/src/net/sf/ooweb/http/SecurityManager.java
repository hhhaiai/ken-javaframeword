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
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import net.sf.ooweb.objectmapping.Authenticator;
import net.sf.ooweb.objectmapping.ObjectAndMethod;
import net.sf.ooweb.objectmapping.Registry;
import net.sf.ooweb.objectmapping.User;
import net.sf.ooweb.util.Base64;



/**
 * SecurityHandler
 * 
 * @author Darren Davison
 * @since 0.7
 */
public class SecurityManager {

    public static final String PASSWORD_FIELD = "password";

    public static final String USERNAME_FIELD = "name";

    public static final String LOGIN_FORM_POST = "/j_security_check";
    
    public static final String USER_SESSION_KEY = "ooweb.user";
    
    public static final String LOGIN_REDIRECT_COOKIE_NAME = "ooweb.redirectUrl";
    
    private static String[] zeroRoles = new String[] {};
    
    private Map<String, String[]> secureMethodCache = 
        new ConcurrentHashMap<String, String[]>();

    private Registry registry;

    protected final Logger logger = Logger.getLogger(getClass().getName());

    

    /**
     * @param registry
     */
    public SecurityManager(Registry registry) {
        this.registry = registry;
    }
    
    /**
     * handles a request from a security perspective, performing authentication
     * and authorisation as required
     * @param reqParams 
     * @param basicAuthHeader 
     * 
     * @return null if the request may proceed unhindered, or a ResponseState
     *   indicating the target (usually a login form)
     * @throws NotAuthenticatedException if the request contains bad credentials
     * @throws NotAuthorisedException if the credentials are good but the user
     * has no access to the requested resource
     */
    public ResponseState checkRequest(
        String context,
        ObjectAndMethod oam, 
        Map<String, String> cookieMap, 
        Map<String, Object> reqParams, 
        String basicAuthHeader,
        Map session) 
    throws NotAuthenticatedException, NotAuthorisedException
    {        
        
        // is object or method secured?
        String[] roles = securedFor(oam, registry);
        Authenticator authenticator = registry.getAuthenticator();
        User user = null;
        ResponseState securityResponse = new ResponseState();
        
        if (session != null) user = (User) session.get(USER_SESSION_KEY);
        
        if (roles.length > 0) {
            // yes: have we authenticated?
            if (user == null && basicAuthHeader != null && basicAuthHeader.length() > 7) {
                String credentials = Base64.decode(basicAuthHeader.substring(6));
                int sep = credentials.indexOf(":");
                String name = credentials.substring(0, sep);
                String pwd = credentials.substring(sep + 1);
                user = checkCredentials(session, authenticator, name, pwd);
            }
            
            if (session == null || user == null) {
                // no: do so
                if (registry.hasLoginForm()) {
                    /*
                     * application is using form based login. Set a cookie pointing to
                     * the ORIGINAL request URL and redirect to login form
                     */
                    String redirectAfterLogin = cookieMap.get(
                        LOGIN_REDIRECT_COOKIE_NAME);
                    if (redirectAfterLogin == null) redirectAfterLogin = context + oam.getFullPath();

                    securityResponse.addCookie(new Cookie(
                        LOGIN_REDIRECT_COOKIE_NAME, redirectAfterLogin, null,
                        null, null, false));
                    try {
                        securityResponse.setBody(registry.getLoginForm().loginForm(
                            context + LOGIN_FORM_POST, 
                            USERNAME_FIELD, 
                            PASSWORD_FIELD));
                    } catch (Exception e) {
                        logger.log(Level.SEVERE, "Failed to display login form", e);
                    }

                }
                else
                    throw new NotAuthenticatedException(oam.getObject());
                
                return securityResponse;
            }
                
            else {
                // yes: check roles
                for (String role : roles)
                    if (user.hasRole(role))
                        // we're done - allow processing to continue normally
                        return null;
                
                // authenticated user has no right to do this.  Send 403
                throw new NotAuthorisedException("Not Authorised");
            }
        }
        
        // lastly..
        if (isLoginFormPost(oam)) {
            checkCredentials(
                session,
                authenticator,
                (String) reqParams.get(USERNAME_FIELD),
                (String) reqParams.get(PASSWORD_FIELD));
            securityResponse.sendRedirect(cookieMap.get(LOGIN_REDIRECT_COOKIE_NAME));
            return securityResponse;
        }
        
        return null;
    }

    @SuppressWarnings("unchecked")
    private User checkCredentials(Map session, Authenticator authenticator, String name, String pwd) {
        User u = null;
        try {
            u = authenticator.authenticate(name, pwd);
            session.put(USER_SESSION_KEY, u);
            
        } catch (Exception e) {
            // failed to authenticate
            logger.log(Level.SEVERE, "Failed to authenticate [" + name + "]");     
        }
        return u;
    }

    private String[] securedFor(ObjectAndMethod oam, Registry registry) {
        String[] roles = null;
        String path = oam.getFullPath();
        
        // cached?
        if (secureMethodCache.containsKey(path))
            return secureMethodCache.get(path);
        
        // check with registry
        roles = registry.getRolesFor(oam);
        
        if (roles == null) roles = zeroRoles;        
        secureMethodCache.put(path, roles);
        return roles;
        
    }
    
    private boolean isLoginFormPost(ObjectAndMethod oam) {
        return oam.getFullPath().equals(LOGIN_FORM_POST);
    }

}
