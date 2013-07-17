package com.gm.gmview.framework.config;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;

import com.gm.gmview.framework.util.ArrayUtil;

/**
 * spring 配置工厂
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class ConfigFactory {
	private static final ConfigFactory factory = new ConfigFactory();

	private ServletContext servletContext = null; // Servlet上下文
	private String sysPath; // 系统根目录的绝对路径
	private String appContext; // 系统应用名,及中间件中的名称
	private List<String> springXmls = new ArrayList<String>(); // 要加载的spring配置文件路径

	private ConfigFactory() {
	}

	public static ConfigFactory getFactory() {
		return factory;
	}

	public void init(final ServletContext servletContext) {
		this.servletContext = servletContext;
		this.appContext = servletContext.getServletContextName();
		sysPath = servletContext.getRealPath("/");
	}

	/**
	 * 注入Spring配置文件
	 * 
	 * @param xmlPath
	 */
	public void registerSpringXml(final String xmlPath) {
		ArrayUtil.addNoReplaceRepeat(springXmls, xmlPath);
	}

	public void addSpringXmls(String springPath) {
		springXmls.add(springPath.replace("%20", " "));
	}

	/**
	 * 将传入的配置文件和插件加载的Spring配置文件融合并返回
	 * 
	 * @param configLocation
	 *            Spring自己加载的配置文件
	 * @param type
	 *            Spring:ContextLoaderListener加载的;SpringMvc:DispatcherServlet加载的配置文件
	 * @return
	 */
	public String fusionSpringXml(final String configLocation, final String type) {
		return fusionSpringXml(configLocation, getSpringXmls());
	}

	private String fusionSpringXml(final String configLocation,
			final List<String> pluginXmls) {
		List<String> configs = null;
		if (configLocation != null) {
			configs = new ArrayList<String>();
			String[] cls = configLocation.split(",");
			for (String cl : cls) {
				ArrayUtil.addNoReplaceRepeat(configs, cl);
			}
			ArrayUtil.addAllNoReplaceRepeat(configs, pluginXmls);
		} else {
			configs = pluginXmls;
		}
		StringBuffer cfsb = new StringBuffer(100);
		Iterator<String> cfit = configs.iterator();
		while (cfit.hasNext()) {
			cfsb.append(cfit.next()).append(",");
		}
		return cfsb.toString();
	}

	public List<String> getSpringXmls() {
		return springXmls;
	}

	public ServletContext getServletContext() {
		return servletContext;
	}

	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	public String getSysPath() {
		return sysPath;
	}

	public void setSysPath(String sysPath) {
		this.sysPath = sysPath;
	}

	public String getAppContext() {
		return appContext;
	}

	public void setAppContext(String appContext) {
		this.appContext = appContext;
	}

	public void setSpringXmls(List<String> springXmls) {
		this.springXmls = springXmls;
	}

}
