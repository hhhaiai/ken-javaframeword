package com.shine.platform.context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.jdom.Element;
import org.springframework.context.ApplicationContext;

import com.shine.platform.plugin.PluginContext;
import com.shine.util.xml.JDomUtil;

/**
 * 系统配置工厂
 * @author JiangKunpeng 2012.02.15
 * @version 2012.02.15
 */
final public class ConfigFactory {
	private static final ConfigFactory factory = new ConfigFactory();
	private Map<String, Object> attributes = new HashMap<String, Object>();
	private String sysPath;
	private ApplicationContext springContext;
	private List<String> springPluginXmls = new ArrayList<String>();
	private List<String> springMvcPluginXmls = new ArrayList<String>();
	private ConfigFactory(){
	}
	
	public static ConfigFactory getFactory(){
		return factory;
	}
	
	public void init(final ServletContext servletContext){
		sysPath = servletContext.getRealPath("/");
		loadXmlConfig();
	}
	
	private void loadXmlConfig(){
		String sysXmlPath = sysPath + "/WEB-INF/classes/system.xml";
		Element root = JDomUtil.file2Doc(sysXmlPath).getRootElement();
		String bootXmlPath = root.getChildText("boot");
		bootXmlPath = sysPath + "/WEB-INF/classes/" + bootXmlPath;
		Element bootEle = JDomUtil.file2Doc(bootXmlPath).getRootElement();
		List<Element> plugins = bootEle.getChild("plugins").getChildren();
		if(plugins!=null){
			for(Element plugin:plugins){
				PluginContext.getContext().registerPlugin(plugin.getText());
			}
		}
	}
	
	/**
	 * 注入Spring插件配置文件
	 * @param xmlPath
	 */
	public void registerSpringPluginXml(final String xmlPath){
		springPluginXmls.add(xmlPath);
	}
	
	/**
	 * 注入SpringMvc插件配置文件
	 * @param xmlPath
	 */
	public void registerSpringMvcPluginXml(final String xmlPath){
		springMvcPluginXmls.add(xmlPath);
	}

	public String getSysPath() {
		return sysPath;
	}
	public Object getAttribute(final String name){
		return attributes.get(name);
	}
	public ApplicationContext getSpringContext() {
		return springContext;
	}
	public void setSpringContext(ApplicationContext springContext) {
		this.springContext = springContext;
	}
	public List<String> getSpringPluginXmls() {
		return springPluginXmls;
	}
	public List<String> getSpringMvcPluginXmls() {
		return springMvcPluginXmls;
	}
}
