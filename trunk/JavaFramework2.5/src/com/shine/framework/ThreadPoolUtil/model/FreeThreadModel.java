package com.shine.framework.ThreadPoolUtil.model;

import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.ThreadPoolUtil.util.FreeModelMap;
import com.shine.framework.core.util.JarLoader;
import com.shine.framework.core.util.ReflectionUtil;

public class FreeThreadModel extends ThreadModel {

	public FreeThreadModel() {
		this.setType("freeThreadModel");
	}

	@Override
	public void excute(Object... args) {
		try {
			if (args.length != 0) {
				FreeModelMap map = ThreadPoolManager.getManager().getMap();
				if (map.containsKey(args[0])) {
					FreeModel model = map.get(String.valueOf(args[0]));
					if (model.getFreeModelType().equals("jar")) {
						JarLoader.executeJarClass(model.getJarPath(), model
								.getClassPath(), model.getMethod(),
								getArgs(args));
					} else if (model.getFreeModelType().equals("class")) {
						ReflectionUtil.invokeMethod(model.getClassPath(), model
								.getMethod(), getArgs(args));
					} else if (model.getFreeModelType().equals("object")) {
						ReflectionUtil.invokeMethod(model.getO(), model
								.getMethod(), getArgs(args));
					}
					model = null;
				}
				map = null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private Object[] getArgs(Object value[]) {
		Object[] args = new Object[value.length - 1];
		for (int i = 0; i < args.length; i++) {
			args[i] = value[i + 1];
		}
		return args;
	}
}
