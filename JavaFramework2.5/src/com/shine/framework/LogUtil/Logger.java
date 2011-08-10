package com.shine.framework.LogUtil;

import org.dom4j.Document;

import com.shine.framework.JobUtil.QuartzSchedulerFactory;
import com.shine.framework.LogUtil.model.LogFileJob;
import com.shine.framework.core.util.DateUtil;
import com.shine.framework.core.util.FileUtil;
import com.shine.framework.core.util.XmlUitl;

/**
 * Logger 系统日志
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 2.0 2010-11-30
 */
public class Logger {
	private static boolean load = false;
	private static Logger log = null;

	private String folderPath;
	private boolean showConsole = false;

	public final static Logger getInstance() {
		if (log == null)
			log = new Logger();
		if (!load)
			System.out.print("Log uninit");
		return log;
	}

	/**
	 * 初始化
	 * 
	 * @param folderPath
	 * @param showConsole
	 */
	public void init(String folderPath, boolean showConsole) {
		this.folderPath = folderPath;
		this.showConsole = showConsole;

		// 第一次初始化
		QuartzSchedulerFactory.getFactory()
				.register(new LogFileJob(folderPath));
		createNewLogFile(folderPath);

		load = true;
	}

	/**
	 * 初始化
	 * 
	 * @param xmlConfigPath
	 */
	public void init(String xmlConfigPath) {
		try {
			Document doc = XmlUitl.getFileDocument(xmlConfigPath);
			if (XmlUitl.getAllElement(doc.getRootElement(), "showConsole").get(
					0).getText().equals("true"))
				showConsole = true;
			init(XmlUitl.getAllElement(doc.getRootElement(), "logfolder")
					.get(0).getText(), showConsole);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 记录错误
	 * 
	 * @param errorString
	 */
	public void log(String errorString) {
		if (!load) {
			System.err.println(errorString);
			return;
		}

		if (showConsole)
			System.err.println(errorString);
		FileUtil.appandFile(getNowFile(folderPath), "\r\n" + errorString);
	}

	/**
	 * 记录错误
	 * 
	 * @param e
	 */
	public void log(Exception e) {
		String errorString = e.getMessage();
		if (!load) {
			System.err.println(errorString);
			return;
		}

		if (showConsole)
			System.err.println(errorString);
		FileUtil.appandFile(getNowFile(folderPath), "\r\n" + errorString);
	}

	/**
	 * 建立新的log文件夹
	 * 
	 * @param folderPath
	 */
	private void createNewLogFile(String folderPath) {
		FileUtil.createFolder(folderPath);
		FileUtil.createFile(getNowFile(folderPath));
	}

	/**
	 * 建立新的log文件
	 * 
	 * @param folderPath
	 * @return
	 */
	private String getNowFile(String folderPath) {
		if (folderPath != null && folderPath.length() != 0)
			return folderPath + "\\" + DateUtil.getCurrentDate() + ".log";
		else
			return DateUtil.getCurrentDate() + ".log";
	}

	public void clean() {
		log = null;
	}
}
