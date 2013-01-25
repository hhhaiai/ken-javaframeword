package com.shine.platform.security.auth;

import java.io.Serializable;

/**
 * 功能URL接口
 * @author JiangKunpeng	2013.01.25
 * @version 2013.01.25
 *
 */
public interface FunctionUrl extends Serializable {
	
	/**
	 * 获取URL
	 * @return
	 */
	public abstract String getUurl();
	
	/**
	 * 是否记录日志
	 * @return
	 */
	public abstract boolean isLog();
	
}
