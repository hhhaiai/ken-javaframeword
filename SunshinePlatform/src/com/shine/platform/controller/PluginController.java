package com.shine.platform.controller;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.shine.Plugin.PluginManager;
import com.shine.platform.PlatformManager;
import com.shine.platform.interfaces.PageIf;

@Controller
@RequestMapping("/plugin.do")
public class PluginController {
	@SuppressWarnings("unchecked")
	@RequestMapping(params = "pluginGrid")
	public void pluginGrid(PrintWriter out) {
		out.print("{\"total\":126, \"rows\":[{\"address\":\"CZ88.NET \",\"city\":\"IANA保留地址\",\"id\":\"1\"},{\"address\":\"CZ88.NET \",\"city\":\"澳大利亚\",\"id\":\"2\"},{\"address\":\"电信\",\"city\":\"福建省\",\"id\":\"3\"},{\"address\":\"CZ88.NET \",\"city\":\"澳大利亚\",\"id\":\"4\"},{\"address\":\"CZ88.NET \",\"city\":\"泰国\",\"id\":\"5\"},{\"address\":\"CZ88.NET \",\"city\":\"日本\",\"id\":\"6\"},{\"address\":\"电信\",\"city\":\"广东省\",\"id\":\"7\"},{\"address\":\"CZ88.NET \",\"city\":\"日本\",\"id\":\"8\"}]}");
	}
}
