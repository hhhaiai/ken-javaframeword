package com.shine.platform.core.model;

import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;

import com.shine.Plugin.Plugin;
import com.shine.Plugin.PluginManager;
import com.shine.Plugin.ProjectPlugin;
import com.shine.Plugin.util.PluginTypes;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.XmlUitl;

public abstract class BaseProject extends ProjectPlugin {

	/**
	 * 加载配置文件
	 * 
	 * @param projectConfigPath
	 * @throws DocumentException
	 */
	public void loadProjectConfigPath(String projectConfigPath)
			throws DocumentException {
		this.projectConfigPath = projectConfigPath;
		Document doc = XmlUitl.getFileDocument(this.projectConfigPath);

		// 加载项目名称
		List<Element> nameList = XmlUitl.getAllTag(doc, "name");
		this.setProjectName(nameList.get(0).getText());
		nameList = null;

		// 加载项目logo
		List<Element> logoList = XmlUitl.getAllTag(doc, "logo");
		this.setLogoPath(logoList.get(0).getText());
		logoList = null;

		// 加载项目pageType
		List<Element> pageTypeList = XmlUitl.getAllTag(doc, "pageType");
		this.setPageType(pageTypeList.get(0).getText());
		pageTypeList = null;
		
		// 加载项目index
		List<Element> indexTypeList = XmlUitl.getAllTag(doc, "index");
		this.setIndex(indexTypeList.get(0).getText());
		indexTypeList = null;

		// 加载插件
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
}
