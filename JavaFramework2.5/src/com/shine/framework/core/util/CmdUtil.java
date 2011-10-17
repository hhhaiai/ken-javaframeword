package com.shine.framework.core.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

public class CmdUtil {
	/**
	 * 批量执行cmd命令
	 * 
	 * @param cmd
	 */
	public static String executeCmd(String cmd[]) {
		try {
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < cmd.length; i++) {
				Process pro = null;
				pro = Runtime.getRuntime().exec(cmd[i]);
				// ProcessBuilder pb = new ProcessBuilder(cmd[i]);
				// pb.redirectErrorStream(true);
				// pro = pb.start();
				BufferedReader br = null;
				InputStreamReader isr = new InputStreamReader(pro
						.getInputStream(), "utf-8");
				br = new BufferedReader(isr);
				String line = br.readLine();
				while (line != null) {
					sb.append(line + "\r\n");
					line = br.readLine();
				}
				// System.out.println(sb.toString());

				try {
					pro.waitFor();
				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					try {
						if (br != null) {
							br.close();
							br = null;
						}
						if (isr != null) {
							isr.close();
							isr = null;
						}
						if (pro != null) {
							pro.destroy();
							pro = null;
						}
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 顺序执行cmd命令
	 * 
	 * @param cmd
	 */
	public static String execute(String... cmd) {
		return executeCmd(cmd);
	}

	/**
	 * 执行cmd file，linux为sh，windows为bat
	 * 
	 * @param filePath
	 */
	public static void exeuteCmdFile(String filePath) {
		try {
			Runtime run = Runtime.getRuntime();
			Process pro = run.exec(filePath);
			// 删除file
			FileUtil.deleteFile(filePath.replace("\"", ""));

			BufferedReader br = null;
			StringBuffer sb = new StringBuffer();
			InputStreamReader isr = new InputStreamReader(pro.getInputStream(),
					"utf-8");
			br = new BufferedReader(isr);
			String line = br.readLine();
			while (line != null) {
				sb.append(line + "\r\n");
				line = br.readLine();
				System.err.println(line);
			}

			try {
				pro.waitFor();
			} catch (InterruptedException e) {
				e.printStackTrace();
			} finally {
				try {
					if (br != null) {
						br.close();
						br = null;
					}
					if (isr != null) {
						isr.close();
						isr = null;
					}
					if (pro != null) {
						pro.destroy();
						pro = null;
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 执行cmd file，linux为sh，windows为bat
	 * 
	 * @param filePath
	 */
	public static void exeuteCmdFileNoMonitor(String filePath) {
		try {
			Runtime.getRuntime().exec(filePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 生成bat file
	 * 
	 * @param cmd
	 * @return
	 */
	public static String createBatFile(String... cmd) {
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			String path = System.getProperty("user.dir") + File.separator
					+ "temp" + DateUtil.getCurrentDateTimeAsId() + ".bat";
			FileUtil.createFile(path);
			StringBuffer content = new StringBuffer();
			for (int i = 0; i < cmd.length; i++) {
				content.append(cmd[i] + "\r\n");
			}
			FileUtil.writeFile(path, content.toString());
			return "\"" + path + "\"";
		} else {
			String path = System.getProperty("user.dir") + File.separator
					+ "temp.sh";
			FileUtil.createFile(path);
			StringBuffer content = new StringBuffer();
			content.append("#!/bin/sh").append("\n");
			for (int i = 0; i < cmd.length; i++) {
				content.append(cmd[i] + "\r\n");
			}
			FileUtil.writeFile(path, content.toString());
			return path;
		}
	}

	/**
	 * 批量执行cmd命令
	 * 
	 * @param cmd
	 */
	public static void exeuteBatCmd(String... cmd) {
		try {
			String path = createBatFile(cmd);
			Thread.sleep(3000);
			exeuteCmdFile(path);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		try {
			Runtime
					.getRuntime()
					.exec(
							"cmd /c start /D\"D:\\ProgramFiles\\apache-tomcat-6.0.24\\bin\" shutdown.bat");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
