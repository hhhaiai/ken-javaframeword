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
package net.sf.ooweb.sessions;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Logger;



/**
 * SessionManager holds a static map of sessions, keyed by session id.  Singleton
 * 
 * @author Darren Davison
 * @since 0.7
 */
public class SessionManager {
    
    // permit other future strategies
	public static enum Strategy {REPLICATED, DEFAULT}
    
    public static final String COOKIE_NAME = "ooweb_session_id";
    
    private static final SessionManager instance = new SessionManager();

    protected final Logger logger = Logger.getLogger(getClass().getName());
    
    /**
     * Map of session objects (ooweb.sessions.Session descendants)
     */
    private HashMap<String, Session> sessions = new HashMap<String, Session>();
	
	private Strategy strategy = Strategy.DEFAULT;
	
	// 30 min timeout
	private long timeout = 60000 * 30;
	
	private Timer reaper;
	
	private TimerTask reapTask = new TimerTask() {
		@Override
		public void run() {
			logger.finest("Reaper thread checking expired sessions");
			synchronized (sessions) {
				for (Iterator<Map.Entry<String, Session>> iter = sessions.entrySet().iterator(); iter.hasNext();) {
					Session s = iter.next().getValue();
					if (s.isOlderThan(timeout)) {
						logger.finer("removing expired session [" + s.getName() + "]");
						s.dispose();
						iter.remove();
					}
				}
			}
		}		
	};
	
	
	/** private ctor */
	private SessionManager() {     
	}

	/**
     * @return the singleton
     */
    public static SessionManager getInstance() {
    	return instance;
    }
    
    /**
     * create a new Session and return the sessionId
     * 
     * @return the sessionId of the new session that can be used
     * to get the session
     */
    public String createSession() { 
    	if (reaper == null)
    		startReaper();
    	
        String id = IDGenerator.generateID();
        Session s = null;
        
		switch (strategy) {
	        case REPLICATED:
			s = new ReplicatedSession(id);
	        break;
	        
	        default:
			s = new Session(id);
	        
		}
		
        synchronized (sessions) {
            sessions.put(id, s);
        }
        
        return id;
    }
    
    /**
     * Get the current Session
     * 
     * @param sessionId the key
     * @return the session for this request, based on the session cookie
     * in the request headers
     */
    public Map getSession(String sessionId) {
        Session s = sessions.get(sessionId);
        
        // return null if no session exists now
        if (s == null)
            return null;
        
        // Accessed, so "touch" the session to prevent
        // expiry for another timeout period.
        s.touch();        
        return s.getMap();
    }
    
    /**
     * 
     */
    public void invalidateSession(String id) {
        synchronized (sessions) {
            sessions.get(id).dispose();
            sessions.remove(id);
        }
    }

    public Strategy getStrategy() {
		return strategy;
	}

    public long getTimeout() {
		return timeout;
	}

    public void setStrategy(Strategy strategy) {
		this.strategy = strategy;
		if (this.strategy == Strategy.REPLICATED) {
			// Start the replicated hashtable listening
			ReplicatedHashtable.announceMe();
		}		
	}

    public void setTimeout(long timeout) {
		this.timeout = timeout * 1000;
	}
        
    private void startReaper() {       	
    	logger.info("Creating reaper timer with timeout " + timeout);
		reaper = new Timer("SessionReaper", true);
		reaper.schedule(reapTask, 60000, 60000);
	}
    
}
