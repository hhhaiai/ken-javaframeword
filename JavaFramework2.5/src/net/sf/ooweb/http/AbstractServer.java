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

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import net.sf.ooweb.objectmapping.Registry;




/**
 * AbstractServer is a superclass for Ooweb servers allowing subclasses
 * to build on existing HTTP server architectures.
 * 
 * @author Darren Davison
 * @since 0.7
 */
public abstract class AbstractServer implements Server {

    protected final Logger logger = Logger.getLogger(getClass().getName());

    protected static final String DEFAULT_QUIP = "Ready to rock!";

    protected static final String QUIP_FILE = "quips.txt";

    /** the object registry and URL mapper */
    private static RegistryMap registry = new RegistryMap();
    
    /** can be overridden by concrete servers to provide a better impl */
    private static Cache cache = initialiseCache(); 

    protected static final List<String> quipList = new ArrayList<String>();


    static {
        // load quips from classpath, keeps them a bit
        // more manageable and still as well hidden :)
        InputStream stream = null;
        try {
            stream = AbstractServer.class.getResourceAsStream(QUIP_FILE);
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                stream));
            String nextQuip;
            while ((nextQuip = reader.readLine()) != null)
                quipList.add(nextQuip);
        } catch (Exception ex) {
            // make sure we have at least one quip
            System.err.println("Failed to load quips: " + ex.getMessage());
            if (quipList.size() == 0) quipList.add(DEFAULT_QUIP);
        }
    }


	/**
	 * subclasses usually will want to override this method to 
	 * actually start the server.  The implementation here is empty.
	 * 
	 * @see net.sf.ooweb.http.Server#start()
	 */
	public void start() throws Exception {
	}

	/**
	 * subclasses can optionally override the stop method to shutdown
	 * the server gracefully.  The implementation here does nothing
	 * @see net.sf.ooweb.http.Server#stop()
	 */
	public void stop() {
	}
	
	/**
	 * return the cache implementation in use
	 * 
	 * @return the Cache implementation used in this server
	 */
	public static final Cache getCache() {
		return cache;
	}

	/**
	 * subclasses should override to provide a concrete inplementation of
	 * the Cache interface that will be used by this server.
	 * 
	 * @return the initialised Cache implementation to be used by this server
	 */
	protected static Cache initialiseCache() {
		return new SimpleCache();
	}

    /**
     * Return the object registry
     * 
     * @return the object registry for this application
     */
    public static Registry getRegistry() {
        return registry;
    }

    /**
     * Register a List of controllers, each of which must carry the @Controller
     * annotation at the class level
     *
     * @see net.sf.ooweb.http.Server#setControllers(java.util.List)
     */
    public void setControllers(List controllers) {
        registry.setControllers(controllers);
    }

    /**
     * Register a controller.  This object must carry the @Controller annotation
     * at the class level.
     */
    public void addController(Object object) {
        registry.addController(object);
    }

    /**
     * Returns a random quip for the startup message.
     * 
     * @return a quip
     */
    protected String getQuip() {
        // Select one at random
        int quip = (int) (Math.random() * ((double) quipList.size()));
        return (String) quipList.get(quip);
    }

}
