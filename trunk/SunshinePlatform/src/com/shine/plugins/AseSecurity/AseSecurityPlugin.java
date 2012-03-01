package com.shine.plugins.AseSecurity;

import com.shine.Plugin.Plugin;
import com.shine.Plugin.util.PluginTypes;
import com.shine.platform.interfaces.SecurityIf;

public class AseSecurityPlugin extends Plugin implements SecurityIf {

	public AseSecurityPlugin() {
		this.initPlugin("AseSecurity", "1.0", PluginTypes.CLASSPATH, "",
				"AseSecurity");
	}

	@Override
	protected void pluginDestroy() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void pluginSleep() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void pluginStart() {
		// TODO Auto-generated method stub

	}

	public String security(String date) {
		// TODO Auto-generated method stub
		return null;
	}

	public String unSecurity(String date) {
		// TODO Auto-generated method stub
		return null;
	}

	public Plugin getPlugin() {
		return this;
	}

	public String pluginStatus() {
		return this.getStatus();
	}

}
