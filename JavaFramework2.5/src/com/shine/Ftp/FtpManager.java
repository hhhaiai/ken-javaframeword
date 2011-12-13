package com.shine.Ftp;

import com.shine.Ftp.util.FtpHelper;
import com.shine.Ftp.util.FtpPool;

/**
 * 
 * ftp管理类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class FtpManager {

	private static FtpManager manager = null;

	private FtpPool ftpPool = new FtpPool();

	public static FtpManager getManager() {
		if (manager == null)
			manager = new FtpManager();
		return manager;
	}
	
	/**
	 * FTP客户端【加入池中】
	 * @param ip
	 * @param port
	 * @param name
	 * @param password
	 */
	public void addFtpClient(String ip, int port, String name, String password) {
		FtpHelper ftpHelper = new FtpHelper(ip, port, name, password);
		String key = getFtpPoolKey(ip,port);
		this.ftpPool.addFtpHelper(key, ftpHelper);
	}
	
	/**
	 * 组装Key【IP+PORT】
	 * @param ip
	 * @param port
	 * @return
	 */
	private String getFtpPoolKey(String ip, int port){
		
		return new StringBuffer("ip").append(port).toString();
	}
	
	/**
	 * 从池中【删除FTP客户端】
	 * @param ip
	 * @param port
	 */
	public void deleteFtpClient(String ip, int port) {
		
		String key = getFtpPoolKey(ip,port);
		this.ftpPool.remove(key);
	}

	/**
	 * 上传文件到根目录
	 * 
	 * @param ip
	 * @param port
	 * @param filePath
	 * @return
	 */
	public boolean uploadFile(String ip, int port, String filePath) {
		
		return false;
	}

	/**
	 * 上传文件夹根目录
	 * 
	 * @param ip
	 * @param port
	 * @param folderPath
	 * @return
	 */
	public boolean uploadFolder(String ip, int port, String folderPath) {
		return false;
	}

	/**
	 * 下载文件到指定路径
	 * 
	 * @param ip
	 * @param port
	 * @param remoteFilePath
	 * @param localFilePath
	 * @return
	 */
	public boolean downloadFile(String ip, int port, String remoteFilePath,
			String localFilePath) {
		return false;
	}

	/**
	 * 下载指定文件夹到指定路径
	 * 
	 * @param ip
	 * @param port
	 * @param remoteFolderPath
	 * @param localFolderPath
	 * @return
	 */
	public boolean downloadFolder(String ip, int port, String remoteFolderPath,
			String localFolderPath) {
		return false;
	}

	/**
	 * 删除文件
	 * 
	 * @param ip
	 * @param port
	 * @param filePath
	 * @return
	 */
	public boolean deleteFile(String ip, int port, String filePath) {
		return false;
	}

	/**
	 * 删除文件夹
	 * 
	 * @param ip
	 * @param port
	 * @param folderPath
	 * @return
	 */
	public boolean deleteFolder(String ip, int port, String folderPath) {
		return false;
	}

	/**
	 * 检查文件是否存在
	 * 
	 * @param ip
	 * @param port
	 * @param filePath
	 * @return
	 */
	public boolean checkFile(String ip, int port, String filePath) {
		return false;
	}

	/**
	 * 检查文件夹是否存在
	 * 
	 * @param ip
	 * @param port
	 * @param folderPath
	 * @return
	 */
	public boolean checkFolder(String ip, int port, String folderPath) {
		return false;
	}

	/**
	 * 获取ftp目录结构，返回xml
	 * 
	 * @param ip
	 * @param port
	 * @return
	 */
	public String dir(String ip, int port) {
		
		String key = getFtpPoolKey(ip,port);
		FtpHelper ftpHelper = this.ftpPool.getFtpHelperByKey(key);
		
		
		return null;
	}

	/**
	 * 获取ftp指定文件夹下面的目录结构，返回xml
	 * 
	 * @param ip
	 * @param port
	 * @param folderPath
	 * @return
	 */
	public String dir(String ip, int port, String folderPath) {
		
		
		return null;
	}

	/**
	 * 响应时间
	 * 
	 * @return
	 */
	public int responseTimes(String ip, int port) {
		
		
		
		return 0;
	}
}
