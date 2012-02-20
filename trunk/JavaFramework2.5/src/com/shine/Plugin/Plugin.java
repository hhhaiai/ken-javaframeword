package com.shine.Plugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.shine.Plugin.util.PluginStatus;
import com.shine.framework.core.util.XmlConverUtil;

/**
 * 插件基类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public abstract class Plugin {
	protected String name;
	// Plugin的版本信息，版本信息的修改会直接影响到是否重新加载数据库
	protected String version;
	// 插件类型 classpath,jar
	protected String type;
	protected String description;
	// Plugin状态
	protected String status;

	protected String sqlPath;

	public Plugin() {

	}

	public Plugin(String name, String version, String type, String sqlPath,
			String description) {
		this.initPlugin(name, version, type, sqlPath, description);
	}

	public void initPlugin(String name, String version, String type,
			String sqlPath, String description) {
		this.name = name;
		this.version = version;
		this.type = type;
		this.sqlPath = sqlPath;
		this.description = description;
	}

	protected void start() {
		System.out
				.println("=============插件:" + this.name + "正常启动=============");
		pluginStart();
		this.status = PluginStatus.RUN;
	}

	protected void sleep() {
		System.out
				.println("=============插件:" + this.name + "已经休眠=============");
		pluginSleep();
		this.status = PluginStatus.SLEEP;
	}

	protected void destroy() {
		System.out
				.println("=============插件:" + this.name + "已经销毁=============");
		pluginDestroy();
		this.status = PluginStatus.DESTROY;
	}

	protected abstract void pluginStart();

	protected abstract void pluginSleep();

	protected abstract void pluginDestroy();

	public String printPluginStatus() {
		try {
			Map<String, String> nameMap = new HashMap<String, String>();
			nameMap.put("name", this.name);

			Map<String, String> versionMap = new HashMap<String, String>();
			versionMap.put("version", this.version);

			Map<String, String> typeMap = new HashMap<String, String>();
			typeMap.put("type", this.type);

			Map<String, String> descriptionMap = new HashMap<String, String>();
			descriptionMap.put("description", this.description);

			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("status", this.status);

			Map<String, String> sqlPathMap = new HashMap<String, String>();
			sqlPathMap.put("sqlPath", this.sqlPath);

			List<Map> list = new ArrayList<Map>();
			list.add(nameMap);
			list.add(versionMap);
			list.add(typeMap);
			list.add(descriptionMap);
			list.add(statusMap);
			list.add(sqlPathMap);

			nameMap = null;
			versionMap = null;
			typeMap = null;
			descriptionMap = null;
			statusMap = null;
			sqlPathMap = null;

			return XmlConverUtil.listtoXml(list);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
