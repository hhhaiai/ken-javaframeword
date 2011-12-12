package com.shine.framework.License;

/**
 * 
 * 授权管理
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class LicenseManager {
	private static LicenseManager manager = null;

	public static LicenseManager getManager() {
		if (manager == null)
			manager = new LicenseManager();
		return manager;
	}

	
	public String createLicense() {
		return null;
	}

	public boolean checkLicense(String code) {
		return false;
	}
}
