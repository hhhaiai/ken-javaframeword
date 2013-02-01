package com.shine.platform.spring;

import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.plugin.HbmListBean;

/**
 * 重写Spring的LocalSessionFactoryBean，支持通过插件加载hbm配置
 * @author JiangKunpeng 2013.01.31
 * @version 2013.02.01
 *
 */
public class ShineSessionFactoryBean extends LocalSessionFactoryBean{
	private String id;	//如果多个SessionFactory时可以用来区分

	@Override
	protected SessionFactory newSessionFactory(Configuration config)
			throws HibernateException {
		List<HbmListBean> hbms = ConfigFactory.getFactory().getHbmList();
		if(hbms!=null){
			String classPath = getClass().getResource("/").getPath();
			for(HbmListBean hbm : hbms){
				if(match(hbm)){
					List<String> xmls = hbm.getXmls();
					if(xmls!=null){
						for(String xml : xmls){
							if(xml.toLowerCase().startsWith(ConfigFactory.ClassPath))
								xml = xml.replace(ConfigFactory.ClassPath, classPath);
							config.addFile(xml);
						}
					}
					xmls = null;
				}
			}
			hbms = null;
			classPath = null;
		}
		return super.newSessionFactory(config);
	}
	
	/**
	 * 判断hbm与当前SessionFactory是否匹配(通过ID对比)
	 * @param hbm
	 * @return
	 */
	private boolean match(HbmListBean hbm){
		if(id==null&&hbm.getSessionFactoryId()==null)
			return true;
		if(id!=null)
			return id.equals(hbm.getSessionFactoryId());
		if(hbm.getSessionFactoryId()!=null)
			return hbm.getSessionFactoryId().equals(id);
		return true;
	}

	public void setId(String id) {
		this.id = id;
	}
	
}
