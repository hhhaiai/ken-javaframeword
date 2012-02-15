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
 * @version 2012.02.15
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
        FileOutputStream fileOutputStream = null;   
        JPEGImageEncoder encoder = null;   
        BufferedImage tagImage = null;   
        Image srcImage = null;   
        try{   
            srcImage = ImageIO.read(srcImageFile);
            int srcWidth = srcImage.getWidth(null);//原图片宽度
            int srcHeight = srcImage.getHeight(null);//原图片高度
            int dstWidth = srcWidth;//缩略图宽度
            int dstHeight = srcHeight;//缩略图高度
            float scale = 0;   
            //计算缩略图的宽和高   
            if(srcWidth>maxWidth){   
                dstWidth = maxWidth;   
                scale = (float)srcWidth/(float)maxWidth;   
                dstHeight = Math.round((float)srcHeight/scale);   
            }   
            srcHeight = dstHeight;   
            if(srcHeight>maxHeight){   
                dstHeight = maxHeight;   
                scale = (float)srcHeight/(float)maxHeight;   
                dstWidth = Math.round((float)dstWidth/scale);   
            }
            //生成缩略图
            tagImage = new BufferedImage(dstWidth,dstHeight,BufferedImage.TYPE_INT_RGB);   
            tagImage.getGraphics().drawImage(srcImage,0,0,dstWidth,dstHeight,null);   
            fileOutputStream = new FileOutputStream(dstImageFile);   
            encoder = JPEGCodec.createJPEGEncoder(fileOutputStream);   
            encoder.encode(tagImage);   
        }finally{
        	try{
	            if(fileOutputStream!=null){   
                    fileOutputStream.close();   
                    fileOutputStream = null;
	            }
            }catch(Exception e){
            	e.printStackTrace();
            }
            encoder = null;
            tagImage = null;
            srcImage = null;
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
