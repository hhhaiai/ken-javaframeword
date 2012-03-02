package com.shine.platform.controller;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.shine.Plugin.PluginManager;
import com.shine.platform.PlatformManager;
import com.shine.platform.core.cotroller.BaseController;
import com.shine.platform.interfaces.PageIf;

@Controller
@RequestMapping("/page.do")
public class PageController extends BaseController {
	@SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.GET)
	public String page(HttpServletRequest request,
			HttpServletResponse response, HttpSession session) {
		try {
			return this
					.redirect(PluginManager.getManager()
							.getPlugin(PageIf.class).getPage("Cms",
									request.getParameter("param")));
		} catch (Exception e) {
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(params = "returnValue")
	public void returnValue(PrintWriter out) {
		out.print("123");
	}
}
