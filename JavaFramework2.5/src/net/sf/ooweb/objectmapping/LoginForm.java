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
package net.sf.ooweb.objectmapping;



/**
 * LoginForm is implemented by a class that wishes to act as the login
 * form generator for the application.  Only one such class will be 
 * used by OOWeb, so if your registry of server objects contains more
 * than one implementation, you have no control over which will be
 * used.
 * 
 * @author Darren Davison
 * @since 0.7
 */
public interface LoginForm {

    /**
     * The method that will be called to generate the form used to capture
     * login details.  The framework will supply the names of the action,
     * username and password field names that should be used to build the
     * HTML input fields.
     * 
     * @param action the value that should be used for the form's action property
     * @param usernameField the name of the username field
     * @param passwordField the name of the password field
     * @return a String containing the HTML representing a loigin page
     * @throws Exception
     */
    String loginForm(String action, String usernameField, String passwordField)
    throws Exception;
    
}
