package com.shine.platform.core.cotroller;

public class BaseController {
	/**
	 * 生成前进页面
	 * 
	 * @param forwardUrl
	 * @return
	 */
	protected String forward(String url) {
		return "forward:" + url;
	}

	/**
	 * 生成跳转页面
	 * 
	 * @param url
	 * @return
	 */
	protected String redirect(String url) {
		return "redirect:" + url;
	}
}
