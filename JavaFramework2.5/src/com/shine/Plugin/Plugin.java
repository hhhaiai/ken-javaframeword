package com.shine.Plugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.shine.Plugin.util.PluginStatus;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.XmlConverUtil;

/**
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public abstract class Plugin {
	private String name;
	private String type;
	// Plugin的版本信息，版本信息的修改会直接影响到是否重新加载数据库
	private String version;
	private String description;
	// Plugin状态
	private String status;

	private String sqlPath;

	public Plugin() {

	}

	public Plugin(String name, String type, String version, String method,
			String sqlPath, String description) {
		this.name = name;
		this.type = type;
		this.version = version;
		this.sqlPath = sqlPath;
		this.description = description;
	}

	public void start() {
		System.out
				.println("=============插件:" + this.name + "正常启动=============");
		pluginStart();
		this.status = PluginStatus.RUN;
	}

	public void sleep() {
		System.out
				.println("=============插件:" + this.name + "已经休眠=============");
		pluginSleep();
		this.status = PluginStatus.SLEEP;
	}

	public void destroy() {
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

			Map<String, String> typeMap = new HashMap<String, String>();
			typeMap.put("type", this.type);

			Map<String, String> versionMap = new HashMap<String, String>();
			versionMap.put("version", this.version);

			Map<String, String> descriptionMap = new HashMap<String, String>();
			descriptionMap.put("description", this.description);

			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("status", this.status);

			Map<String, String> sqlPathMap = new HashMap<String, String>();
			sqlPathMap.put("sqlPath", this.sqlPath);

			List<Map> list = new ArrayList<Map>();
			list.add(nameMap);
			list.add(typeMap);
			list.add(versionMap);
			list.add(descriptionMap);
			list.add(statusMap);
			list.add(sqlPathMap);

			nameMap = null;
			typeMap = null;
			versionMap = null;
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
