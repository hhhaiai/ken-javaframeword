package com.shine.platform.plugin;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.jdom.Document;
import org.jdom.Element;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;
import com.shine.platform.spring.HbmListBean;
import com.shine.util.xml.JDomUtil;

/**
 * XML配置插件,通过xml文件配置加载spring、struts、hbm配置文件
 * @author JiangKunpeng 2013.01.31
 * @version 2013.02.27
 *
 */
public class XmlPlugin implements IPlugin{
	private String name;
	private Set<String> springXmls = new HashSet<String>();
	private Set<String> strutsXmls = new HashSet<String>();
	
	ILogger logger = LoggerFactory.getLogger(getClass());
	
	public XmlPlugin(String xmlPath){
		Document doc = null;
		InputStream is = null;
		if(xmlPath.toLowerCase().startsWith(ConfigFactory.ClassPath)){
			xmlPath = xmlPath.substring(ConfigFactory.ClassPath.length());
			if(!xmlPath.startsWith("/"))
				xmlPath = "/" + xmlPath;
			is = getClass().getResourceAsStream(xmlPath);
			try{
				doc = JDomUtil.stream2Doc(is);
			}finally{
				try {
					if(is!=null)
						is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}else{
			doc = JDomUtil.file2Doc(xmlPath);
		}
		Element root = doc.getRootElement();
		this.name = root.getAttributeValue("name");
		List<Element> xmls = root.getChildren();
		if(xmls!=null){
			String type = null;
			for(Element ele:xmls){
				type = ele.getAttributeValue("type");
				if(ConfigFactory.XmlTypeSpring.equals(type)){
					springXmls.add(ele.getText());
				}else if(ConfigFactory.XmlTypeStruts.equals(type)){
					strutsXmls.add(ele.getText());
				}else if(ConfigFactory.XmlTypeHbm.equals(type)){		//hbm配置必须在加载spring和struts前注入
					String sfid = ele.getAttributeValue("sessionFactory");
					List<Element> hbmEles = ele.getChildren();
					if(hbmEles!=null){
						HbmListBean hlb = new HbmListBean();
						hlb.setSessionFactoryId(sfid);
						for(Element hbmEle : hbmEles){
							hlb.addXml(hbmEle.getValue());
						}
						ConfigFactory.getFactory().registerHbmListBean(hlb);
						hbmEles = null;
					}
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
		for(String xml : springXmls){
			ConfigFactory.getFactory().registerSpringXml(xml);
		}
		for(String xml : strutsXmls){
			if(xml.startsWith(ConfigFactory.ClassPath))
				xml = xml.replace(ConfigFactory.ClassPath, "");
			ConfigFactory.getFactory().registerStrutsXml(xml);
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
