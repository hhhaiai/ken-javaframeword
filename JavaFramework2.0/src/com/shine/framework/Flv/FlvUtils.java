package com.shine.framework.Flv;

import java.awt.Dimension;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;

import edu.mit.star.flv.Capture;
import edu.mit.star.flv.CaptureFactory;

public class FlvUtils {
	public static void createFlv(String flvPath, int width, int height)
			throws Exception {
		try {
			OutputStream os = new java.io.FileOutputStream(flvPath);
			int xx = width;
			int yy = height;
			Capture c = CaptureFactory.getCapturer(os, new Dimension(xx, yy));
			int time = 0;
			while (time < 5000) {
				BufferedImage image = c.newFrame();

				image.getGraphics().drawOval(0, 0, xx * time / 5000,
						yy * time / 5000);
				image.flush();

				c.writeFrame(image, time);
				time += 250;
				System.out.println("Generating " + time + " ms frame.");
			}
			os.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}
}
