package com.shine.platform.context;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.jdom.Element;
import org.springframework.context.ApplicationContext;

import com.shine.platform.plugin.PluginContext;
import com.shine.util.ArrayUtil;
import com.shine.util.xml.JDomUtil;

/**
 * 系统配置工厂
 * @author JiangKunpeng 2012.02.15
 * @version 2013.01.30
 */
@SuppressWarnings("unchecked")
final public class ConfigFactory {
	private static final ConfigFactory factory = new ConfigFactory();		//工厂  单例
	private ServletContext servletContext = null;	//Servlet上下文
	private Map<String, Object> attributes = new HashMap<String, Object>();
	private String sysPath;		//系统跟目录的绝对路径
	private String appContext;	//系统应用名,及中间件中的名称
	private String appName;		//系统中文名称
	private String indexPage;	//首页
	private ApplicationContext springContext;
	private List<String> springPluginXmls = new ArrayList<String>();
	private List<String> springMvcPluginXmls = new ArrayList<String>();
	private List<String> strutsPluginXmls = new ArrayList<String>();
	private ProjectStarterListener projectStarterListener = null;	//项目启动监听器
	
	//存在SESSION中的当前登录用户、用户菜单、URL的键
	public static final String SESSION_CURRENT_USER = "CURRENT_USER";
	public static final String SESSION_CURRENT_MENUS = "CURRENT_MENUS";
	public static final String SESSION_CURRENT_URLS = "CURRENT_URLS";
	
	private ConfigFactory(){
	}
	
	public static ConfigFactory getFactory(){
		return factory;
	}
	
	public void init(final ServletContext servletContext){
		this.servletContext = servletContext;
		this.appContext = servletContext.getServletContextName();
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
		
		//获取项目启动监听器，如果有配置则实例化
		String psl = bootEle.getChildText("projectStarterListener");
		if(psl!=null&&psl.length()>0){
			try {
				projectStarterListener = (ProjectStarterListener)Class.forName(psl).newInstance();
			} catch (Exception e) {
				throw new IllegalArgumentException("实例化项目启动监听器异常：" + psl, e);
			}
		}
		
		//如果有项目启动监听器，则执行XML配置加载之前的方法
		if(projectStarterListener!=null)
			projectStarterListener.beforeLoadConfig(servletContext);
		
		if(appContext==null){
			appContext = bootEle.getChildText("appContext");
		}
		if(appContext==null||appContext.length()<1){
			throw new IllegalArgumentException("appContext参数没有设置!");
		}
		appName = bootEle.getChildText("appName");
		if(appName==null||appName.length()<1){
			throw new IllegalArgumentException("appName参数没有设置!");
		}
		indexPage = bootEle.getChildText("indexPage");
		if(indexPage==null||indexPage.length()<1)
			indexPage = "sysmgr/login_home.do";
		
		List<Element> initXmls = JDomUtil.getSunList(bootEle, "beforeXmls");
		if(initXmls!=null){
			for(Element xml:initXmls){
				String xmlType = xml.getAttributeValue("type");
				if("spring".equals(xmlType))
					registerSpringPluginXml(xml.getValue());
				else if("struts".equals(xmlType))
					registerStrutsPluginXml(xml.getValue());
			}
		}
		List<Element> plugins = JDomUtil.getSunList(bootEle, "plugins");
		if(plugins!=null){
			for(Element plugin:plugins){
				PluginContext.getContext().registerPlugin(plugin.getText());
			}
		}
		
		//附加属性
		Element attrEle = bootEle.getChild("attributes");
		if(attrEle!=null){
			List<Element> attrEles = attrEle.getChildren("attribute");
			if(attrEles!=null){
				for(Element attr : attrEles){
					attributes.put(attr.getAttributeValue("name"), attr.getText());
				}
			}
		}
	}
	
	/**
	 * 注入Struts插件配置文件
	 * @param xmlPath
	 */
	public void registerStrutsPluginXml(final String xmlPath){
		ArrayUtil.addNoReplaceRepeat(strutsPluginXmls, xmlPath);
	}
	
	/**
	 * 注入Spring插件配置文件
	 * @param xmlPath
	 */
	public void registerSpringPluginXml(final String xmlPath){
		ArrayUtil.addNoReplaceRepeat(springPluginXmls, xmlPath);
	}
	
	/**
	 * 注入SpringMvc插件配置文件
	 * @param xmlPath
	 */
	public void registerSpringMvcPluginXml(final String xmlPath){
		ArrayUtil.addNoReplaceRepeat(springMvcPluginXmls, xmlPath);
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
	
	private String fusionSpringXml(final String configLocation,final List<String> pluginXmls){
		List<String> configs = null;
		if(configLocation!=null){
			configs = new ArrayList<String>();
			String[] cls = configLocation.split(",");
			for (String cl : cls) {
				ArrayUtil.addNoReplaceRepeat(configs, cl);
			}
			ArrayUtil.addAllNoReplaceRepeat(configs, pluginXmls);
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

	public String getAppContext() {
		return appContext;
	}
	public String getSysPath() {
		return sysPath;
	}
	public String getAppName() {
		return appName;
	}
	public String getIndexPage() {
		return indexPage;
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
	public List<String> getStrutsPluginXmls() {
		return strutsPluginXmls;
	}
	public ProjectStarterListener getProjectStarterListener() {
		return projectStarterListener;
	}
}
