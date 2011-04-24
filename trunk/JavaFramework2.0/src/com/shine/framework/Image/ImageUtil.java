package com.shine.framework.Image;

import javax.imageio.ImageIO;  
import java.awt.image.BufferedImage;  
import java.awt.image.ColorModel;  
import java.awt.image.WritableRaster;  
import java.awt.*;  
import java.awt.geom.AffineTransform;  
import java.io.File; 

//import net.dapper.scrender.Scrender;


public class ImageUtil {
	/**
	 * 缩放图片
	 * @param source
	 * @param targetW
	 * @param targetH
	 * @return
	 */
	public static BufferedImage resize(BufferedImage source, int targetW,
			int targetH) {
		int type = source.getType();
		BufferedImage target = null;
		double sx = (double) targetW / source.getWidth();
		double sy = (double) targetH / source.getHeight();
		if (sx > sy) {
			sx = sy;
			targetW = (int) (sx * source.getWidth());
		} else {
			sy = sx;
			targetH = (int) (sy * source.getHeight());
		}
		if (type == BufferedImage.TYPE_CUSTOM) { // handmade
			ColorModel cm = source.getColorModel();
			WritableRaster raster = cm.createCompatibleWritableRaster(targetW,
					targetH);
			boolean alphaPremultiplied = cm.isAlphaPremultiplied();
			target = new BufferedImage(cm, raster, alphaPremultiplied, null);
		} else
			target = new BufferedImage(targetW, targetH, type);
		Graphics2D g = target.createGraphics();
		g.setRenderingHint(RenderingHints.KEY_RENDERING,
				RenderingHints.VALUE_RENDER_QUALITY);
		g.drawRenderedImage(source, AffineTransform.getScaleInstance(sx, sy));
		g.dispose();
		return target;
	}

	/**
	 * 缩放图片
	 * @param fromFileStr
	 * @param saveToFileStr
	 * @param width
	 * @param hight
	 * @throws Exception
	 */
	public static void saveImageAsJpg(String fromFileStr, String saveToFileStr,
			int width, int hight) throws Exception {
		BufferedImage srcImage;
		String imgType = "JPEG";
		if (fromFileStr.toLowerCase().endsWith(".png")) {
			imgType = "PNG";
		}
		File saveFile = new File(saveToFileStr);
		File fromFile = new File(fromFileStr);
		srcImage = ImageIO.read(fromFile);
		if (width > 0 || hight > 0) {
			srcImage = resize(srcImage, width, hight);
		}
		ImageIO.write(srcImage, imgType, saveFile);
	}
	
//	public static void htmlToImage(String url,String fileUrl){
//		try{
//			 Scrender scrender = new Scrender();
//			 scrender.init();
//	         scrender.render("http://www.oschina.net", new File("e:/oschina.index.html.jpg"));
//		}catch(Exception e){
//			e.printStackTrace();
//		}
//	}
}
