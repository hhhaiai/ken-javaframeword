package com.shine.Plugin;

/**
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public abstract class Plugin {
	private String name;
	private String type;
	private String version;
	private String clazz;
	private String description;
	// Plugin状态
	private String status;

	private String sqlPath;

	public Plugin() {

	}

	public Plugin(String name, String type, String version, String clazz,
			String sqlPath, String description) {
		this.name = name;
		this.type = type;
		this.version = version;
		this.clazz = clazz;
		this.sqlPath = sqlPath;
		this.description = description;
	}

	public void start() {
		System.out
				.println("=============插件:" + this.name + "正常启动=============");
		pluginStart();
	}

	public void sleep() {
		System.out
				.println("=============插件:" + this.name + "已经休眠=============");
		pluginSleep();
	}

	public void destroy() {
		System.out
				.println("=============插件:" + this.name + "已经销毁=============");
		pluginDestroy();
	}

	protected abstract void pluginStart();

	protected abstract void pluginSleep();

	protected abstract void pluginDestroy();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getClazz() {
		return clazz;
	}

	public void setClazz(String clazz) {
		this.clazz = clazz;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSqlPath() {
		return sqlPath;
	}

	public void setSqlPath(String sqlPath) {
		this.sqlPath = sqlPath;
	}
}
