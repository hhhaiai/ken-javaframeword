package com.shine.Ftp.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPListParseEngine;
import org.apache.commons.net.ftp.FTPReply;

public class FtpHelper {

	private FTPClient ftp = null;
	/**
	 * Ftp服务器
	 */
	private String server;
	/**
	 * 用户名
	 */
	private String uname;
	/**
	 * 密码
	 */
	private String password;
	/**
	 * 连接端口，默认21
	 */
	private int port = 21;

	public FtpHelper() {

	}

	/**
	 * 连接FTP服务器
	 * 
	 * @param server
	 * @param uname
	 * @param password
	 * @return
	 * @throws Exception
	 */
	public FTPClient connectFTPServer(String server, int port, String uname,
			String password) throws Exception {

		// 初始化并保存信息
		this.server = server;
		this.port = port;
		this.uname = uname;
		this.password = password;

		ftp = new FTPClient();
		try {
			ftp.configure(getFTPClientConfig());
			if (this.port > 0)
				ftp.connect(this.server, this.port);
			else
				ftp.connect(this.server, 21);

			if (!ftp.login(this.uname, this.password)) {
				ftp.logout();
				ftp = null;
				return ftp;
			}

			// 文件类型,默认是ASCII
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftp.setControlEncoding("GBK");
			// 设置被动模式
			ftp.enterLocalPassiveMode();
			ftp.setConnectTimeout(2000);
			ftp.setBufferSize(1024);
			// 响应信息
			int replyCode = ftp.getReplyCode();
			if ((!FTPReply.isPositiveCompletion(replyCode))) {
				// 关闭Ftp连接
				closeFTPClient();
				// 释放空间
				ftp = null;
				throw new Exception("登录FTP服务器失败,请检查![Server:" + server + "、"
						+ "User:" + uname + "、" + "Password:" + password);
			} else {
				return ftp;
			}
		} catch (Exception e) {
			ftp.disconnect();
			ftp = null;
			throw e;
		}
	}

	/**
	 * 配置FTP连接参数
	 * 
	 * @return
	 * @throws Exception
	 */
	public FTPClientConfig getFTPClientConfig() throws Exception {
		String systemKey = FTPClientConfig.SYST_NT;
		String serverLanguageCode = "zh";
		FTPClientConfig conf = new FTPClientConfig(systemKey);
		conf.setServerLanguageCode(serverLanguageCode);
		conf.setDefaultDateFormatStr("yyyy-MM-dd");
		return conf;
	}

