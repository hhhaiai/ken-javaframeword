package com.shine.framework.OperamasksUI.Tree;

public class TreeManager {
	private static TreeManager manager = null;

	public static TreeManager getManager() {
		if (manager != null)
			manager = new TreeManager();
		return manager;
	}
}
