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
package net.sf.ooweb.http;




/**
 * NotAuthorizedException is thrown to indicate that the authenticated
 * user has no permission to perform the requested action
 * 
 * @author Darren Davison
 * @since 0.5
 */
public class NotAuthorisedException extends Exception {

    private static final long serialVersionUID = 2487564711510612689L;

    public NotAuthorisedException() {
        super();
    }

    public NotAuthorisedException(String message) {
        super(message);
    }

    public NotAuthorisedException(String message, Throwable cause) {
        super(message, cause);
    }

    public NotAuthorisedException(Throwable cause) {
        super(cause);
    }

}
