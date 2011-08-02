package com.shine.framework.core.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URL;

//import org.apache.poi.poifs.filesystem.DirectoryEntry;
//import org.apache.poi.poifs.filesystem.DocumentEntry;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

/**
 * file utilities
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 2.0 2010-11-29
 */
public class FileUtil {
	/**
	 * 创建文件夹
	 * 
	 * @param folderPath
	 * @return
	 */
	public static String createFolder(String folderPath) {
		try {
			File myFilePath = new File(folderPath);
			if (!myFilePath.exists()) {
				myFilePath.mkdir();
			} else {
				System.out.println(FileUtil.class.toString() + ":存在folder"
						+ folderPath + "!");
			}
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":建立folder"
					+ folderPath + "出错!");
		}
		return folderPath;
	}

	/**
	 * Url to file
	 * 
	 * @param url
	 * @return
	 * @throws Exception
	 */
	public static File urlToFile(String url) throws Exception {
		return urlToFile(new URL(url));
	}

	/**
	 * url to file
	 * 
	 * @param url
	 * @return
	 * @throws Exception
	 */
	public static File urlToFile(URL url) throws Exception {
		return new File(url.toURI());
	}

	/**
	 * 创建一个空文件
	 * 
	 * @param filePath
	 * @return
	 */
	public static String createFile(String filePath) {
		try {
			File f = new File(filePath);

			if (!f.exists()) {
				f.createNewFile();
			} else {
				System.out.println(FileUtil.class.toString() + ":存在file"
						+ filePath + "!");
			}
		} catch (Exception e) {
			System.out.println(FileUtil.class.toString() + ":建立file" + filePath
					+ "出错!");
		}
		return filePath;
	}

	/**
	 * 创建一个带内容文件UTF-8
	 * 
	 * @param filePath
	 * @param fileContent
	 * @return
	 */
	public static String createFile(String filePath, String fileContent) {
		return createFile(filePath, fileContent, "UTF-8");
	}

	/**
	 * 创建一个带内容的文件
	 * 
	 * @param filePath
	 * @param fileContent
	 * @param encoding
	 * @return
	 */
	public static String createFile(String filePath, String fileContent,
			String encoding) {
		encoding = encoding.trim();
		PrintWriter printWrinter = null;
		try {
			File f = new File(filePath);

			if (!f.exists()) {
				f.createNewFile();
			} else {
				System.err.println(FileUtil.class.toString() + ":存在file"
						+ filePath + "!");
			}

			printWrinter = new PrintWriter(filePath, encoding);
			printWrinter.print(fileContent);
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":建立file" + filePath
					+ "出错!");
		} finally {
			if (printWrinter != null)
				printWrinter.close();
		}
		return filePath;
	}

	/**
	 * 把内容写入file默认utf-8
	 * 
	 * @param filePath
	 * @param fileContent
	 * @return
	 */
	public static boolean writeFile(String filePath, String fileContent) {
		return writeFile(filePath, fileContent, "UTF-8");
	}

	/**
	 * 把内容写入file
	 * 
	 * @param filePath
	 * @param fileContent
	 * @return
	 */
	public static boolean writeFile(String filePath, String fileContent,
			String encoding) {
		encoding = encoding.trim();
		PrintWriter printWrinter = null;
		try {
			File f = new File(filePath);

			if (f.exists()) {
				printWrinter = new PrintWriter(f, encoding);
				printWrinter.print(fileContent);
				return true;
			} else {
				System.err.println(FileUtil.class.toString() + ":不存在file"
						+ filePath + "!");
				return false;
			}
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":写入file" + filePath
					+ "出错!");
			return false;
		} finally {
			if (printWrinter != null)
				printWrinter.close();
		}
	}

	/**
	 * 读取file,默认utf-8
	 * 
	 * @param filePath
	 * @return
	 */
	public static byte[] readFileByte(String filePath) {
		return readFile(filePath).getBytes();
	}

	/**
	 * 读取file,默认utf-8
	 * 
	 * @param filePath
	 * @return
	 */
	public static String readFile(String filePath) {
		return readFile(filePath, "utf-8");
	}

	/**
	 * 读取文件内容
	 * 
	 * @param filePath
	 * @param encoding
	 * @return
	 */
	public static String readFile(String filePath, String encoding) {
		encoding = encoding.trim();
		StringBuffer fileContent = new StringBuffer();
		FileInputStream fs = null;
		InputStreamReader ir = null;
		BufferedReader br = null;
		try {
			fs = new FileInputStream(filePath);
			if (encoding.equals("")) {
				ir = new InputStreamReader(fs);
			} else {
				ir = new InputStreamReader(fs, encoding);
			}

			br = new BufferedReader(ir);
			try {
				String data = "";
				while ((data = br.readLine()) != null) {
					fileContent.append(data + "\n");
				}
			} catch (Exception e) {
				System.err.println(FileUtil.class.toString() + ":读取file"
						+ filePath + "出错" + e.toString());
				fileContent.append(e.toString());
			}
			return fileContent.toString();
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":读取file" + filePath
					+ "出错!");
			return null;
		} finally {
			try {
				if (br != null)
					br.close();
				if (ir != null)
					ir.close();
				if (fs != null)
					fs.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 清除文件内容
	 * 
	 * @param filePath
	 * @return
	 */
	public static String cleanFile(String filePath) {
		writeFile(filePath, "");
		return filePath;
	}

	/**
	 * 在文件后面补充内容
	 * 
	 * @param filePath
	 * @param data
	 * @return
	 */
	public static String appandFile(String filePath, String data) {
		String s = readFile(filePath);
		writeFile(filePath, s + data);
		return filePath;
	}

	/**
	 * 删除文件夹
	 * 
	 * @param folderPath
	 */
	public static void delFolder(String folderPath) {
		try {
			delAllFile(folderPath); // 删除完里面所有内容
			String filePath = folderPath;
			filePath = filePath.toString();
			java.io.File myFilePath = new java.io.File(filePath);
			myFilePath.delete(); // 删除空文件夹
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":删除folder"
					+ folderPath + "出错!");
		}
	}

	/**
	 * 删除文件夹下面的所有文件
	 * 
	 * @param path
	 * @return
	 */
	public static boolean delAllFile(String path) {
		boolean bea = false;
		File file = new File(path);
		if (!file.exists()) {
			return bea;
		}
		if (!file.isDirectory()) {
			return bea;
		}
		String[] tempList = file.list();
		File temp = null;
		for (int i = 0; i < tempList.length; i++) {
			if (path.endsWith(File.separator)) {
				temp = new File(path + tempList[i]);
			} else {
				temp = new File(path + File.separator + tempList[i]);
			}
			if (temp.isFile()) {
				temp.delete();
			}
			if (temp.isDirectory()) {
				delAllFile(path + "/" + tempList[i]);// 先删除文件夹里面的文件
				delFolder(path + "/" + tempList[i]);// 再删除空文件夹
				bea = true;
			}
		}
		return bea;
	}

	/**
	 * 删除文件
	 * 
	 * @param filePath
	 */
	public static void deleteFile(String filePath) {
		File file = new File(filePath);
		if (file.isFile())
			file.delete();
	}

	/**
	 * 复制file
	 * 
	 * @param oldPathFile
	 * @param newPathFile
	 */
	public static void copyFile(String oldPathFile, String newPathFile) {
		try {
			int bytesum = 0;
			int byteread = 0;
			File oldfile = new File(oldPathFile);
			if (oldfile.exists()) { // 文件存在时
				InputStream inStream = new FileInputStream(oldPathFile); // 读入原文件
				FileOutputStream fs = new FileOutputStream(newPathFile);
				byte[] buffer = new byte[2048];
				while ((byteread = inStream.read(buffer)) != -1) {
					bytesum += byteread; // 字节数 文件大小
					// System.err.println(bytesum);
					fs.write(buffer, 0, byteread);
				}
				inStream.close();
			} else {
				System.err.println(FileUtil.class.toString() + ":不存在file"
						+ oldPathFile);
			}
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":复制file"
					+ oldPathFile + "到" + newPathFile + "出错!");
		}
	}

	/**
	 * 复制file
	 * 
	 * @param oldPathFile
	 * @param newPathFile
	 */
	public static void copyFile(File oldPathFile, File newPathFile)
			throws IOException {
		InputStream in = null;
		OutputStream out = null;
		try {
			in = new BufferedInputStream(new FileInputStream(oldPathFile));
			out = new BufferedOutputStream(new FileOutputStream(newPathFile));
			int bufferSize = 1024;
			byte[] buffer = new byte[bufferSize];
			while (in.read(buffer) > 0)
				out.write(buffer);
		} finally {
			if (null != in)
				in.close();
			if (null != out)
				out.close();
		}
	}

	/**
	 * 复制文件夹
	 * 
	 * @param oldPath
	 * @param newPath
	 */
	public static void copyFolder(String oldPath, String newPath) {
		try {
			new File(newPath).mkdirs(); // 如果文件夹不存在 则建立新文件夹
			File a = new File(oldPath);
			String[] file = a.list();
			File temp = null;
			for (int i = 0; i < file.length; i++) {
				if (oldPath.endsWith(File.separator)) {
					temp = new File(oldPath + file[i]);
				} else {
					temp = new File(oldPath + File.separator + file[i]);
				}
				if (temp.isFile()) {
					FileInputStream input = new FileInputStream(temp);
					FileOutputStream output = new FileOutputStream(newPath
							+ "/" + (temp.getName()).toString());
					byte[] b = new byte[1024 * 5];
					int len;
					while ((len = input.read(b)) != -1) {
						output.write(b, 0, len);
					}
					output.flush();
					output.close();
					input.close();
				}
				if (temp.isDirectory()) {// 如果是子文件夹
					copyFolder(oldPath + "/" + file[i], newPath + "/" + file[i]);
				}
			}
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":复制folder"
					+ oldPath + "到" + newPath + "出错!");
		}
	}

	/**
	 * 移动文件
	 * 
	 * @param oldPath
	 * @param newPath
	 * @return
	 */
	public static void moveFile(String oldPath, String newPath) {
		copyFile(oldPath, newPath);
		deleteFile(oldPath);
	}

	/**
	 * 移动目录
	 * 
	 * @param oldPath
	 * @param newPath
	 * @return
	 */
	public static void moveFolder(String oldPath, String newPath) {
		copyFolder(oldPath, newPath);
		delFolder(oldPath);
	}

	/**
	 * 检查是否存在file
	 * 
	 * @param filePath
	 * @return
	 */
	public static boolean checkFile(String filePath) {
		File f = new File(filePath);
		if (f.isFile()) {
			return f.exists();
		} else
			return false;
	}

	/**
	 * 检查是否存在目录
	 * 
	 * @param folderPath
	 * @return
	 */
	public static boolean checkFolder(String folderPath) {
		File f = new File(folderPath);
		if (f.isFile())
			return false;
		else
			return f.exists();
	}

	/**
	 * 把内容存到wordfile
	 * 
	 * @param path
	 * @param content
	 * @return
	 */
	public static boolean createWordFile(String path, String content) {
		if (FileUtil.checkFile(path))
			return false;

		ByteArrayInputStream bais = null;
		FileOutputStream ostream = null;
		try {
			byte b[] = content.getBytes();
			bais = new ByteArrayInputStream(b);
			POIFSFileSystem poifs = new POIFSFileSystem();
//			DirectoryEntry directory = poifs.getRoot();
//			DocumentEntry documentEntry = directory.createDocument(
//					"WordDocument", bais);

			ostream = new FileOutputStream(path);
			// 生成Word临时文件
			poifs.writeFilesystem(ostream);
			return true;
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":建立word file"
					+ path + "出错！");
			return false;
		} finally {
			try {
				if (bais != null)
					bais.close();
				if (ostream != null)
					ostream.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * 创建 word 文件通过url
	 * 
	 * @param path
	 * @param Url
	 * @param encoding
	 * @return
	 */
	public static boolean createWordFileByUrl(String path, String Url,
			String encoding) {
		if (FileUtil.checkFile(path))
			return false;

		ByteArrayInputStream bais = null;
		FileOutputStream ostream = null;
		try {
			String content = HtmlUtil.getUrlString(Url, encoding);

			byte b[] = content.getBytes();
			bais = new ByteArrayInputStream(b);
			POIFSFileSystem poifs = new POIFSFileSystem();
//			DirectoryEntry directory = poifs.getRoot();
//			DocumentEntry documentEntry = directory.createDocument(
//					"WordDocument", bais);

			ostream = new FileOutputStream(path);
			// 生成Word临时文件
			poifs.writeFilesystem(ostream);
			return true;
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":建立word file"
					+ path + "出错！");
			return false;
		} finally {
			try {
				if (bais != null)
					bais.close();
				if (ostream != null)
					ostream.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * 获取文件列表
	 * 
	 * @param folder
	 * @return
	 */
	public static File[] getFileList(String folder) {
		if (DataUtil.isNull(folder))
			return null;

		File directory = new File(folder);
		return directory.listFiles();
	}

	/**
	 * 搜索在指定目录的某个文件
	 * 
	 * @param folder
	 * @param filName
	 * @return
	 */
	public static File searchFile(String folder, String filName) {
		if (DataUtil.isNull(folder))
			return null;
		if (DataUtil.isNull(filName))
			return null;

		File[] fileList = getFileList(folder);
		for (int i = 0; i < fileList.length; i++) {
			if (filName.equals(fileList[i].getName())) {
				return fileList[i];
			}
		}
		return null;
	}

	public static void main(String args[]) {
		// TODO Auto-generated method stub
		String dir = "F:/JavaWorkSpace/";
		File directory = new File("F:/JavaWorkSpace/");
		File[] files = directory.listFiles();
		System.out.println(files.length);
		for (int i = 0; i < files.length; i++) {
			/**
			 * outputFlage1 输出文件名及其绝对路径
			 */
			System.out.println(i + ":" + files[i].getName() + ";;;"
					+ files[i].getAbsolutePath());
			files[i].renameTo(new File(dir + i + files[i].getName()));
			/**
			 * outputFlag2
			 * 这里可以看出输出的结果和outputFlag一样，renameTo方法没有改变files[i]的值（内存中数据没变
			 * ），但是改变了文件名
			 */
			System.out.println(files[i].getName());
		}
	}
}
