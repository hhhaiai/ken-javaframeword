package com.shine.Events;

/**
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class EventsManager {
	private static EventsManager manager = null;

	public static EventsManager getManager() {
		if (manager == null)
			manager = new EventsManager();
		return manager;
	}

}
