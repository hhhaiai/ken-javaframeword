package com.shine.framework.ThreadPoolUtil.util;

import java.util.HashMap;

public class MonitorControlPool extends HashMap<String, MonitorControl> {
	public int getInitThreadPool(String type) {
		if (this.get(type) == null)
			return 2;
		return this.get(type).getInitThreadPool();
	}

	public int getMaxThreadPool(String type) {
		if (this.get(type) == null)
			return 50;
		return this.get(type).getMaxThreadPool();
	}

	public int getIdleThreadPool(String type) {
		if (this.get(type) == null)
			return 10;
		return this.get(type).getIdleThreadPool();
	}
}
