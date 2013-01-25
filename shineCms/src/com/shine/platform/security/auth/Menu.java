package com.shine.platform.security.auth;

import java.io.Serializable;
import java.util.Set;

/**
 * 菜单
 * @author JiangKunpeng 2013.01.25
 * @version 2013.01.25
 *
 */
public interface Menu extends Serializable {
	
	public abstract Integer getMenuId();
	public abstract Integer getPid();
	public abstract String getMenuName();
	public abstract String getMurl();
	public abstract String getIcon();
	
	/**
	 * 是否是菜单
	 * @return
	 */
	public abstract boolean isMenu();
	
	public abstract Set<Menu> getMenuChildren();
	
}
