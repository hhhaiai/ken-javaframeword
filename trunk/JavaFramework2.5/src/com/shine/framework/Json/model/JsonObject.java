package com.shine.framework.Json.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JsonObject {
	protected Map<String, String> jsonMap;
	protected JsonArrayMap jsonArrayMap;

	protected String jsonStartString = "{";
	protected String jsonEndString = "}";

	public JsonObject() {
		jsonMap = new HashMap<String, String>();
		jsonArrayMap = new JsonArrayMap();
	}

	public void addAttribute(String key, String value) {
		jsonMap.put(key, value);
	}

	public void addMapObject(String key, JsonObject object) {
		if (jsonArrayMap.containsKey(key)) {
			jsonArrayMap.get(key).add(object);
		} else {
			List<JsonObject> list = new ArrayList<JsonObject>();
			list.add(object);
			jsonArrayMap.put(key, list);
		}
	}

	/**
	 * 获取json String
	 * 
	 * @return
	 */
	public String getJsonObject() {
		StringBuffer jsonObjectString = new StringBuffer();
		jsonObjectString.append(jsonStartString);
		for (String key : jsonMap.keySet()) {
			jsonObjectString.append("\"");
			jsonObjectString.append(key);
			jsonObjectString.append("\":\"");
			jsonObjectString.append(jsonMap.get(key));
			jsonObjectString.append("\",");
		}

		for (String key : jsonArrayMap.keySet()) {
			jsonObjectString.append("\"");
			jsonObjectString.append(key);
			jsonObjectString.append("\":\"");
			jsonObjectString.append("[");
			List<JsonObject> list = jsonArrayMap.get(key);
			for (JsonObject object : list) {
				jsonObjectString.append(object.getJsonObject());
				jsonObjectString.append(",");
			}
			if (jsonObjectString.substring(jsonObjectString.length() - 1)
					.equals(","))
				jsonObjectString.deleteCharAt(jsonObjectString.length() - 1);
			jsonObjectString.append("]");
			jsonObjectString.append("\",");
		}
		if (jsonObjectString.substring(jsonObjectString.length() - 1).equals(
				","))
			jsonObjectString.deleteCharAt(jsonObjectString.length() - 1);
		jsonObjectString.append(jsonEndString);
		return jsonObjectString.toString();
	}
}
