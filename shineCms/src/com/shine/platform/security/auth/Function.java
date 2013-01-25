package com.shine.platform.security.auth;

import java.io.Serializable;
import java.util.Set;

/**
 * 权限功能
 * @author JiangKunpeng	2013.01.25
 * @version 2013.01.25
 *
 */
public interface Function extends Serializable {
	
	public abstract Integer getFunId();
	
	/**
	 * 唯一码
	 * @return
	 */
	public abstract String getFunKey();
	
	/**
	 * 功能名称
	 * @return
	 */
	public abstract String getFunName();
	
	public abstract Menu getMenu();
	
	/**
	 * 获取URL
	 * @return
	 */
	public abstract Set<FunctionUrl> getFunUrls();
	
}
