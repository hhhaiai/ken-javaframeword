package com.shine.platform.security;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Hibernate;

import com.shine.common.sysmgr.entity.SysFreeUrl;
import com.shine.framework.dao.impl.GenericDaoImpl;
import com.shine.platform.security.auth.FunctionUrl;


public class UrlSecurityContext extends GenericDaoImpl{
	
	private Map<String, SysFreeUrl> freeMap = new HashMap<String, SysFreeUrl>();
	private Map<String, FunctionUrl> urlMap = new HashMap<String, FunctionUrl>();
	
	public UrlSecurityContext(){
	}
	
	public void init(){
		loadFreeUrls();
		loadUrlMap();
	}
	
	private void loadFreeUrls(){
		List<SysFreeUrl> urls = getHibernateTemp().find("from SysFreeUrl u");
		if(urls!=null){
			for(SysFreeUrl url : urls){
				freeMap.put(formatUrlKey(url.getUurl()), url);
			}
		}
	}
	
	private void loadUrlMap(){
		List<FunctionUrl> urls = getHibernateTemp().find("from SysFunctionUrl u");
		if(urls!=null){
			for(FunctionUrl url : urls){
				Hibernate.initialize(url.getFunction());
//				Hibernate.initialize(url.getFunction().getMenu());
				urlMap.put(formatUrlKey(url.getUurl()), url);
			}
		}
	}
	
	private String formatUrlKey(String url){
		if(url.toLowerCase().startsWith("http"))
			return url;
		if(!url.startsWith("/"))
			url = "/"+url;
		return url;
	}
	
	public SysFreeUrl getFreeUrl(String url){
		return freeMap.get(url);
	}

	public FunctionUrl getUrl(String url){
		return urlMap.get(url);
	}
}
