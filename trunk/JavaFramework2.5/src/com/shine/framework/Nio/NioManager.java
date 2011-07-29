package com.shine.framework.Nio;

public class NioManager {
	private static NioManager manager = null;

	public static NioManager getManger() {
		if (manager == null)
			manager = new NioManager();
		return manager;
	}
	
	public void createNio(){
		
	}
	
	public void closeNio(){
		
	}
}
