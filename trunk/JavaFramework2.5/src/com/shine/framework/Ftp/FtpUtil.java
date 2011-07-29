package com.shine.framework.Ftp;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;

import com.enterprisedt.net.ftp.EventAdapter;
import com.enterprisedt.net.ftp.FTPException;
import com.enterprisedt.net.ftp.FTPFile;
import com.enterprisedt.net.ftp.FileTransferClient;
import com.enterprisedt.net.ftp.WriteMode;

public class FtpUtil {
	/**
	 * 建立上传client
	 * 
	 * @param ip
	 * @param port
	 * @param userName
	 * @param password
	 * @param encoding
	 * @return
	 */
	public static FileTransferClient getConnection(String ip, String port,
			String userName, String password, String encoding) {
		FileTransferClient client = null;
		try {
			client = new FileTransferClient();
			client.setUserName(userName);
			client.setPassword(password);
			client.setRemoteHost(ip);
			client.setRemotePort(Integer.parseInt(port));
			client.setTimeout(1200);

			client.setEventListener(new UploadListener(client));
			client.getAdvancedSettings().setTransferBufferSize(1000);
			client.getAdvancedSettings().setTransferNotifyInterval(5000);
			client.getAdvancedSettings().setControlEncoding(encoding);
			client.connect();
		} catch (FTPException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return client;
	}

	/**
	 * 上传文件
	 * 
	 * @param file
	 * @param client
	 * @return
	 */
	public static boolean uploadFile(File file, FileTransferClient client) {
		String fileName = file.getName();
		String filePath = file.getPath();
		try {
			client.uploadFile(filePath, fileName, WriteMode.RESUME);
			int len = (int) client.getSize(fileName);
			System.out.println("上传文件" + filePath + "完成，大小为" + len + "字节！");
			return true;
		} catch (FTPException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 上传文件夹
	 * 
	 * @param file
	 * @param client
	 * @return
	 */
	public static boolean uploadFolder(File file, FileTransferClient client) {
		if (file.isFile()) {
			return uploadFile(file, client);
		}
		try {
			if (file.isDirectory()) {
				FTPFile[] ftpFiles = client.directoryList();
				boolean isExist = false;
				// 遍历FTP当前目录的文件文件名，如果存在则停止查找，如果不存在则设计标记为不存在
				for (FTPFile ftpFile : ftpFiles) {
					if (ftpFile.getName().equals(file.getName())) {
						isExist = true;
						break;
					}
				}
				// 如果要上传的目录不存在，则创建上传目录
				if (!isExist) {
					client.createDirectory(file.getName());
				}
				// 设置当前目录
				client.changeDirectory(file.getName());

				// 上传文件的列表
				File[] upFiles = file.listFiles();
				for (File upFile : upFiles) {
					if (upFile.isFile()) {
						uploadFile(upFile, client);
					} else if (upFile.isDirectory()) {
						uploadFolder(upFile, client);
					}
				}
				client.changeToParentDirectory();
			}
			return true;
		} catch (FTPException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return false;
	}

	/**
	 * 下载文件
	 * 
	 * @param localFileName
	 *            本地文件名
	 * @param remoteFileName
	 *            远程文件名
	 * @throws FTPException
	 * @throws IOException
	 */
	public void ftpDownload(FileTransferClient client, String localFileName,
			String remoteFileName) throws FTPException, IOException {
		client.downloadFile(localFileName, remoteFileName, WriteMode.OVERWRITE);
	}
	
	
}

class UploadListener extends EventAdapter {
	private long bytesTransferred = 0;
	private FileTransferClient ftpClient;

	public UploadListener(FileTransferClient ftpClient) {
		this.ftpClient = ftpClient;
	}

	public void bytesTransferred(String connId, String remoteFilename,
			long bytes) {
		bytesTransferred = bytes;
	}
}
