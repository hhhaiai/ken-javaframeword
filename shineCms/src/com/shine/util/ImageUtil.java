package com.shine.util;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

/**
 * 图片工具类
 * @author JiangKunpeng 2012.02.15
 * @version 2013.01.25
 */
final public class ImageUtil {
	private ImageUtil(){
	}
	
	//常见图片的MIIE内容类型
	public final static String[] IMAGE_MIIES = new String[]{"image/png","image/x-png","image/gif",
			"image/bmp","image/x-ms-bmp","image/jpeg","image/pjpeg",
			"image/tiff","image/x-icon","image/x-rgb"};
	
	/**
	 * 判断MIIE内容类型是否是图片
	 * @param contentType
	 * @return
	 */
	public final static boolean isImageByContentType(String contentType){
		if(contentType==null)
			return false;
		contentType = contentType.toLowerCase();
		for(String miie : IMAGE_MIIES){
			if(miie.equals(contentType))
				return true;
		}
		return false;
	}
	
	/**
	 * 获取图片长宽
	 * @param imageFile
	 * @return int[长,宽]
	 */
	public final static int[] getImageWidthAndHeight(File imageFile){
		int[] result = new int[2];
		BufferedImage image = null;
		try {
			image = ImageIO.read(imageFile);
			result[0] = image.getWidth();
			result[1] = image.getHeight();
		} catch (IOException e) {
			e.printStackTrace();
		} finally{
			image = null;
		}
		return result;
	}
	
	/**  
     * 生成缩略图(宽度与高度将按比例缩写)
     * @param srcImageFile 源图片文件
     * @param dstImageFile 目标图片文件
     * @param maxWidth 目标缩略图的最大宽度
     * @param maxHeight 目标缩略图的最大高度
     * @throws Exception
     */  
    public final static void makeSmallImage(File srcImageFile,File dstImageFile,int maxWidth,int maxHeight) throws Exception {   
    	FileOutputStream os = null;
		BufferedImage bfImage = null;
		JPEGImageEncoder encoder = null;
		float width = maxWidth;
		float height = maxHeight;
		try {
			BufferedImage image = ImageIO.read(srcImageFile);

			// 获得缩放的比例
			double ratio = 1.0;
			// 判断如果高、宽都不大于设定值，则不处理
			int imageHeight = image.getHeight();
			int imageWidth = image.getWidth();
			if (imageHeight > height || imageWidth > width) {
				if (imageHeight > imageWidth) {
					ratio = height / imageHeight;
				} else {
					ratio = width / imageWidth;
				}
			}
			// 计算新的图面宽度和高度
			int newWidth = (int) (imageWidth * ratio);
			int newHeight = (int) (imageHeight * ratio);

			bfImage = new BufferedImage(newWidth, newHeight,BufferedImage.TYPE_INT_RGB);
			bfImage.getGraphics().drawImage(image.getScaledInstance(newWidth, newHeight,Image.SCALE_SMOOTH), 0, 0, null);

			os = new FileOutputStream(dstImageFile);
			encoder = JPEGCodec.createJPEGEncoder(os);
			encoder.encode(bfImage);
		} finally{
			if(os!=null)
				os.close();
			bfImage = null;
			encoder = null;
		}
    }
    
    /** 
     * 把水印图片印刷到图片上
     * @param pressImg 水印文件
     * @param targetImg 目标文件
     * @param x 偏移量
     * @param y
     */
    public final static void pressImage(File pressImg, File targetImg,int x, int y) {
    	FileOutputStream out = null;
        try {
            //目标图片
            Image src = ImageIO.read(targetImg);
            int wideth = src.getWidth(null);
            int height = src.getHeight(null);
            BufferedImage image = new BufferedImage(wideth, height,BufferedImage.TYPE_INT_RGB);
            Graphics g = image.createGraphics();
            g.drawImage(src, 0, 0, wideth, height, null);
            
            //水印图片
            Image src_biao = ImageIO.read(pressImg);
            int wideth_biao = src_biao.getWidth(null);
            int height_biao = src_biao.getHeight(null);
            g.drawImage(src_biao, wideth - wideth_biao-x,height - height_biao-y, wideth_biao, height_biao, null);
            //刷水印结束
            g.dispose();
            out = new FileOutputStream(targetImg);
            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
            encoder.encode(image);
        } catch (Exception e) {
            e.printStackTrace();
        } finally{        	
        	try {
        		if(out!=null)
        			out.close();
        	} catch (IOException e1) {
        		e1.printStackTrace();
        	}
        }
    }
    
    /** 
     * 打印文字印到图片上
     * 
     * @param pressText 文字
     * @param targetImg 目标图片
     * @param fontName 字体名
     * @param fontStyle 字体样式
     * @param fontSize 字体大小
     * @param color 字体颜色
     * @param x 偏移量
     * @param y
     */

    public static void pressText(String pressText, File targetImg,
            String fontName, int fontStyle, int fontSize,Color color, int x, int y) {
    	FileOutputStream out = null;
        try {
            Image src = ImageIO.read(targetImg);
            int wideth = src.getWidth(null);
            int height = src.getHeight(null);
            BufferedImage image = new BufferedImage(wideth, height, BufferedImage.TYPE_INT_RGB);
            Graphics g = image.createGraphics();
            g.drawImage(src, 0, 0, wideth, height, null);
            g.setColor(color);
            g.setFont(new Font(fontName, fontStyle, fontSize));

            g.drawString(pressText, wideth - fontSize*pressText.length() - x, height - fontSize - y);
            g.dispose();
            out = new FileOutputStream(targetImg);
            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
            encoder.encode(image);
        } catch (Exception e) {
            e.printStackTrace();
        } finally{
        	try {
        		if(out!=null)
        			out.close();
        	} catch (IOException e1) {
        		e1.printStackTrace();
        	}
        }
    }
}
