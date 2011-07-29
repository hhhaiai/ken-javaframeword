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
package net.sf.ooweb.sessions;

import java.util.HashMap;
import java.util.Map;

/**
 * Base class for sessions used by OOWeb. Provides a simple
 * implementation based around HashMap.
 * 
 * @author Robin Rawson-Tetley
 * @since 0.5
 */
public class Session {

	protected Map mapImpl = null;
	protected long lastTouched = System.currentTimeMillis();
	protected String name = "Session";
	
	/** Creates a session with an optional name */
	public Session(String name) {
		this.name = name;
        mapImpl = new HashMap();
	}
	
	/** Disposes of the session */
	public void dispose() {
		mapImpl = null;
	}
	
	/** "Touches" the session to prevent it expiring */
	public void touch() {
		lastTouched = System.currentTimeMillis();
	}
	
	/** Checks whether the session has expired based on session timeout value */
	public boolean isOlderThan(long timeout) {
		return System.currentTimeMillis() - lastTouched >= timeout;
	}
	
	/** Returns the last time (since epoch) the session was touched */
	public long getLastTouched() {
		return lastTouched;
	}
	
	/** Gets the Map implementation for this session */
	public Map getMap() {
		return mapImpl;
	}

	public String getName() {
		return name;
	}
	
}
