package com.shine.Ftp.util;

import java.util.List;

import org.apache.commons.net.ftp.FTPFile;
import org.dom4j.Element;

import com.shine.framework.core.util.XmlUitl;

public class FtpXmlUtil extends XmlUitl {
	/**
	 * 生成目录XML文件
	 * 
	 * @param ftpHelper
	 * @param remotePath
	 *            (指定FTP路径)
	 * @param rootElement
	 * @param xmlPath
	 * @throws Exception
	 */
	public void createXMLDirectoryWithRemotePath(FtpHelper ftpHelper,
			String remotePath, Element rootElement, String xmlPath)
			throws Exception {
		if (!ftpHelper.changeDirectory(remotePath)) {
			System.out.println("路径不存!");
			return;
		}
		List<FTPFile> list = ftpHelper.getFileList();
		for (FTPFile ftpfile : list) {
			String newRemotePath = (remotePath + "/" + ftpfile.getName())
					.replaceAll("//", "/");
			if (ftpfile.isDirectory()) {
				String[][] data = { { "name", "path" },
						{ ftpfile.getName(), newRemotePath } };
				Element dirElement = XmlUitl.addElement(rootElement, "dir",
						data, null);
				ftpHelper.changeDirectory(ftpfile.getName()); // 从根目录开始
				String currentWorkPath = ftpHelper.getFtp()
						.printWorkingDirectory();
				createXMLDirectoryWithRemotePath(ftpHelper, currentWorkPath,
						dirElement, xmlPath);
			} else {
				String[][] data = { { "path" }, { newRemotePath } };
				XmlUitl
						.addElement(rootElement, "file", data, ftpfile
								.getName());
			}
		}
		XmlUitl.saveAndFormatXML(this.document, xmlPath);
	}

	/**
	 * 生成目录XML文件(默认FTP根目录)
	 * 
	 * @param ftpHelper
	 * @param rootElement
	 * @param xmlPath
	 * @throws Exception
	 */
	public void createXMLDirectory(FtpHelper ftpHelper, Element rootElement,
			String xmlPath) throws Exception {
		// 默认FTP根目录
		String remotePath = "/";
		List<FTPFile> list = ftpHelper.getFileList();
		for (FTPFile ftpfile : list) {
			String newRemotePath = remotePath + ftpfile.getName();
			if (ftpfile.isDirectory()) {
				String[][] data = { { "name", "path" },
						{ ftpfile.getName(), newRemotePath } };
				XmlUitl.addElement(rootElement, "dir", data, null);
			} else {
				String[][] data = { { "path" }, { newRemotePath } };
				XmlUitl
						.addElement(rootElement, "file", data, ftpfile
								.getName());
			}
		}
		XmlUitl.saveAndFormatXML(this.document, xmlPath);
	}
}
