package com.shine.platform.plugin;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.jdom.Document;
import org.jdom.Element;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;
import com.shine.util.xml.JDomUtil;

/**
 * XML配置插件,通过xml文件配置加载spring、struts配置文件
 * @author JiangKunpeng 2013.01.31
 * @version 2013.01.31
 *
 */
public class XmlPlugin implements IPlugin{
	private String name;
	private Set<String> springXmls = new HashSet<String>();
	private Set<String> strutsXmls = new HashSet<String>();
	
	private static final String TypeSpring = "spring";
	private static final String TypeStruts = "struts";
	private static final String ClassPath = "classpath:";
	
	ILogger logger = LoggerFactory.getLogger(getClass());
	
	public XmlPlugin(String xmlPath){
		if(xmlPath.startsWith(ClassPath))
			xmlPath = xmlPath.replace(ClassPath, getClass().getResource("/").getPath());
		Document doc = JDomUtil.file2Doc(xmlPath);
		Element root = doc.getRootElement();
		this.name = root.getAttributeValue("name");
		List<Element> xmls = root.getChildren();
		if(xmls!=null){
			String type = null;
			for(Element ele:xmls){
				type = ele.getAttributeValue("type");
				if(TypeSpring.equals(type)){
					springXmls.add(ele.getText());
				}else if(TypeStruts.equals(type)){
					strutsXmls.add(ele.getText());
				}
			}
			type = null;
			xmls = null;
		}
		root = null;
		doc = null;
	}
	
	@Override
	public void init() {
		logger.debug("初始化插件[" + getName() + "]");
		String classPath = getClass().getResource("/").getPath();
		for(String xml : springXmls){
			ConfigFactory.getFactory().registerSpringPluginXml(xml);
		}
		for(String xml : strutsXmls){
			if(xml.startsWith(ClassPath))
				xml = xml.replace(ClassPath, classPath);
			ConfigFactory.getFactory().registerStrutsPluginXml(xml);
		}
	}

	@Override
	public void destory() {
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public void start() {
		logger.debug("启动插件[" + getName() + "]");
	}
	
}
