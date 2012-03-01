package com.shine.platform;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;

import com.shine.DBUtil.DBUtil;
import com.shine.Plugin.Plugin;
import com.shine.Plugin.PluginManager;
import com.shine.Plugin.ProjectPlugin;
import com.shine.Plugin.util.PluginTypes;
import com.shine.framework.Ioc.IOCFactory;
import com.shine.framework.core.util.JarLoader;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.XmlUitl;
import com.shine.platform.interfaces.LoggerIf;

/**
 * Platform综合管理类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class PlatformManager {
	private static PlatformManager manager = null;

	private static String PROJECTPATH = "com.shine.project";

	// 系统部署路径
	private String sysPath;
	// 基本配置路径
	private String bootPath = null;
	// 加载工程师名称
	private String projectName = null;
	// 工程class路径
	private String projectClassPath = null;
	// project plugin
	private ProjectPlugin projectPlugin = null;
	// plugins 路径
	private String pluginPath = null;
	// project 配置文件 路径
	private String projectConfigPath = null;

	public static PlatformManager getManager() {
		if (manager == null)
			manager = new PlatformManager();
		return manager;
	}

	public void start() {
		if (this.projectName != null) {
			System.err.println("----[" + this.projectName + "]Starting ----");

			try {
				// 加载工程
				StringBuffer projectClassBuffer = new StringBuffer();
				projectClassBuffer.append("com.shine.project.");
				projectClassBuffer.append(this.projectName);
				projectClassBuffer.append(".");
				projectClassBuffer.append(this.projectName + "Project");
				this.projectClassPath = projectClassBuffer.toString();
				System.out.println(this.projectClassPath);
				projectClassBuffer = null;
				projectPlugin = (ProjectPlugin) ReflectionUtil
						.getClasstoObject(this.projectClassPath);

				// 加载项目插件
				this.projectConfigPath = projectPlugin.getClass().getResource(
						"config/ProjectConfig.xml").getPath().replace("%20",
						" ");
				PluginManager.getManager().loadPlugin(projectPlugin);
				this.loadPlugins();

			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			System.out.println("找不到工程名字");
			this.destroy();
		}
	}

	public void reStart() {
		System.err.println("----[" + this.projectName + "]Restarting ----");
	}

	public void destroy() {
		System.err.println("----[" + this.projectName + "]Destroy ----");
	}

	/**
	 * 加载插件
	 */
	private void loadPlugins() {
		System.err.println("----[load plugins] ----");
		try {
			Document doc = XmlUitl.getFileDocument(this.projectConfigPath);
			List<Element> pluginList = XmlUitl.getAllTag(doc, "plugin");
			for (Element element : pluginList) {
				Map<String, String> map = XmlUitl.getAllAttribute(element);
				if (map.get("type").equals(PluginTypes.CLASSPATH)) {
					try {
						PluginManager.getManager().loadPlugin(
								(Plugin) ReflectionUtil
										.getClasstoObject(makeupLocalPlugin(map
												.get("name"))));
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				map = null;
			}
			pluginList = null;
		} catch (DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 找寻插件文件
	 * 
	 * @param pluginName
	 * @return
	 */
	private String makeupLocalPlugin(String pluginName) {
		StringBuffer pluginPathBuffer = new StringBuffer();
		pluginPathBuffer.append("com.shine.plugins.");
		pluginPathBuffer.append(pluginName);
		pluginPathBuffer.append(".");
		pluginPathBuffer.append(pluginName);
		pluginPathBuffer.append("Plugin");
		return pluginPathBuffer.toString();
	}

	public String getSysPath() {
		return sysPath;
	}

	public void setSysPath(String sysPath) {
		this.sysPath = sysPath;
	}

	public String getBootPath() {
		return bootPath;
	}

	public void setBootPath(String bootPath) {
		this.bootPath = bootPath;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectClassPath() {
		return projectClassPath;
	}

	public void setProjectClassPath(String projectClassPath) {
		this.projectClassPath = projectClassPath;
	}

	public ProjectPlugin getProjectPlugin() {
		return projectPlugin;
	}

	public void setProjectPlugin(ProjectPlugin projectPlugin) {
		this.projectPlugin = projectPlugin;
	}

	public String getPluginPath() {
		return pluginPath;
	}

	public void setPluginPath(String pluginPath) {
		this.pluginPath = pluginPath;
	}

	public String getProjectConfigPath() {
		return projectConfigPath;
	}

	public void setProjectConfigPath(String projectConfigPath) {
		this.projectConfigPath = projectConfigPath;
	}

}
