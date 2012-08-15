package com.shine.framework.ReflectAsm;

public class ReflectAsmManager {
	private static ReflectAsmManager manager = null;

	public static ReflectAsmManager getManager() {
		if (manager == null)
			manager = new ReflectAsmManager();
		return manager;
	}
}
