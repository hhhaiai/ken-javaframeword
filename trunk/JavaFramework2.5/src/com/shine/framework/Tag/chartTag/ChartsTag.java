package com.shine.framework.Tag.chartTag;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.BodyTagSupport;

public class ChartsTag extends BodyTagSupport {
	private String id;
	private String flashUrl;
	private String type;
	private String dataUrl;
	private String cleanCache;

	private String width = "400";
	private String height = "300";

	@Override
	public int doStartTag() throws JspException { // 重载方法(有多个方法,这是其中一个而已)
		// pageContext.getOut();// 获取JSP页面的输出流 out
		// pageContext.getRequest();// 获取JSP页面的请求对象 request
		// pageContext.getSession();// 获取JSP页面的会话对象 session
		// pageContext.getServletContext();// 获取JSP页面的应用对象 application

		String flashVars = "type=" + type + "&dataUrl=" + dataUrl
				+ "&cleanCache=" + cleanCache;

		JspWriter out = pageContext.getOut();
		try {
			out
					.println("<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='"
							+ width
							+ "' height='"
							+ height
							+ "' id='"
							+ id
							+ "'>");
			out.println("<param name='movie' value='" + flashUrl + "' />");
			out.println("<param name='quality' value='high' />");
			out.println("<param name='bgcolor' value='#ffffff' />");
			out
					.println("<param name='allowScriptAccess' value='sameDomain' />");
			out.println("<param name='allowFullScreen' value='true' />");
			out.println("<param name='flashvars' value='" + flashVars + "' />");
//			out.println("<object type='application/x-shockwave-flash' data='"
//					+ flashUrl + "' width='" + width + "' height='" + height
//					+ "'>");
//			out.println("<param name='quality' value='high' />");
//			out.println("<param name='bgcolor' value='#ffffff' />");
//			out
//					.println("<param name='allowScriptAccess' value='sameDomain' />");
//			out.println("<param name='allowFullScreen' value='true' />");
//			out.println("<param name='flashvars' value='" + flashVars + "' />");
//			out
//					.println("<p>Either scripts and active content are not permitted to run or Adobe Flash Player version 10.0.0 or greater is not installed.</p>");
//			out
//					.println(" <a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash Player' /></a>");
//			out.println("</object>");
			out.println("</object>");
		} catch (Exception e) {
			System.out.println("you have input invalid parameters");
		}
		return this.EVAL_PAGE;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFlashUrl() {
		return flashUrl;
	}

	public void setFlashUrl(String flashUrl) {
		this.flashUrl = flashUrl;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDataUrl() {
		return dataUrl;
	}

	public void setDataUrl(String dataUrl) {
		this.dataUrl = dataUrl;
	}

	public String getCleanCache() {
		return cleanCache;
	}

	public void setCleanCache(String cleanCache) {
		this.cleanCache = cleanCache;
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getHeight() {
		return height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

}
