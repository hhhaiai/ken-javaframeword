package com.shine.Ftp;

/**
 * 
 * ftp管理类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class FtpManager {
	private static FtpManager manager = null;

	public static FtpManager getManager() {
		if (manager == null)
			manager = new FtpManager();
		return manager;
	}

	public void addFtpClient(String ip, int port, String name, String password) {

	}

	public void deleteFtpClient(String ip, int port) {

	}
	
	

}
