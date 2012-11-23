package com.shine.framework.web.json;

import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;

import com.shine.framework.dao.util.Pagination;

/**
 * OM-UI 前端表格JSON数组格式
 * @author JiangKunpeng 2012.11.23
 * @version 2012.11.23
 */
public class OmuiJsonFormat implements IJsonFormat{

	@Override
	public String list2JsonStr(List list, Pagination page, JsonConfig jsonConfig) {
		StringBuffer jsonStr = new StringBuffer(200);
		jsonStr.append("{").append("\"total\":").append(page.getTotalRecord()).append(",\"rows\":");
		jsonStr.append(list2JsonStr(list, jsonConfig));
		jsonStr.append("}");
		return jsonStr.toString();
	}

	@Override
	public String list2JsonStr(List list, JsonConfig jsonConfig) {
		if(list==null)
			return NullJsonArray;
		JSONArray jsonarry = JSONArray.fromObject(list, jsonConfig);
		return jsonarry.toString();
	}
	
	//空数组
	protected static final String NullJsonArray = "[]";

}
