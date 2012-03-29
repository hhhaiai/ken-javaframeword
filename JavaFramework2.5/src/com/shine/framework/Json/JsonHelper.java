package com.shine.framework.Json;

import java.util.HashMap;

import com.shine.framework.Json.model.JsonArrayMap;
import com.shine.framework.Json.model.JsonObject;

/**
 * json的实体类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class JsonHelper extends JsonObject {
	public JsonHelper() {
		jsonStartString = "[{";
		jsonEndString = "}]";
		jsonMap = new HashMap<String, String>();
		jsonArrayMap = new JsonArrayMap();
	}
}
