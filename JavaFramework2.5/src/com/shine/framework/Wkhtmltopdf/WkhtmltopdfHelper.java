package com.shine.framework.Wkhtmltopdf;

import com.shine.framework.core.util.CmdUtil;

/**
 * 根据网址导出pdf
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class WkhtmltopdfHelper {
	// Wkhtmltopdf的安装路径 windows下面为wkhtmltopdf.exe路径，linux下面为wkhtmltopdf-i386路径
	private String path;

	/**
	 * 生成pdf
	 * 
	 * @param path
	 * @param url
	 * @param pdfPath
	 */
	public void createPdf(String path, String url, String pdfPath) {
		this.path = path;

		StringBuffer cmd = new StringBuffer(200);
		if (System.getProperty("os.name").startsWith("Windows")) {
			cmd.append(path);
			cmd.append(" \"");
			cmd.append(url);
			cmd.append(" \" ");
			cmd.append(pdfPath);
		} else {
			cmd.append(path);
			cmd.append(" ");
			cmd.append(url);
			cmd.append(" ");
			cmd.append(pdfPath);
		}
		CmdUtil.execute(cmd.toString());
		cmd = null;
	}

	/**
	 * 生成pdf
	 * 
	 * @param url
	 * @param pdfPath
	 */
	public void createPdf(String url, String pdfPath) {
		createPdf(this.path, url, pdfPath);
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}
