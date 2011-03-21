package com.shine.framework.Ftp;

import java.io.File;
import java.io.IOException;

import com.enterprisedt.net.ftp.FTPException;
import com.enterprisedt.net.ftp.FileTransferClient;

public class Example {
	public static void main(String[] args) throws FTPException, IOException {
		FtpUtil ftp = new FtpUtil();
		// ftp.connectServer();
		File file = new File("c:\\酒店系统基本功能.jpg");
		FileTransferClient client = ftp.getConnection("127.0.0.1", "21", "sa",
				"sa", "utf-8");
		ftp.uploadFile(file, client);

		ftp.ftpDownload(client, "D:\\酒店系统基本功能.jpg", "酒店系统基本功能.jpg");
		client.disconnect();
	}
}
