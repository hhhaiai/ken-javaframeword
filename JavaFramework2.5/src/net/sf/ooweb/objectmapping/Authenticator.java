/*
 * OOWeb
 *    
 * Copyright(c)2005, OOWeb developers (see the accompanying "AUTHORS" file)
 *
 * This software is licensed under the 
 * GNU LESSER GENERAL PUBLIC LICENSE, Version 2.1
 *    
 * For more information on distributing and using this program, please
 * see the accompanying "COPYING" file.
 */
package net.sf.ooweb.objectmapping;





/**
 * Application code implements Authenticator in order to participate in the
 * OOWeb security framework.
 * <p>
 * OOWeb will instantiate this named class (which must have a public,
 * no-arg constructor) and call its login() method, passing the values
 * for username and password garnered from the current request.
 * 
 * @author Darren Davison
 * @since 0.5
 * @see User
 */
public interface Authenticator {
    
    
    /**
     * This method should authenticate the credentials passed to the web
     * framework by the web user.  If the name/password combination are valid
     * the login method returns a <code>User</code> object representing that user
     * which is stored in the session.
     * 
     * @param username the value submitted by the web user
     * @param password the value submitted by the web user
     * @return an object which should represent the authenticated user as far
     * as the web application is concerned.  The object will be added to the
     * session, keyed under the name specified by the SecurityManager's
     * USER_SESSION_KEY field.  A return value of null will be taken to mean
     * an authentication failure by OOWeb
     * @throws Exception if the name/password cannot be authenticated.  Any
     * Exception at all will be taken to mean authentication failure by
     * OOWeb
     */
    User authenticate(String username, String password) throws Exception;
    
}
