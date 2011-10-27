package com.shine.framework.ScreenDump;

import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

/**
 * 截屏程序
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class ScreenDumpHelper {
	private static String defaultImageFormat = "jpg";

	/**
	 * 截屏
	 * 
	 * @param fileName
	 * @param format
	 * @param x
	 * @param y
	 * @param width
	 * @param height
	 * @throws Exception
	 */
	public static void snapShot(String fileName, String format, int x, int y,
			int width, int height) throws Exception {
		Dimension d = null;
		try {
			d = Toolkit.getDefaultToolkit().getScreenSize();
			// 拷贝屏幕到一个BufferedImage对象screenshot
			BufferedImage screenshot = (new Robot())
					.createScreenCapture(new Rectangle(x, y, width, height));
			// 根据文件前缀变量和文件格式变量，自动生成文件名
			File f = new File(fileName);
			System.out.print("Save File " + fileName);
			// 将screenshot对象写入图像文件
			ImageIO.write(screenshot, format, f);
			System.out.print("..Finished!\n");
		} catch (Exception ex) {
			throw ex;
		} finally {
			if (d != null)
				d = null;
		}
	}

	/**
	 * 截屏
	 * 
	 * @param fileName
	 * @param format
	 * @throws Exception
	 */
	public static void snapShot(String fileName, String format)
			throws Exception {
		Dimension d = null;
		try {
			d = Toolkit.getDefaultToolkit().getScreenSize();
			snapShot(fileName, format, 0, 0, d.width, d.height);
		} catch (Exception ex) {
			throw ex;
		} finally {
			if (d != null)
				d = null;
		}
	}

	/**
	 * 截屏
	 * 
	 * @param fileName
	 * @throws Exception
	 */
	public static void snapShot(String fileName) throws Exception {
		Dimension d = null;
		try {
			d = Toolkit.getDefaultToolkit().getScreenSize();
			snapShot(fileName, defaultImageFormat, 0, 0, d.width, d.height);
		} catch (Exception ex) {
			throw ex;
		} finally {
			if (d != null)
				d = null;
		}
	}

	public static void main(String[] a) throws Exception {
		ScreenDumpHelper.snapShot("e:\\123.jpg");
	}
}
