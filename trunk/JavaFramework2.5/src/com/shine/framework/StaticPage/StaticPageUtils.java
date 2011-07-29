package com.shine.framework.StaticPage;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class StaticPageUtils {
	final static Object lock = new Object();

	public static void makeHtml(String page, String filePath) {
		makeHtml(page, filePath, "UTF-8");
	}

	public static void makeHtml(String page, String filePath, String chartset) {
		synchronized (lock) {
			HttpURLConnection huc = null;
			BufferedReader br = null;
			BufferedWriter bw = null;
			try {
				huc = (HttpURLConnection) new URL(page).openConnection();
				System.setProperty("sun.net.client.defaultConnectTimeout",
						"30000");
				System
						.setProperty("sun.net.client.defaultReadTimeout",
								"30000");
				huc.connect();
				InputStream stream = huc.getInputStream();
				bw = new BufferedWriter(new OutputStreamWriter(
						new FileOutputStream(filePath), chartset));
				br = new BufferedReader(new InputStreamReader(stream, chartset));
				String line;
				while ((line = br.readLine()) != null) {
					if (line.trim().length() > 0) {
						bw.write(line);
						bw.newLine();
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				try {
					br.close();
					bw.close();
					huc.disconnect();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
}
