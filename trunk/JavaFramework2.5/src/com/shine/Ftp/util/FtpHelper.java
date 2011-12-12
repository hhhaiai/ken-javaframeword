package com.shine.Ftp.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
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
		
		//初始化并保存信息
		this.server = server ;
		this.port = port ;
		this.uname = uname ;
		this.password = password ;
		
		ftp = new FTPClient();
		try {
			ftp.configure(getFTPClientConfig());
			if(this.port>0)
				ftp.connect(this.server, this.port);
			else
				ftp.connect(this.server,21);
			ftp.login(this.uname, this.password);

			// 文件类型,默认是ASCII
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);

			// 设置被动模式
			ftp.enterLocalPassiveMode();

			ftp.setConnectTimeout(2000);
			ftp.setControlEncoding("GBK");

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
	 * 上传文件到FTP根目录
	 * 
	 * @param localFile
	 * @param newName
	 * @throws Exception
	 */
	public Boolean uploadFile(String localFile, String newName) throws Exception {
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
	 * 上传文件到FTP根目录
	 * 
	 * @param input
	 * @param newName
	 * @throws Exception
	 */
	public Boolean uploadFile(InputStream input, String newName) throws Exception {
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
	 * 上传文件到指定的FTP路径下
	 * 
	 * @param localFile
	 * @param newName
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
		return success ;
	}

	/**
	 * 上传文件到指定的FTP路径下
	 * 
	 * @param input
	 * @param newName
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
		return success ;
	}

	/**
	 * 从FTP服务器下载文件
	 * 
	 * @param remotePath  远程文件名称 
	 * 
	 * @param localPath 本地路径及文件名
	 */
	public Boolean downloadFile(String remoteFilePath, String localFilePath)
			throws Exception {

		BufferedOutputStream output = null;
		boolean success = false;
		try {
			File file = null;
			if (checkFileExist(localFilePath)) {
				file = new File(localFilePath);
			}
			output = new BufferedOutputStream(new FileOutputStream(file));
			success = ftp.retrieveFile(remoteFilePath, output);
			if (!success) {
				throw new Exception("文件下载失败!");
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (output != null) {
				output.flush();
				output.close();
			}
		}
		return success;
	}
	
	/**
	 * 从FTP服务器获取下载文件流
	 * 
	 * @param remoteFilePath
	 * @return
	 * @throws Exception
	 */
	public InputStream downloadFile(String remoteFilePath) throws Exception {
		return ftp.retrieveFileStream(remoteFilePath);
	}
	
	/**
	 * 从FTP服务器下载文件
	 * 
	 * @param remoteFilePath 远程文件
	 * @param localPath  本地路径
	 * @return
	 * @throws Exception
	 */
	public Boolean downloadFileToLocalPath(String remoteFilePath, String localPath) throws Exception{
		
		boolean success  = false ;
		
		InputStream input = null ;
		BufferedInputStream binput = null ;
		OutputStream outStream = null ;
		BufferedOutputStream bout = null ;

		//检查路径
		File file = null;
		//获取文件名
		String tempName = "1.pptx"; //测试
		if(this.checkFileExist(localPath))
			file = new File(localPath+File.separator+tempName);
		try{
			input = ftp.retrieveFileStream(remoteFilePath);
			binput = new BufferedInputStream(input);
			
			outStream = new FileOutputStream(file);
			bout = new BufferedOutputStream(outStream);
			
			byte[] buff = new byte[1024*5];
			int length;
			while((length=binput.read(buff))!=-1){
				bout.write(buff,0,length);
				bout.flush(); 
			}
		}catch(Exception e){
			throw e;
		}finally{
			if(bout!=null){
				bout.close();
				bout = null;
			}
			if(outStream!=null){
				outStream.close();
				outStream = null;
			}
			if(binput!=null){
				binput.close();
				binput = null ;
			}
			if(input!=null){
				input.close();
				input = null;
			}
		}
		return success;
	}
	
	/**
	 * 获取FTP服务器上指定路径下的文件列表
	 * 
	 * @param filePath
	 * @return
	 */
	public List<String> getFtpServerFileList(String filePath) throws Exception {
		
		List<String> nlist = new ArrayList<String>();
		FTPListParseEngine engine = ftp.initiateListParsing(filePath);
		List<FTPFile> ftpfiles = Arrays.asList(engine.getNext(25));
		
		return getFTPServerFileList(nlist,ftpfiles);
	}

	/**
	 * 获取FTP服务器上指定路径下的文件列表
	 * @param path
	 * @return
	 * @throws Exception
	 */
	public List<String> getFileList(String path) throws Exception {
		
		List<String> nlist = new ArrayList<String>();
		List<FTPFile> ftpfiles = Arrays.asList(ftp.listFiles(path));
		
		return getFTPServerFileList(nlist,ftpfiles);
	}
	
	/**
	 * 列出FTP服务器文件列表信息
	 * @param nlist
	 * @param ftpFiles
	 * @return
	 */
	public List<String> getFTPServerFileList(List<String> nlist,List<FTPFile> ftpFiles){
		if(ftpFiles==null || ftpFiles.size()==0)
			return nlist;
		for (FTPFile ftpFile : ftpFiles) {
			if (ftpFile.isFile()) {
				nlist.add(ftpFile.getName());
			}
		}
		return nlist;
	}
	

	/**
	 * 改变工作目录，如失败则创建文件夹
	 * 
	 * @param remoteFoldPath
	 */
	public void changeDirectory(String remoteFoldPath) throws Exception {

		if (remoteFoldPath != null) {
			boolean flag = ftp.changeWorkingDirectory(remoteFoldPath);
			if (!flag) {
				//创建目录
				createFold(remoteFoldPath);
				ftp.changeWorkingDirectory(remoteFoldPath);
			}
		}

	}

	/**
	 * 创建目录
	 * @param remoteFoldPath
	 * @return
	 */
	public boolean createFold(String remoteFoldPath) throws Exception{
		
		boolean flag = ftp.makeDirectory(remoteFoldPath);
		if(!flag){
			throw new Exception("创建目录失败");	
		}
		return false;
	}
	
	/**
	 * 删除目录
	 * @param remoteFoldPath
	 * @return
	 */
	public boolean deleteFold(String remoteFoldPath){
	
		
		
		return false;
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
			throw new Exception("路径不存在,请检查!");
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
	 *  Set Attribute Method
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
	 * 问题：
	 * 
	 *    问题一：上传时命名的新文件名不能有中文，否则上传失败.
	 *    
	 * 
	 * 
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			FtpHelper fu = new FtpHelper();
			fu.connectFTPServer("192.168.2.18", 21, "administrator", "sunshine");
			
			//上传文件到FTP根目录
			//fu.uploadFile("C:\\文档\\java开发SNMP协议.pptx","QQ.pptx");
			//上传文件到指定的FTP路径
			//fu.uploadFile("C:\\文档\\java开发SNMP协议.pptx","QQ.pptx","/ftp");
		    
			//下载文件到本地路径文件
			//fu.downloadFile("/QQ.pptx","c:\\test\\1.pptx");
			fu.downloadFileToLocalPath("/QQ.pptx","C:"+File.separator+"test");
		} catch (Exception e) {
			//System.out.println("异常信息：" + e.getMessage());
			e.printStackTrace();
		}
	}
}
