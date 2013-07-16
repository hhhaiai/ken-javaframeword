package com.gm.gmview.platform;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.dom4j.Element;

import com.gm.gmview.framework.config.LoadSpringApplicationContext;
import com.gm.gmview.framework.config.StrutsFilterDispatcher;
import com.gm.gmview.framework.util.ApplicationContextUtil;
import com.gm.gmview.platform.plugin.IPlugin;
import com.gm.gmview.platform.util.PluginMap;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.XmlUitl;

/**
 * 平台入口类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class PlatformManager {
	private static PlatformManager manager = null;

	private String frameworkXmlPath = null;
	// webcontent path
	private String sysPath;
	// 上下文名称
	private String contextName;
	// tomcat信息
	private final Map<String, Object> attributes = new HashMap<String, Object>();
	// 项目名称
	private String projectName;
	// 项目plugin path
	private String projectPath;
	// plugin 容器
	private PluginMap pluginMap = new PluginMap();

	public static PlatformManager getManager() {
		if (manager == null)
			manager = new PlatformManager();
		return manager;
	}

	public void init(ServletContext appContext) {
		System.out.println("开始加载");
		this.sysPath = appContext.getRealPath("/");
		this.contextName = appContext.getServletContextName();
		attributes.put("tomcatInfo", appContext.getServerInfo());

		// 设置系统路径
		System.setProperty("appDir", sysPath + "/WEB-INF/config/");

		try {
			List<Element> list = XmlUitl.getAllTag(
					XmlUitl.getFileDocument(sysPath
							+ "/WEB-INF/config/framework.xml"), "project");
			if (list.size() == 1) {
				this.projectName = list.get(0).getText();
				this.projectPath = "com.gm.gmview.project."
						+ this.projectName
						+ "."
						+ String.valueOf(
								(char) (this.projectName.charAt(0) - 32))
								.concat(this.projectName.substring(1))
						+ "ProjectPlugin";
				loadProjectPlugin();
			} else {
				System.out.println("工程配置出错，加载默认产品......");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		StrutsFilterDispatcher.registerXML(getClass().getResource(
				"config/platformStruts.xml").getPath());
	}

	/**
	 * 加载项目插件
	 */
	private void loadProjectPlugin() {
		try {
			System.out.println(this.projectPath);
			// 加载项目插件
			IPlugin iPlugin = (IPlugin) ReflectionUtil
					.getClasstoObject(this.projectPath);
			iPlugin.init();
			iPlugin.start();
			pluginMap.put(iPlugin.getPluginName(), iPlugin);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 反射回去插件接口
	 * 
	 * @param pluginPath
	 * @return
	 */
	public IPlugin getPlugin(String pluginName) throws Exception {

		return null;
	}
}
