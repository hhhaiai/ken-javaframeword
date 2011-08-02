package com.shine.framework.core.util;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;

public class FileResult extends ArrayList<String> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String filePath = null;

	private int rows = 1000;

	private String encoding = "utf-8";

	private long tag = 0;

	public FileResult() {
	}

	public FileResult(String filePath) {
		this.filePath = filePath;
	}

	public FileResult(String filePath, int rows) {
		this.filePath = filePath;
		this.rows = rows;
	}

	public FileResult(String filePath, int rows, String encoding) {
		this.filePath = filePath;
		this.rows = rows;
		this.encoding = encoding;
	}

	public int next() {
		// 清除所有数据
		this.clear();

		encoding = encoding.trim();
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
				int i = 0;
				int num = 0;
				String data = "";
				while ((data = br.readLine()) != null) {
					if (i > rows - 1)
						break;

					if (num == tag || num > tag) {
						this.add(data);
						i++;
						tag++;
					}
					num++;
				}
			} catch (Exception e) {
				System.err.println(FileUtil.class.toString() + ":读取file"
						+ filePath + "出错" + e.toString());
			}
		} catch (Exception e) {
			System.err.println(FileUtil.class.toString() + ":读取file" + filePath
					+ "出错!");
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
		return this.size();
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public int getRows() {
		return rows;
	}

	public void setRows(int rows) {
		this.rows = rows;
	}

	public String getEncoding() {
		return encoding;
	}

	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}

	public long getTag() {
		return tag;
	}

	public void setTag(long tag) {
		this.tag = tag;
	}

	public static void main(String args[]) {
		FileResult result = new FileResult("e://123.txt");
		while (result.next() != 0) {
			for (String s : result) {
				System.out.println(s);
			}
		}
	}
}
