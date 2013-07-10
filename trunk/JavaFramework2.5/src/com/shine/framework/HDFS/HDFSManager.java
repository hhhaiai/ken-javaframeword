package com.shine.framework.HDFS;

public class HDFSManager {
	private static HDFSManager manager = null;

	public static HDFSManager getManager() {
		if (manager == null)
			manager = new HDFSManager();
		return manager;
	}
	
	

}
