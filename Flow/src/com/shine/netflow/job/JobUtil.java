package com.shine.netflow.job;

import java.util.List;

import org.dom4j.Element;

import com.shine.framework.JobUtil.QuartzSchedulerFactory;
import com.shine.framework.JobUtil.model.QuartzJob;
import com.shine.framework.core.util.XmlUitl;
import com.shine.sourceflow.config.ConfigManager;

/**
 * 任务调度管理工具类
 */
public class JobUtil {
	private static JobUtil jobUtil = null;

	private JobUtil() {

	}

	public static JobUtil getInstance() {
		if (jobUtil == null) {
			jobUtil = new JobUtil();
		}
		return jobUtil;
	}

	public void init() {
		List<Element> schedulers = XmlUitl.
			getAllElement(ConfigManager.getManager().getAttribute("schedulers"));
		// 遍历所有元素并将计划任务添加到计划任务工厂中
		for (Element element : schedulers) {
			String scheduler = element.getText();
			try {
				QuartzJob job = (QuartzJob)Class.forName(scheduler).newInstance();
				QuartzSchedulerFactory.getFactory().register(job);
			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
		}
		// 启动计划任务
		QuartzSchedulerFactory.getFactory().start();
	}
}
