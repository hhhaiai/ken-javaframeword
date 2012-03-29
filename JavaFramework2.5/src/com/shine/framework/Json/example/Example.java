package com.shine.framework.Json.example;

import com.shine.framework.Json.JsonHelper;
import com.shine.framework.Json.model.JsonObject;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		JsonHelper help = new JsonHelper();
		help.addAttribute("text", "node1");

		JsonObject o = new JsonObject();
		o.addAttribute("test1", "node11");
		o.addAttribute("test2", "node21");

		help.addMapObject("children", o);

		System.out.println(help.getJsonObject());
	}
}
