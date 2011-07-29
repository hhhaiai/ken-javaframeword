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

import net.sf.ooweb.objectmapping.ObjectAndMethod;



/**
 * Cache specifies an interface for any type of cache wanting to serve
 * cached ooweb responses.  It can be used as part of an adapter API
 * 
 * @author Darren Davison
 * @since 0.7.1
 */
public interface Cache {
	
	/**
	 * return a cached ResponseState for the keyed ObjectAndMethod, or null
	 * if no such entry exists (or if it's just been expired)
	 * 
	 * @param oam
	 * @return a cached ResponseState object from a previous call to this
	 * ObjectAndMethod
	 */
	public ResponseState get(ObjectAndMethod oam);
	
	/**
	 * add a new object to cache specifying the maximum timeout
	 * 
	 * @param oam
	 * @param state
	 * @param timeout
	 */
	public void put(ObjectAndMethod oam, ResponseState state, Long timeout);
	
}
