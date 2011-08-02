package com.shine.framework.Charts.jofc2;

/**
 * Ajofc 控制类 openflash charts
 * 
 * @author viruscodecn@gmail.com
 * @lib org-jofc-0.8.20110729.jar
 * @libUrl http://code.google.com/p/ajofc/
 */
public class Jofc2Manager {
	private static Jofc2Manager manager = null;

	public static Jofc2Manager getManager() {
		if (manager == null)
			manager = new Jofc2Manager();
		return manager;
	}
}
