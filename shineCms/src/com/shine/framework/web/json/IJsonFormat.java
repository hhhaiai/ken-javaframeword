package com.shine.framework.web.json;

import java.util.List;

import net.sf.json.JsonConfig;

import com.shine.framework.dao.util.Pagination;

/**
 * JSON格式处理接口(不同前端框架也许用不同的JSON格式展示列表等数据)
 * @author JiangKunpeng	2012.11.23
 * @version 2012.11.23
 */
public interface IJsonFormat {
	/**
	 * 将列表、分页数据拼成前端需要的JSON格式字符串
	 * @param list
	 * @param page
	 * @param jsonConfig
	 * @return
	 */
	public abstract String list2JsonStr(List list,Pagination page,JsonConfig jsonConfig);
	
	/**
	 * 将列表数据拼成前端需要的JSON格式字符串
	 * @param list
	 * @param jsonConfig
	 * @return
	 */
	public abstract String list2JsonStr(List list,JsonConfig jsonConfig);
}
