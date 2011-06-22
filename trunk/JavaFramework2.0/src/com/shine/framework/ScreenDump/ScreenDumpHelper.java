package com.shine.framework.ScreenDump;

import java.awt.AWTException;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;

import javax.imageio.ImageIO;

interface ImageType {
	public final static String JPG = "JPG";
	public final static String PNG = "PNG";
	public final static String GIF = "GIF";
}

/**
 * 屏幕截取 类 参考 http://www.iteye.com/topic/289052 实现 cn.iamsese.prj.db.helper
 * Author: vb2005xu [JAVA菜鸟]
 */
public class ScreenDumpHelper {
	/** ScreenDumpHelper 静态对象 */
	private static ScreenDumpHelper defaultScreenDumpHelper;

	/**
	 * 返回 ScreenDumpHelper 类的 单态实例
	 * 
	 * @return ScreenDumpHelper
	 */
	public static ScreenDumpHelper getDefaultScreenDumpHelper() {
		if (defaultScreenDumpHelper == null)
			return new ScreenDumpHelper();
		return defaultScreenDumpHelper;
	}

	/**
	 * 构造函数中设置 截屏区域的默认值 -- 缺省为全屏
	 */
	public ScreenDumpHelper() {
		Dimension dime = Toolkit.getDefaultToolkit().getScreenSize();
		this.setScreenArea(new Rectangle(dime));
	}

	/**
	 *设置截屏的范围
	 */
	private Rectangle screenArea;

	public Rectangle getScreenArea() {
		return this.screenArea;
	}

	public void setScreenArea(Rectangle screenArea) {
		this.screenArea = screenArea;
	}

	public void setScreenArea(int x, int y, int width, int height) {
		this.screenArea = new Rectangle(x, y, width, height);
	}

	/**
	 * 返回一个 BufferedImage
	 * 
	 * @return
	 * @throws AWTException
	 */
	private BufferedImage getBufferedImage() throws AWTException {
		BufferedImage imgBuf = null;
		;
		imgBuf = (new Robot()).createScreenCapture(this.getScreenArea());
		return imgBuf;
	}

	/**
	 * 将 图像数据写到 输出流中去,方便再处理
	 * 
	 * @param fileFormat
	 * @param output
	 * @return
	 */
	public boolean saveToOutputStream(String fileFormat, OutputStream output) {
		try {
			ImageIO.write(this.getBufferedImage(), fileFormat, output);
		} catch (AWTException e) {
			return false;
			// e.printStackTrace();
		} catch (IOException e) {
			return false;
			// e.printStackTrace();
		}
		return true;
	}

	/**
	 * 根据文件格式 返回随机文件名称
	 * 
	 * @param fileFormat
	 * @return
	 */
	public String getRandomFileName(String fileFormat) {
		return "screenDump_" + (new Date()).getTime() + "." + fileFormat;
	}

	/**
	 * 抓取 指定区域的截图 到指定格式的文件中 -- 这个函数是核心,所有的都是围绕它来展开的 * 图片的编码并不是以后缀名来判断: 比如s.jpg
	 * 如果其采用png编码,那么这个图片就是png格式的
	 * 
	 * @param fileName
	 * @param fileFormat
	 * @return boolean
	 */
	public boolean saveToFile(String fileName, String fileFormat) {
		if (fileName == null)
			fileName = getRandomFileName(fileFormat);
		try {
			FileOutputStream fos = new FileOutputStream(fileName);
			this.saveToOutputStream(fileFormat, fos);
		} catch (FileNotFoundException e) {
			System.out.println("非常规文件或不能创建抑或覆盖此文件: " + fileName);
			e.printStackTrace();
		}
		return true;
	}

	/**
	 * 抓取 指定 Rectangle 区域的截图 到指定格式的文件中
	 * 
	 * @param fileName
	 * @param fileFormat
	 * @param screenArea
	 * @return
	 */
	public boolean saveToFile(String fileName, String fileFormat,
			Rectangle screenArea) {
		this.setScreenArea(screenArea);
		return this.saveToFile(fileName, fileFormat);
	}

	/**
	 * 抓取 指定区域的截图 到指定格式的文件中
	 * 
	 * @param fileName
	 * @param fileFormat
	 * @param x
	 * @param y
	 * @param width
	 * @param height
	 */
	public boolean saveToFile(String fileName, String fileFormat, int x, int y,
			int width, int height) {
		this.setScreenArea(x, y, width, height);
		return this.saveToFile(fileName, fileFormat);
	}

	/**
	 * 将截图使用 JPG 编码
	 * 
	 * @param fileName
	 */
	public void saveToJPG(String fileName) {
		this.saveToFile(fileName, ImageType.JPG);
	}

	public void saveToJPG(String fileName, Rectangle screenArea) {
		this.saveToFile(fileName, ImageType.JPG, screenArea);
	}

	public void saveToJPG(String fileName, int x, int y, int width, int height) {
		this.saveToFile(fileName, ImageType.JPG, x, y, width, height);
	}

	/**
	 * 将截图使用 PNG 编码
	 * 
	 * @param fileName
	 */
	public void saveToPNG(String fileName) {
		this.saveToFile(fileName, ImageType.PNG);
	}

	public void saveToPNG(String fileName, Rectangle screenArea) {
		this.saveToFile(fileName, ImageType.PNG, screenArea);
	}

	public void saveToPNG(String fileName, int x, int y, int width, int height) {
		this.saveToFile(fileName, ImageType.PNG, x, y, width, height);
	}

	public void saveToGIF(String fileName) {
		throw new UnsupportedOperationException("不支持保存到GIF文件");
		// this.saveToFile(fileName, ImageType.GIF);
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		for (int i = 0; i < 5; i++)
			ScreenDumpHelper.getDefaultScreenDumpHelper().saveToJPG(null,
					i * 150, i * 150, 400, 300);
	}
}
