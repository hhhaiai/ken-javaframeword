package com.shine.NetAnalisys;

import java.util.List;

public class NetAnalisysManager {
	private static NetAnalisysManager manager = null;

	public static NetAnalisysManager getManager() {
		if (manager == null)
			manager = new NetAnalisysManager();
		return manager;
	}

	public void initThreadModel() {

	}

	private void addThreadModel() {
     
	}

}
