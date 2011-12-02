package com.shine.Ftp.util;

public class FtpHelper {
	private String ip;
	private int port;
	private String name;
	private String password;

	public FtpHelper() {

	}

	public FtpHelper(String ip, int port, String name, String password) {

	}

	/**
	 * 上传文件到根目录
	 * @param filePath
	 * @return
	 */
	public boolean uploadFile(String filePath) {
		return false;
	}

	/**
	 * 上传文件夹根目录
	 * @param folderPath
	 * @return
	 */
	public boolean uploadFolder(String folderPath) {
		return false;
	}

	/**
	 * 下载文件到指定路径
	 * @param remoteFilePath
	 * @param localFilePath
	 * @return
	 */
	public boolean downloadFile(String remoteFilePath, String localFilePath) {
		return false;
	}

	/**
	 * 下载指定文件夹到指定路径
	 * @param remoteFolderPath
	 * @param localFolderPath
	 * @return
	 */
	public boolean downloadFolder(String remoteFolderPath,
			String localFolderPath) {
		return false;
	}

	/**
	 * 删除文件
	 * @param filePath
	 * @return
	 */
	public boolean deleteFile(String filePath) {
		return false;
	}

	/**
	 * 删除文件夹
	 * @param folderPath
	 * @return
	 */
	public boolean deleteFolder(String folderPath) {
		return false;
	}

	/**
	 * 检查文件是否存在
	 * @param filePath
	 * @return
	 */
	public boolean checkFile(String filePath) {
		return false;
	}

	/**
	 * 检查文件夹是否存在
	 * @param folderPath
	 * @return
	 */
	public boolean checkFolder(String folderPath) {
		return false;
	}

	/**
	 * 获取ftp目录结构，返回xml
	 * @return
	 */
	public String dir() {
		return null;
	}

	/**
	 * 获取ftp指定文件夹下面的目录结构，返回xml
	 * @param folderPath
	 * @return
	 */
	public String dir(String folderPath) {
		return null;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
