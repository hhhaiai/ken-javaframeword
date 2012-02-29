package com.shine.platform.context;

import java.io.File;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;

import org.jdom.Element;
import org.springframework.context.ApplicationContext;

import com.shine.platform.plugin.PluginContext;
import com.shine.util.xml.JDomUtil;

/**
 * 系统配置工厂
 * @author JiangKunpeng 2012.02.15
 * @version 2012.02.29
 */
final public class ConfigFactory {
	private static final ConfigFactory factory = new ConfigFactory();
	private Map<String, Object> attributes = new HashMap<String, Object>();
	private String sysPath;
	private ApplicationContext springContext;
	private Set<String> springPluginXmls = new HashSet<String>();
	private Set<String> springMvcPluginXmls = new HashSet<String>();
	private Set<String> strutsPluginXmls = new HashSet<String>();
	private ConfigFactory(){
	}
	
	public static ConfigFactory getFactory(){
		return factory;
	}
	
	public void init(final ServletContext servletContext){
		sysPath = servletContext.getRealPath("/");
		loadXmlConfig();
	}
	
	/**
	 * 加载系统XML配置
	 */
	private void loadXmlConfig(){
		String sysXmlPath = sysPath + "WEB-INF" + File.separator + "classes" + File.separator + "system.xml";
		Element root = JDomUtil.file2Doc(sysXmlPath).getRootElement();
		String bootXmlPath = root.getChildText("boot");
		bootXmlPath = sysPath + "WEB-INF" + File.separator + "classes"+ File.separator + bootXmlPath;
		Element bootEle = JDomUtil.file2Doc(bootXmlPath).getRootElement();
		List<Element> plugins = bootEle.getChild("plugins").getChildren();
		if(plugins!=null){
			for(Element plugin:plugins){
				PluginContext.getContext().registerPlugin(plugin.getText());
			}
		}
	}
	
	/**
	 * 注入Struts插件配置文件
	 * @param xmlPath
	 */
	public void registerStrutsPluginXml(final String xmlPath){
		strutsPluginXmls.add(xmlPath);
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
	
	/**
	 * 将传入的配置文件和插件加载的Spring配置文件融合并返回
	 * @param configLocation	Spring自己加载的配置文件
	 * @param type	Spring:ContextLoaderListener加载的;SpringMvc:DispatcherServlet加载的配置文件
	 * @return
	 */
	public String fusionSpringXml(final String configLocation,final String type){
		if("Spring".equals(type))
			return fusionSpringXml(configLocation, getSpringPluginXmls());
		else if("SpringMvc".equals(type))
			return fusionSpringXml(configLocation, getSpringMvcPluginXmls());
		return configLocation;
	}
	
	private String fusionSpringXml(final String configLocation,final Set<String> pluginXmls){
		Set<String> configs = null;
		if(configLocation!=null){
			configs = new HashSet<String>();
			String[] cls = configLocation.split(",");
			for (String cl : cls) {
				configs.add(cl);
			}
			configs.addAll(pluginXmls);
		}else{
			configs = pluginXmls;
		}
		StringBuffer cfsb = new StringBuffer(100);
		Iterator<String> cfit = configs.iterator();
		while(cfit.hasNext()){
			cfsb.append(cfit.next()).append(",");
		}
		return cfsb.toString();
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
	public Set<String> getSpringPluginXmls() {
		return springPluginXmls;
	}
	public Set<String> getSpringMvcPluginXmls() {
		return springMvcPluginXmls;
	}
	public Set<String> getStrutsPluginXmls() {
		return strutsPluginXmls;
	}
}
