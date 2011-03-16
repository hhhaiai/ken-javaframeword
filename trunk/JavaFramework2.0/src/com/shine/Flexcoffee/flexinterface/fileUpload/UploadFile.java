package com.shine.Flexcoffee.flexinterface.fileUpload;

import java.io.File;
import java.io.FileOutputStream;

/**
 * 上传文件
 * @author viruscodecn@gmail.com
 *
 */
public class UploadFile {
	/**
	 * 上传文件
	 * @param content
	 * @param fileName
	 * @throws Exception
	 */
	public void uploadFile(byte[] content,String filePath, String fileName) throws Exception {
		File file = new File(filePath + fileName);
		FileOutputStream stream = new FileOutputStream(file);
		if (content != null)
			stream.write(content);
		stream.close();
	}
}