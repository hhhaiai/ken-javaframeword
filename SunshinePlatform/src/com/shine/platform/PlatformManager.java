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
import com.shine.platform.core.model.BaseProject;
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
	private BaseProject projectPlugin = null;
	// plugins 路径
	private String pluginPath = null;
	// project 配置文件 路径
	private String projectConfigPath = null;

	public static PlatformManager getManager() {
		if (manager == null)
			manager = new PlatformManager();
		return manager;
	}

	/**
	 * 启动平台
	 */
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
				projectPlugin = (BaseProject) ReflectionUtil
						.getClasstoObject(this.projectClassPath);

				// 加载项目插件
				this.projectConfigPath = projectPlugin.getClass().getResource(
						"config/ProjectConfig.xml").getPath().replace("%20",
						" ");

				PluginManager.getManager().loadPlugin(projectPlugin);
				projectPlugin.loadProjectConfigPath(projectConfigPath);

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

	public BaseProject getProjectPlugin() {
		return projectPlugin;
	}

	public void setProjectPlugin(BaseProject projectPlugin) {
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
