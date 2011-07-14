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
 * NotAuthenticatedException is thrown to indicate that no authentication
 * credentials were found in the request, or that the credentials didn't
 * match any known user of the application.
 * 
 * @author Darren Davison
 * @since 0.5
 */
public class NotAuthenticatedException extends Exception {

    private static final long serialVersionUID = -1909865088932864171L;
    
    private String realm;

    /**
     * default c'tor
     */
    public NotAuthenticatedException() {
        super();
    }

    /**
     * @param realm - the name of the realm to authenticate in
     */
    public NotAuthenticatedException(String realm) {
        this.realm = realm;
    }

    /**
     * @param message
     * @param cause
     */
    public NotAuthenticatedException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * @param cause
     */
    public NotAuthenticatedException(Throwable cause) {
        super(cause);
    }
    
    public String getRealm() {
        return realm;
    }
    
    public void setRealm(String realm) {
        this.realm = realm;
    }

}
