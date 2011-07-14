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
 * ErrorHandler is implemented by a class that wishes to act as the 
 * error handler for the application.  Only one such class will be 
 * used by OOWeb, so if your registry of server objects contains more
 * than one implementation, you have no control over which will be
 * used.
 * 
 * @author Darren Davison
 * @since 0.7
 */
public interface ErrorHandler {

    /**
     * 
     * @param ex the wrapped exception thrown during request processing
     * @return a String representing the output to show the user on
     * the occasion of an error occurring
     */
    String onError(Throwable ex);
    
}
