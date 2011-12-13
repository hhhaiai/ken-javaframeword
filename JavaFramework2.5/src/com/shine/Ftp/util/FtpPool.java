package com.shine.Ftp.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class FtpPool extends HashMap<String, FtpHelper> {

	private static final long serialVersionUID = 1L;

	public FtpPool() {

	}

	/**
	 * 添加FTP客户端
	 * 
	 * @param key =
	 *            ip+port
	 * @param ftpHelper
	 */
	public void addFtpHelper(String key, FtpHelper ftpHelper) {

		if (ftpHelper != null) {
			if (!this.containsKey(key)) {
				this.put(key, ftpHelper);
			}
		}
	}

	/**
	 * 查找【断开连接】的FTP客户端
	 * 
	 * @param key
	 * @return
	 */
	public FtpHelper getDisconnetFtpHelperByKey(String key) {
		if(this.containsKey(key)){
			FtpHelper ftpHelper = this.get(key);
			if(!ftpHelper.getFtp().isConnected()){
				return ftpHelper ;
			}
		}
		return null;
	}
	
	/**
	 * 查找FTP客户端
	 * 
	 * @param key
	 * @return
	 */
	public FtpHelper getFtpHelperByKey(String key) {

		if(this.containsKey(key)){
			return this.get(key);
		}
		return null;
	}

	/**
	 * 【断开全部】的FTP客户端连接
	 */
	public void disconnectAllFtpHelper() throws Exception{
		Iterator<Map.Entry<String,FtpHelper>> iter = this.entrySet().iterator(); 
		while(iter.hasNext()){
			Map.Entry<String,FtpHelper> entry = iter.next();
			FtpHelper ftpHelper = entry.getValue();
			if(ftpHelper.getFtp().isConnected()){
				ftpHelper.closeFTPClient();
			}
		}
	}
	
	/**
	 * 删除FTP客户端
	 * 
	 * @param key
	 */
	public void removeFtpHelperByKey(String key) {

		this.remove(key);
	}

	/**
	 * 【删除全部】FTP客户端
	 */
	public void removeAllFtpHelper() {

		this.clear();
	}

	/**
	 * 主方法测试
	 * 
	 * @param args
	 */
	public static void main(String args[]){
		try{
			FtpPool f = new FtpPool();
			FtpHelper ftp1 = new FtpHelper("192.168.2.18", 21, "administrator",
					"sunshine");
			FtpHelper ftp2 = new FtpHelper("192.168.2.18", 21, "administrator",
					"sunshine");
			f.addFtpHelper("1", ftp1);
			f.addFtpHelper("2", ftp2);
	
		}catch(Exception e){
			System.out.println("异常信息："+e.getMessage());
		}
	}
}
