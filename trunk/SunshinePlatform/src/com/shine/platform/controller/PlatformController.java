package com.shine.platform.controller;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.shine.Plugin.PluginManager;
import com.shine.platform.PlatformManager;
import com.shine.platform.core.cotroller.BaseController;
import com.shine.platform.interfaces.PageIf;

@Controller
@RequestMapping("/platform.do")
public class PlatformController extends BaseController {
	@SuppressWarnings("unchecked")
	@RequestMapping(params = "login", method = RequestMethod.POST)
	public String login(HttpServletRequest request,
			HttpServletResponse response, HttpSession session) {
		System.out.println(request.getParameter("id"));
		return this.redirect(PluginManager.getManager().getPlugin(PageIf.class,
				"CmsPage").getPage("Cms", "system"));
	}
}
