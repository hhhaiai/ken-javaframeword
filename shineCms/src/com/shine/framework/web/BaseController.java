package com.shine.framework.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;

import com.shine.framework.entity.BaseEntity;

/**
 * 基本模块控制器,包括常用的方法
 * @author JiangKunpeng 2011.09.01
 * @version 2011.09.01
 */
public abstract class BaseController extends GenericController{
	
	/**
	 * 获取模块页面文件夹,以/结束
	 * @return
	 */
	protected abstract String getBaseFolder();
	
	/**
	 * 获取模块的Entity
	 * @return
	 */
	protected abstract BaseEntity getEntity();
	
	@RequestMapping("/home")
	public String home(HttpServletRequest request,HttpServletResponse response){
		return getBaseFolder() + HOME;
	}
	
	@RequestMapping("/list")
	public String list(HttpServletRequest request,HttpServletResponse response){
		
		return getBaseFolder() + LIST;
	}
	
	@RequestMapping("/toAdd")
	public String toAdd(HttpServletRequest request,HttpServletResponse response){
		
		return getBaseFolder() + ADD;
	}
	
	@RequestMapping("/toEdit")
	public String toEdit(HttpServletRequest request,HttpServletResponse response){
		
		return getBaseFolder() + EDIT;
	}
	
	@RequestMapping("/view")
	public String view(HttpServletRequest request,HttpServletResponse response){
		
		return getBaseFolder() + VIEW;
	}
	
	protected static final String ADD = "add";
	protected static final String EDIT = "edit";
	protected static final String TOADD = "toAdd";
	protected static final String TOEDIT = "toEdit";
	protected static final String HOME = "home";
	protected static final String SAVE = "save";
	protected static final String UPDATE = "update";
	protected static final String LIST = "list";
	protected static final String VIEW = "view";
}
