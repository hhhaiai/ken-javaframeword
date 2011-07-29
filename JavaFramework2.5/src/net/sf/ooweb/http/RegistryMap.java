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

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import net.sf.ooweb.objectmapping.Authenticator;
import net.sf.ooweb.objectmapping.Cacheable;
import net.sf.ooweb.objectmapping.Controller;
import net.sf.ooweb.objectmapping.ErrorHandler;
import net.sf.ooweb.objectmapping.Exclude;
import net.sf.ooweb.objectmapping.LoginForm;
import net.sf.ooweb.objectmapping.ObjectAndMethod;
import net.sf.ooweb.objectmapping.Registry;
import net.sf.ooweb.objectmapping.Secure;



/**
 * default impl
 * 
 * @author Darren Davison
 * @since 0.7
 */
class RegistryMap implements Registry {

    protected final Logger logger = Logger.getLogger(getClass().getName());

    /**
     * The map of path hashcodes to objects.
     */
    private Map<String, Object> controllers = new HashMap<String, Object>();

    private Map<ObjectAndMethod, Method> methods = new HashMap<ObjectAndMethod, Method>();
    
    private Map<ObjectAndMethod, Long> cacheableTimeouts = new HashMap<ObjectAndMethod, Long>();
    
    private LoginForm loginForm;
    
    private Authenticator authenticator;
    
    private ErrorHandler errorHandler;
    
    
    
    /**
     * @see net.sf.ooweb.objectmapping.Registry#hasAuthenticator()
     */
    public boolean hasAuthenticator() {
        return authenticator != null;
    }
    
    /**
     * @see net.sf.ooweb.objectmapping.Registry#hasLoginForm()
     */
    public boolean hasLoginForm() {
        return loginForm != null;
    }

	/**
	 * @see net.sf.ooweb.objectmapping.Registry#hasErrorHandler()
	 */
	public boolean hasErrorHandler() {
		return errorHandler != null;
	}
    
    /**
     * @see net.sf.ooweb.objectmapping.Registry#hasController(net.sf.ooweb.http.ObjectAndMethod)
     */
    public boolean hasController(ObjectAndMethod oam) {
        return controllers.containsKey(oam.getObject());
    }

    /**
     * @see net.sf.ooweb.objectmapping.Registry#hasMethod(net.sf.ooweb.http.ObjectAndMethod)
     */
    public boolean hasMethod(ObjectAndMethod oam) {
        return methods.containsKey(oam);
    }
    
    /**
     * @see net.sf.ooweb.objectmapping.Registry#getAuthenticator()
     */
    public Authenticator getAuthenticator() {
        return authenticator;
    }
    
    /**
     * @see net.sf.ooweb.objectmapping.Registry#getLoginForm()
     */
    public LoginForm getLoginForm() {
        return loginForm;
    }

	/**
	 * @see net.sf.ooweb.objectmapping.Registry#getErrorHandler()
	 */
	public ErrorHandler getErrorHandler() {
		return errorHandler;
	}
    
    /**
     * @see net.sf.ooweb.objectmapping.Registry#getController(net.sf.ooweb.http.ObjectAndMethod)
     */
    public Object getController(ObjectAndMethod oam) {
        return controllers.get(oam.getObject());
    }

    /**
     * @see net.sf.ooweb.objectmapping.Registry#getMethod(net.sf.ooweb.http.ObjectAndMethod)
     */
    public Method getMethod(ObjectAndMethod oam) {
        return methods.get(oam);
    }
    
    /**
     * @see net.sf.ooweb.objectmapping.Registry#getRolesFor(net.sf.ooweb.http.ObjectAndMethod)
     */
    public String[] getRolesFor(ObjectAndMethod oam) {
    	
    	if (logger.isLoggable(Level.FINER))
    		logger.finer("Checking roles for oam [" + oam + "]");
    	
        // check most specific first; method
        Method m = methods.get(oam);
        if (m != null) {
            Secure secAnn = m.getAnnotation(Secure.class);
            if (secAnn != null)
                return secAnn.value();
        }
        
        Object o = controllers.get(oam.getObject());
        if (o != null) {
            Secure secAnn = o.getClass().getAnnotation(Secure.class);
            if (secAnn != null)
                return secAnn.value();
        }
        
        return null;
    }

	/**
	 * @see net.sf.ooweb.objectmapping.Registry#getCacheTimeout(net.sf.ooweb.http.ObjectAndMethod)
	 */
	public long getCacheTimeout(ObjectAndMethod oam) {
		Long t = cacheableTimeouts.get(oam);
		if (t != null)
			return t;
		else
			return -1;
	}

	/**
	 * @see net.sf.ooweb.objectmapping.Registry#isCacheable(net.sf.ooweb.http.ObjectAndMethod)
	 */
	public boolean isCacheable(ObjectAndMethod oam) {
		return cacheableTimeouts.containsKey(oam);
	}

    /**
     * @param newControllers
     */
    public void setControllers(List newControllers) {
        controllers.clear();
        for (Object o : newControllers)
            addController(o);
    }

    /**
     * @param object
     */
    public void addController(Object object) {
        Controller ann = object.getClass().getAnnotation(Controller.class);
        if (ann != null)
            // register against each defined path
            for (String path : ann.value())
                addController(path, object);
        
        checkSpecial(object);
    }

    /**
     * Register an object to be used for a given path.
     * 
     * @param path
     * @param object
     */
    @SuppressWarnings("unchecked")
    private void addController(String path, Object object) {
        if (path == null || object == null)
            throw new IllegalArgumentException("Cannot register null object");
        
        if (!path.startsWith("/"))
            path = "/" + path;
        
        if (!path.endsWith("/"))
            path += "/";
        
        controllers.put(path, object);
        
        Cacheable classCacheable = object.getClass().getAnnotation(Cacheable.class);
        
        Method[] objMethods = object.getClass().getMethods();
        for (Method m : objMethods) {
            Class[] args = m.getParameterTypes();
            Class ret = m.getReturnType();    
            Exclude exclude = m.getAnnotation(Exclude.class);
            
            // candidate for web serving?    
            if (exclude == null && 
                !ret.equals(void.class) && 
               (args.length == 0 || (args.length == 1 && args[0].isAssignableFrom(RequestState.class)))
            ) {
                // yep
                ObjectAndMethod oam = new ObjectAndMethod(path + m.getName());
                methods.put(oam, m);    
                
                // candidate for caching?
                Cacheable methodCacheable = m.getAnnotation(Cacheable.class);
                if (classCacheable != null) {
                	// yep
                	cacheableTimeouts.put(oam, classCacheable.value());
                }
                if(methodCacheable != null) {
                	// yep
                	cacheableTimeouts.put(oam, methodCacheable.value());                	
                }
            }
        }
    }

    private void checkSpecial(Object object) {
        // check for special implementors
        if (object instanceof Authenticator)
            authenticator = (Authenticator) object;
        
        if (object instanceof LoginForm)
            loginForm = (LoginForm) object;        
        
        if (object instanceof ErrorHandler)
            errorHandler = (ErrorHandler) object;        
    }
}
