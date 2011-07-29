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

import java.util.HashMap;
import java.util.Map;

import net.sf.ooweb.objectmapping.ObjectAndMethod;



/**
 * SimpleCache is just a memory cache with no distribution or delta
 * capability.  OK for small, standalone ooweb apps, but not much use
 * for anything else.  It is suggested you create an implementation
 * of the Cache interface that uses ehcache, swarmcache or something
 * else under the hood.
 * 
 * @author Darren Davison
 * @since 0.7.1
 */
public class SimpleCache implements Cache {
	
	private Map<ObjectAndMethod, CachedResponseState> impl =
		new HashMap<ObjectAndMethod, CachedResponseState>();
	
	/**
	 * @see net.sf.ooweb.http.Cache#get(net.sf.ooweb.http.ObjectAndMethod)
	 */
	public ResponseState get(ObjectAndMethod oam) {
		CachedResponseState crs = impl.get(oam);
		if (crs == null)
			return null;
		
		// check timeout
		long now = System.currentTimeMillis();
		if (crs.expires > now) 
			return crs.resp;
		
		// expired
		impl.remove(oam);
		return null;
	}

	/**
	 * @see net.sf.ooweb.http.Cache#put(net.sf.ooweb.http.ObjectAndMethod, net.sf.ooweb.http.ResponseState, java.lang.Long)
	 */
	public void put(ObjectAndMethod oam, ResponseState respState, Long timeout) {
		long expiry = System.currentTimeMillis() + timeout * 1000;
		impl.put(oam, new CachedResponseState(respState, expiry));
	}
	
	
	/**
	 * CachedResponseState holds the response state and the expiry
	 */
	private static class CachedResponseState {
		ResponseState resp;
		Long expires;
		public CachedResponseState(ResponseState resp, Long expires) {
			this.resp = resp;
			this.expires = expires;
		}
	}

}
