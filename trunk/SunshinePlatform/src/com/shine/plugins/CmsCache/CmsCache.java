package com.shine.plugins.CmsCache;

import com.shine.Plugin.Plugin;
import com.shine.framework.Cache.CacheManager;
import com.shine.platform.interfaces.CacheIf;

public class CmsCache extends Plugin implements CacheIf {

	@Override
	protected void pluginDestroy() {
		CacheManager.getManager().cleanCache();
	}

	@Override
	protected void pluginSleep() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void pluginStart() {
		// TODO Auto-generated method stub

	}

	public void addCache(Object object, String... tag) {
		CacheManager.getManager().addCache(object, tag);

	}

	public Object getCache(String... tag) {
		return CacheManager.getManager().getCache(tag);
	}

	public void removeCache(String... tag) {
		CacheManager.getManager().removeCache(tag);
	}

	public void cleanCache() {
		CacheManager.getManager().cleanCache();
	}

	public Plugin getPlugin() {
		return this;
	}

	public String pluginStatus() {
		return this.getStatus();
	}

}