	/**
	 * 向FTP根目录上传文件
	 * 
	 * @param localFile
	 * @param newName
	 *            新文件名
	 * @throws Exception
	 */
	public Boolean uploadFile(String localFile, String newName)
			throws Exception {
		InputStream input = null;
		boolean success = false;
		try {
			File file = null;
			if (checkFileExist(localFile)) {
				file = new File(localFile);
			}
			input = new FileInputStream(file);
			success = ftp.storeFile(newName, input);
			if (!success) {
				throw new Exception("文件上传失败!");
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (input != null) {
				input.close();
			}
		}
		return success;
	}

	/**
	 * 向FTP根目录上传文件
	 * 
	 * @param input
	 * @param newName
	 *            新文件名
	 * @throws Exception
	 */
	public Boolean uploadFile(InputStream input, String newName)
			throws Exception {
		boolean success = false;
		try {
			success = ftp.storeFile(newName, input);
			if (!success) {
				throw new Exception("文件上传失败!");
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (input != null) {
				input.close();
			}
		}
		return success;
	}

	/**
	 * 向FTP指定路径上传文件
	 * 
	 * @param localFile
	 * @param newName
	 *            新文件名
	 * @param remoteFoldPath
	 * @throws Exception
	 */
	public Boolean uploadFile(String localFile, String newName,
			String remoteFoldPath) throws Exception {

		InputStream input = null;
		boolean success = false;
		try {
			File file = null;
			if (checkFileExist(localFile)) {
				file = new File(localFile);
			}
			input = new FileInputStream(file);

			// 改变当前路径到指定路径
			this.changeDirectory(remoteFoldPath);
			success = ftp.storeFile(newName, input);
			if (!success) {
				throw new Exception("文件上传失败!");
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (input != null) {
				input.close();
			}
		}
		return success;
	}

	/**
	 * 向FTP指定路径上传文件
	 * 
	 * @param input
	 * @param newName
	 *            新文件名
	 * @param remoteFoldPath
	 * @throws Exception
	 */
	public Boolean uploadFile(InputStream input, String newName,
			String remoteFoldPath) throws Exception {
		boolean success = false;
		try {
			// 改变当前路径到指定路径
			this.changeDirectory(remoteFoldPath);
			success = ftp.storeFile(newName, input);
			if (!success) {
				throw new Exception("文件上传失败!");
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (input != null) {
				input.close();
			}
		}
		return success;
	}

	/**
	 * 从FTP服务器下载文件
	 * 
	 * @param remotePath
	 *            FTP路径(不包含文件名)
	 * @param fileName
	 *            下载文件名
	 * @param localPath
	 *            本地路径
	 */
	public Boolean downloadFile(String remotePath, String fileName,
			String localPath) throws Exception {

		BufferedOutputStream output = null;
		boolean success = false;
		try {
			// 检查本地路径
			this.checkFileExist(localPath);
			// 改变工作路径
			this.changeDirectory(remotePath);
			// 列出当前工作路径下的文件列表
			List<FTPFile> fileList = this.getFileList();
			if (fileList == null || fileList.size() == 0) {
				System.out.println("服务器当前路径下不存在文件！");
				return success;
			}
			for (FTPFile ftpfile : fileList) {
				if (ftpfile.getName().equals(fileName)) {
					File localFilePath = new File(localPath + File.separator
							+ ftpfile.getName());
					output = new BufferedOutputStream(new FileOutputStream(
							localFilePath));
					success = ftp.retrieveFile(ftpfile.getName(), output);
				}
			}
			if (!success) {
				throw new Exception("文件下载失败!");
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (output != null) {
				output.close();
			}
		}
		return success;
	}

	/**
	 * 从FTP服务器下载文件
	 * 
	 * @param remoteFilePath
	 *            FTP路径及文件名(包含文件名)
	 * @param localPath
	 *            本地路径
	 * @return
	 * @throws Exception
	 */
	public Boolean downloadFile(String remoteFilePath, String localPath)
			throws Exception {

		boolean flag = false;

		this.downloadFile("", "", localPath);

		return flag;

	}

	/**
	 * 从FTP服务器获取文件流
	 * 
	 * @param remoteFilePath
	 * @return
	 * @throws Exception
	 */
	public InputStream downloadFile(String remoteFilePath) throws Exception {

		return ftp.retrieveFileStream(remoteFilePath);
	}

	/**
	 * 获取FTP服务器上指定路径下的文件列表
	 * 
	 * @param filePath
	 * @return
	 */
	public List<FTPFile> getFtpServerFileList(String remotePath)
			throws Exception {

		FTPListParseEngine engine = ftp.initiateListParsing(remotePath);
		List<FTPFile> ftpfiles = Arrays.asList(engine.getNext(25));

		return ftpfiles;
	}

	/**
	 * 获取FTP服务器上[指定路径]下的文件列表
	 * 
	 * @param path
	 * @return
	 * @throws Exception
	 */
	public List<FTPFile> getFileList(String remotePath) throws Exception {

		List<FTPFile> ftpfiles = Arrays.asList(ftp.listFiles(remotePath));

		return ftpfiles;
	}

	/**
	 * 获取FTP服务器[当前工作路径]下的文件列表
	 * 
	 * @param path
	 * @return
	 * @throws Exception
	 */
	public List<FTPFile> getFileList() throws Exception {

		List<FTPFile> ftpfiles = Arrays.asList(ftp.listFiles());

		return ftpfiles;
	}

	/**
	 * 改变FTP服务器当前工作路径
	 * 
	 * @param remoteFoldPath
	 */
	public Boolean changeDirectory(String remoteFoldPath) throws Exception {
		boolean flag = false;
		if (remoteFoldPath != null) {
			flag = existDirectory(remoteFoldPath);
			if (!flag) {
				throw new Exception("服务器路径不存!");
			} else {
				flag = true;
				ftp.changeWorkingDirectory(remoteFoldPath);
			}
		}
		return flag;
	}

	/**
	 * 服务器路径是否存在
	 * @param remoteFoldPath(不包含文件)
	 * @return
	 * @throws Exception
	 */
	public boolean existDirectory(String remoteFoldPath) throws Exception {
		boolean flag = false;
		List<FTPFile> ftpFileArr= this.getFileList(remoteFoldPath);
		for (FTPFile ftpFile : ftpFileArr) {
			if (ftpFile.isDirectory()
					&& ftpFile.getName().equalsIgnoreCase(remoteFoldPath)) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	/**
	 * 检查FTP服务器文件是否存在
	 * 
	 * @param remoteFilePath
	 * @return
	 */
	public Boolean checkFtpServerFile(String remoteFilePath) throws Exception {
		boolean flag = false;
		
		return false;
	}

	/**
	 * 删除文件
	 * 
	 * @param remoteFilePath
	 * @return
	 * @throws Exception
	 */
	public Boolean deleteFtpServerFile(String remoteFilePath) throws Exception {

		return ftp.deleteFile(remoteFilePath);
	}

	/**
	 * 创建目录
	 * 
	 * @param remoteFoldPath
	 * @return
	 */
	public boolean createFold(String remoteFoldPath) throws Exception {

		boolean flag = ftp.makeDirectory(remoteFoldPath);
		if (!flag) {
			throw new Exception("创建目录失败");
		}
		return false;
	}

	/**
	 * 删除目录
	 * 
	 * @param remoteFoldPath
	 * @return
	 */
	public boolean deleteFold(String remoteFoldPath) throws Exception {
		boolean success = false ;
		List<FTPFile> list = this.getFileList(remoteFoldPath);
		if(list==null || list.size()==0)
			return ftp.removeDirectory(remoteFoldPath);
		for (FTPFile ftpFile : list){
			String name = ftpFile.getName();
			if(ftpFile.isDirectory()){
				success = deleteFold(remoteFoldPath+"\\"+name);
				if(!success){
					break;
				}
			}else{
				success = ftp.deleteFile(remoteFoldPath+"\\"+name);
				if(!success){
					break;
				}
			}
		}
		return success;
	}

	/**
	 * 检查本地路径是否存在
	 * 
	 * @param filePath
	 * @return
	 * @throws Exception
	 */
	public boolean checkFileExist(String filePath) throws Exception {
		boolean flag = false;
		File file = new File(filePath);
		if (!file.exists()) {
			throw new Exception("本地路径不存在,请检查!");
		} else {
			flag = true;
		}
		return flag;
	}

	/**
	 * 获取文件名,不包括后缀
	 * 
	 * @param filePath
	 * @return
	 */
	public String getFileNamePrefix(String filePath) throws Exception {

		boolean flag = this.checkFileExist(filePath);
		if (flag) {
			File file = new File(filePath);
			String fileName = file.getName();
			String _fileName = fileName.substring(0, fileName.lastIndexOf("."));
			return _fileName;
		}
		return null;
	}

	/**
	 * 关闭FTP连接
	 * 
	 * @param ftp
	 * @throws Exception
	 */
	public void closeFTPClient(FTPClient ftp) throws Exception {

		try {
			if (ftp.isConnected())
				ftp.disconnect();
		} catch (Exception e) {
			throw new Exception("关闭FTP服务出错!");
		}
	}

	/**
	 * 关闭FTP连接
	 * 
	 * @throws Exception
	 */
	public void closeFTPClient() throws Exception {

		this.closeFTPClient(this.ftp);
	}

	/**
	 * Get Attribute Method
	 * 
	 */
	public FTPClient getFtp() {
		return ftp;
	}

	public String getServer() {
		return server;
	}

	public String getUname() {
		return uname;
	}

	public String getPassword() {
		return password;
	}

	public int getPort() {
		return port;
	}

	/**
	 * Set Attribute Method
	 * 
	 */
	public void setFtp(FTPClient ftp) {
		this.ftp = ftp;
	}

	public void setServer(String server) {
		this.server = server;
	}

	public void setUname(String uname) {
		this.uname = uname;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setPort(int port) {
		this.port = port;
	}

	/**
	 * 主方法(测试)
	 * 
	 * 问题： 问题一：上传时命名的新文件名不能有中文，否则上传失败.
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			FtpHelper fu = new FtpHelper();
			// fu.connectFTPServer("192.168.2.18", 21, "administrator",
			// "sunshine");
			// 上传文件到FTP根目录
			// fu.uploadFile("C:\\文档\\java开发SNMP协议.pptx","javaSNMP.pptx");
			// 上传文件到指定的FTP路径
			// fu.uploadFile("C:\\文档\\java开发SNMP协议.pptx","javaSNMP.pptx","/ftp");

			// 下载文件到本地路径文件
			// fu.downloadFile("/ddd.txt","c:\\test\\");
			fu.checkFtpServerFile("/ddd.txt");
			// List<String> list = fu.getFtpServerFileList("/");
			// for(String str:list){
			// System.out.println(str);
			// }
		} catch (Exception e) {
			System.out.println("异常信息：" + e.getMessage());
		}
	}
}
