package com.shine.framework.Nio.utils;

import java.io.IOException;
import java.util.HashMap;

public class NioHelperMap extends HashMap<Integer, NioHelper> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void putHelper(NioHelper helper) {
		if (helper != null)
			this.put(helper.getBindPort(), helper);
	}

	/**
	 * 关闭端口
	 * 
	 * @param helperName
	 * @throws IOException
	 */
	public void stopHelperSocket(int port) throws IOException {
		this.get(port).close();
	}
}
