package com.shine.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;

/**
 * File工具类
 * @author JiangKunpeng	2011.06.10
 * @version 2012.02.15
 */
public class FileUtil {
	private FileUtil(){
	}
	
	/**
	 * 获取随机文件名
	 * @param filename	原始文件名
	 * @param prefix 	前缀
	 * @param randomLength 	随机数长度
	 * @return
	 * 返回结果格式为：前缀+时间戳+随机数+文件后缀(根据原始文件名获得)<br/>
	 * 时间戳长度为:15,Format表达式为:yyMMddHHmmssSSS
	 */
	public static String getRandomFileName(String filename,String prefix,int randomLength){
		String suffix = getFileSuffix(filename);
		if(suffix==null)
			suffix = "";
		else
			suffix = "." + suffix;
		return StringUtil.getTimeRandomID(prefix, randomLength) + suffix;
	}
	
	/**
	 * 获取文件后缀
	 * @param filename	文件名
	 * @return	如果没有后缀则返回null,否则返回文件后缀
	 */
	public static String getFileSuffix(String filename){
		int p = filename.lastIndexOf(".");
		if(p == -1)
			return null;
		return filename.substring(p + 1,filename.length());
	}
	
	/**
	 * 获取文件大小字符串
	 * @param size	字节数
	 * @return
	 */
	public static String formatFileSize(long size){
		double kb = 1024D;
		double mb = 1048576D;
		double gb = 1073741824D;
		DecimalFormat df = new DecimalFormat("#.##");
		if(size>=gb)
			return df.format(size/gb)+"GB";
		else if(size>=mb)
			return df.format(size/mb)+"MB";
		else if(size>=kb)
			return df.format(size/kb)+"KB";
		else
			return size+"K";
	}
	
	/**
	 * 复制文件
	 * @param sourceFile	源文件
	 * @param targetFile	目标文件
	 * @throws IOException
	 */
	public static void copyFile(File sourceFile, File targetFile)
			throws IOException {
		FileInputStream input = null;
		BufferedInputStream inBuff = null;
		FileOutputStream output = null;
		BufferedOutputStream outBuff = null;
		
		try{
			// 新建文件输入流并对它进行缓冲
			input = new FileInputStream(sourceFile);
			inBuff = new BufferedInputStream(input);
	
			// 新建文件输出流并对它进行缓冲
			output = new FileOutputStream(targetFile);
			outBuff = new BufferedOutputStream(output);
	
			// 缓冲数组
			byte[] b = new byte[1024 * 5];
			int len;
			while ((len = inBuff.read(b)) != -1) {
				outBuff.write(b, 0, len);
			}
			outBuff.flush();
		}finally{
			// 关闭流
			if(inBuff!=null)
				inBuff.close();
			if(outBuff!=null)
				outBuff.close();
			if(output!=null)
				output.close();
			if(input!=null)
				input.close();
		}

	}
	
	/**
	 * 复制文件夹
	 * @param sourceDir		源文件路径
	 * @param targetDir		目标文件路径
	 * @throws IOException
	 */
	public static void copyDirectiory(String sourceDir, String targetDir)
			throws IOException {
		// 新建目标目录
		(new File(targetDir)).mkdirs();
		// 获取源文件夹当前下的文件或目录
		File[] file = (new File(sourceDir)).listFiles();
		for (int i = 0; i < file.length; i++) {
			if (file[i].isFile()) {
				// 源文件
				File sourceFile = file[i];
				// 目标文件
				File targetFile = new File(new File(targetDir).getAbsolutePath() 
						+ File.separator + file[i].getName());
				copyFile(sourceFile, targetFile);
			}
			if (file[i].isDirectory()) {
				// 准备复制的源文件夹
				String dir1 = sourceDir + File.separator + file[i].getName();
				// 准备复制的目标文件夹
				String dir2 = targetDir + File.separator + file[i].getName();
				copyDirectiory(dir1, dir2);
			}
		}
		file = null;
	}
	
	/**
	 * 如果文件不存在则创建(如果所以目录不存在同时创建目录)
	 * @param file
	 * @throws IOException 
	 */
	public static void createFileNotExists(File file) throws IOException{
		if(file.exists())
			return;
		String path = file.getAbsolutePath();
		int point = path.lastIndexOf(File.separator);
		File folder = new File(path.substring(0,point));
		if(!folder.exists())
			folder.mkdirs();
		file.createNewFile();
	}
	
	/**
	 * 如果文件夹不存在则创建文件夹
	 * @param folderPath
	 */
	public static void createFolderNotExists(String folderPath){
		File file = new File(folderPath);
		if(!file.exists())
			file.mkdirs();
	}
	
	/**
	 * 删除文件夹或文件
	 * @param folderPath
	 */
	public static void delFolder(String folderPath) {
		String filePath = null;
		java.io.File myFilePath = null;
		try {
			delAllFile(folderPath); //删除完里面所有内容
			filePath = folderPath;
			filePath = filePath.toString();
			myFilePath = new java.io.File(filePath);
			myFilePath.delete(); //删除空文件夹
		} catch (Exception e) {
			e.printStackTrace(); 
		} finally{
			filePath = null;
			myFilePath = null;
		}
	}
	
	/**
	 * 删除文件夹中的所有内容
	 * @param path
	 * @return
	 */
	public static boolean delAllFile(String path) {
		boolean flag = false;
		File file = new File(path);
		if (!file.exists() || !file.isDirectory()|| file.list()==null ) 
			return flag;

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
				delAllFile(path + File.separator + tempList[i]);//先删除文件夹里面的文件
				delFolder(path + File.separator + tempList[i]);//再删除空文件夹
				flag = true;
			}
		}
		return flag;
	}
}
