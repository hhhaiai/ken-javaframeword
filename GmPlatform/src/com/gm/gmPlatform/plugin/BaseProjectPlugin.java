package com.gm.gmPlatform.plugin;

/**
 * 项目插件抽象�?
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

	public abstract void loadFunctionPlugins();

	public abstract void loadDB();
}
