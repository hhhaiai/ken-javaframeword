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
package net.sf.ooweb.http.pygmy;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import net.sf.ooweb.http.AbstractServer;


/**
 * PygmyServer
 *
 * @author Darren Davison
 * @since 0.7
 */
public class OowebServer extends AbstractServer {
    
    pygmy.core.Server pygmyServer;
    Properties cfg = new Properties();
    
    /**
     * @throws IOException
     *
     */
    public OowebServer() throws IOException {
        InputStream is =
                getClass().getResourceAsStream(
                "pygmy-default.properties");
        
        cfg.load(is);
    }
    
    /**
     * @param config a URL to the properties file that contains your additional
     * or overriding properties.
     * @throws IOException
     */
    public OowebServer(File config) throws IOException {
        this();
        Properties additional = new Properties();
        additional.load(new FileInputStream(config));
        cfg.putAll(additional);
    }
    
    /**
     * @see net.sf.ooweb.http.Server#start()
     */
    public void start() throws Exception {
        
        pygmyServer = new pygmy.core.Server(cfg);
        pygmyServer.start();
        
        System.out.println(getQuip());
        synchronized( pygmyServer ) {
            pygmyServer.wait();
        }
    }
    
    @Override
    public void stop() {
        pygmyServer.shutdown();
    }
    
}
