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

import net.sf.ooweb.http.WebUser;






/**
 * User represents an authenticated user of an OOWeb application.  Once a subject
 * has been authenticated, the concrete implementation of this interface is stored
 * in the HTTP session for subsequent use.
 * <p>
 * The framework only
 * interacts with an authenticated subject in order to determine whether a named
 * role has been granted to the User.  Consequently, a single method is defined
 * in the interface for the framework to use.
 * <p>
 * When writing your applications, you may wish to store additional information on
 * the subject that is held in your user repository - name, address and other
 * personal identifiers are common candidates.  A domain class implementing this 
 * interface can have as much storage or logical functionality as you like, and this
 * can be accessed in your web methods by simply casting the returned User object to
 * your implementation type when retrieving it from the session.  i.e.
 * <pre>
 * public class MyUser implements User {
 *     private String name;
 *     private String ssn;
 *     private Address address;
 *     
 *     public boolean hasRole(String roleName) {
 *         // return true if user has the role
 *     }
 *     
 *     // getters/setters for other info omitted
 * }
 * </pre>
 * 
 * .. and in your web method..
 * 
 * <pre>
 * MyUser user = (MyUser) HTTP.getSession().get(SecurityManager.USER_SESSION_KEY);
 * // do something with user.getName(), user.getAddress() etc. 
 * </pre>
 * 
 * If you don't need any other functionality from a User object, then OOWeb supplies 
 * a convenience implementation {@link WebUser} that stores the username and the roles
 * for a User.  You can use this object instead of defining your own.
 * 
 * @author Darren Davison
 * @since 0.5
 * @see Authenticator
 * @see WebUser
 */
public interface User {
    
    /**  
     * Determine whether the user has a given role or not.  This method is called on 
     * the concrete implementation of the User interface to determine whether the
     * authenticated subject has been permitted access to the protected resource.
     * 
     * @param roleName
     * @return true if the user has the role, false otherwise
     */
    public boolean hasRole(String roleName);
    
}
