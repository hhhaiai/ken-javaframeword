package com.shine.AutoDiscovery;

/**
 * topo发现控制类
 * 
 * @author viruscodecn@gmail.com
 *
 */
public class DisCoveryManager {
	private static DisCoveryManager manager = null;

	public static DisCoveryManager getManager() {
		if (manager == null)
			manager = new DisCoveryManager();
		return manager;
	}

}
