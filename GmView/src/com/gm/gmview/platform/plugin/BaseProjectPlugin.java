package com.gm.gmview.platform.plugin;

/**
 * 项目插件抽象类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public abstract class BaseProjectPlugin extends BasePlugin {
	protected String projectName;

	protected String licensePath;

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getLicensePath() {
		return licensePath;
	}

	public void setLicensePath(String licensePath) {
		this.licensePath = licensePath;
	}
}
