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

import java.util.List;


/**
 * PygmyServer
 * 
 * @author Darren Davison
 * @since 0.7
 */
public interface Server {

    /**
     * Register a List of controllers, each of which must carry the @Controller
     * annotation at the class level
     */
    public void setControllers(List controllers);

    /**
     * Register a controller.  This object must carry the @Controller annotation
     * at the class level.
     */
    public void addController(Object object);

    /**
     * Start with default config
     * 
     * @throws Exception
     */
    void start() throws Exception;
    
    /**
     * Stop the server gracefully
     */
    void stop();

}
