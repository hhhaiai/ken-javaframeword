package com.shine.Plugin;

import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;

import com.shine.Plugin.util.PluginStatus;
import com.shine.Plugin.util.PluginTypes;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.XmlUitl;

public abstract class ProjectPlugin extends Plugin {

	private String projectName;
	private String logoPath;
	private Map<String, Plugin> resourceMap;
	private String pageType;
	protected String projectConfigPath;
	protected String index;

	protected void start() {
		System.out.println("=============插件:" + this.name
				+ "为项目插件正常启动,并且加载相关项目插件=============");
		pluginStart();
		this.status = PluginStatus.RUN;
	}

	protected void sleep() {
		System.out.println("=============插件:" + this.name
				+ "为项目插件，无法休眠=============");
	}

	protected void destroy() {
		System.out.println("=============插件:" + this.name
				+ "为项目插件，无法销毁=============");
	}

	@Override
	protected void pluginDestroy() {
		// TODO Auto-generated method stub
	}

	@Override
	protected void pluginSleep() {
		// TODO Auto-generated method stub
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getLogoPath() {
		return logoPath;
	}

	public void setLogoPath(String logoPath) {
		this.logoPath = logoPath;
	}

	public Map<String, Plugin> getResourceMap() {
		return resourceMap;
	}

	public void setResourceMap(Map<String, Plugin> resourceMap) {
		this.resourceMap = resourceMap;
	}

	public String getPageType() {
		return pageType;
	}

	public void setPageType(String pageType) {
		this.pageType = pageType;
	}

	public String getProjectConfigPath() {
		return projectConfigPath;
	}

	public void setProjectConfigPath(String projectConfigPath) {
		this.projectConfigPath = projectConfigPath;
	}

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

}
