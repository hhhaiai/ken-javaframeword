package com.shine.platform.security;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Hibernate;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.shine.common.sysmgr.entity.SysFreeUrl;
import com.shine.framework.exception.DataAccessException;
import com.shine.platform.security.auth.FunctionUrl;
import com.shine.platform.security.auth.Menu;

/**
 * URL权限数据上下文,通过Spring配置为单例
 * @author JiangKunpeng	2013.01.29
 * @version	2013.01.30
 *
 */
public class UrlSecurityContext {
	
	//自由权限URL键值对
	private Map<String, SysFreeUrl> freeMap = new HashMap<String, SysFreeUrl>();
	
	//功能URL权限键值对
	private Map<String, FunctionUrl> urlMap = new HashMap<String, FunctionUrl>();
	
	//菜单权限键值对,这里只保存有URL的菜单
	private Map<String, Menu> menuMap = new HashMap<String, Menu>();
	
	public UrlSecurityContext(){
	}
	
	private SessionFactory sessionFactory;
	
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	/**
	 * 初始化
	 */
	public void init(){
		/**
		 * 如果用Spring的HibernateTemplate由于URL->Function->Menu为延时加载，会报no session异常，所以这里直接获取Session进行查询。
		 */
		Session session = null;
		try{
			session = sessionFactory.openSession();
			loadFreeUrls(session);
			loadUrlMap(session);
			loadUrlMenu(session);
		}catch(Exception e){
			throw new DataAccessException("初始化URL权限数据异常!",e);
		}finally{
			if(session!=null&&session.isOpen())
				session.close();
		}
	}
	
	/**
	 * 重新加载数据,当菜单、功能URL、自由权限URL进行数据库持久化操作后调用
	 * @param type	1:自由权限URL，2:功能URL，3:菜单URL
	 */
	public void reload(int type){
		Session session = null;
		try{
			session = sessionFactory.openSession();
			if(type==1)
				loadFreeUrls(session);
			else if(type==2)
				loadUrlMap(session);
			else if(type==3)
				loadUrlMenu(session);
		}catch(Exception e){
			throw new DataAccessException("初始化URL权限数据异常!",e);
		}finally{
			if(session!=null&&session.isOpen())
				session.close();
		}
	}
	
	/**
	 * 加载自由权限URL
	 * @param session
	 */
	private void loadFreeUrls(Session session){
		freeMap.clear();
		List<SysFreeUrl> urls = null;
		Query query = session.createQuery("from SysFreeUrl u");
		urls = query.list();
		if(urls!=null){
			for(SysFreeUrl url : urls){
				freeMap.put(formatUrlKey(url.getUurl()), url);
			}
		}
	}
	
	/**
	 * 加载功能URL
	 * @param session
	 */
	private void loadUrlMap(Session session){
		urlMap.clear();
		List<FunctionUrl> urls = null;
		Query query = session.createQuery("from SysFunctionUrl u");
		urls = query.list();
		if(urls!=null){
			for(FunctionUrl url : urls){
				//强制加载URL->Function->Menu，在URL权限拦截器中需用到这三层钻取
				Hibernate.initialize(url.getFunction().getMenu());
				urlMap.put(formatUrlKey(url.getUurl()), url);
			}
		}
	}
	
	/**
	 * 加载菜单
	 * @param session
	 */
	private void loadUrlMenu(Session session){
		menuMap.clear();
		List<Menu> menus = null;
		Query query = session.createQuery("from SysMenu m where m.murl is not null and m.murl <>''");
		menus = query.list();
		if(menus!=null){
			for(Menu menu : menus){
				menuMap.put(formatUrlKey(menu.getMurl()), menu);
			}
		}
	}
	
	/**
	 * 将URL调整成对比需要的格式<br/>
	 * 以http开头说明不是咱系统的URL,则不处理<br/>
	 * 没以http开头的如果不是以/开头则在前面加上/
	 * @param url
	 * @return
	 */
	private String formatUrlKey(String url){
		if(url.toLowerCase().startsWith("http"))
			return url;
		if(!url.startsWith("/"))
			url = "/"+url;
		return url;
	}
	
	/**
	 * 获取所传URL匹配的自由权限URL
	 * @param url
	 * @return
	 */
	public SysFreeUrl getFreeUrl(String url){
		return freeMap.get(url);
	}

	/**
	 * 获取所传URL匹配的功能URL
	 * @param url
	 * @return
	 */
	public FunctionUrl getUrl(String url){
		return urlMap.get(url);
	}
	
	/**
	 * 获取所传URL匹配的菜单
	 * @param url
	 * @return
	 */
	public Menu getMenu(String url){
		return menuMap.get(url);
	}
}
