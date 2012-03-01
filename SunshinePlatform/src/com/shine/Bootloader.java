package com.shine;

import java.util.List;
import java.util.Map;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.dom4j.Document;
import org.dom4j.Element;

import com.shine.framework.core.util.XmlUitl;
import com.shine.platform.PlatformManager;

public class Bootloader implements ServletContextListener {

	private String bootPath = null;

	public void contextInitialized(ServletContextEvent event) {
		System.err.println("----[SunshinePlatform]Starting ----");
		PlatformManager.getManager().setSysPath(
				event.getServletContext().getRealPath("/"));
		this.bootPath = PlatformManager.getManager().getSysPath()
				+ "WEB-INF\\config\\boot.xml";

		if (this.getProjectName() == null) {
			return;
		}
		PlatformManager.getManager().setBootPath(this.bootPath);
		PlatformManager.getManager().setProjectName(this.getProjectName());
		PlatformManager.getManager().start();

		System.err.println("----[SunshinePlatform]Start complete----");
	}

	public void contextDestroyed(ServletContextEvent event) {
		System.err.println("----[SunshinePlatform]Destroying ----");
	}

	public String getProjectName() {
		try {
			if (this.bootPath != null) {
				Document doc = XmlUitl.getFileDocument(this.bootPath);
				List<Element> list = XmlUitl.getAllTag(doc, "project");
				doc = null;
				if (list.size() != 0) {
					Map<String, String> map = XmlUitl.getAllAttribute(list
							.get(0));
					return map.get("name");
				} else
					System.out.println("配置文件出错");
				list = null;
			} else
				System.out.println("缺少配置文件");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
