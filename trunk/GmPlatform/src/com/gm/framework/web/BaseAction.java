package com.gm.framework.web;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;

import com.gm.framework.util.RequestDataExtractor;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public abstract class BaseAction<SERVICE extends BaseService> extends
		ActionSupport implements ServletRequestAware {

	private ActionContext context;
	protected Map request;
	protected Map session;
	protected Map application;
	protected RequestDataExtractor extor;
	protected HttpServletRequest requests;
	private final static String CONTENT_TYPE_HTML = "text/html;charset=UTF-8";
	private final static String CONTENT_TYPE_XML = "text/xml;charset=UTF-8";

	protected SERVICE service;

	public BaseAction() {
		super();
	}

	public void setServletRequest(HttpServletRequest requests) {
		this.requests = requests;
		extor = new RequestDataExtractor(requests);
	}

	/**
	 * 获取基本交换参数
	 */
	protected void loadBase() {
		if (this.context == null) {
			this.context = ActionContext.getContext();
			this.request = (Map) this.context.get("request");
			this.session = this.context.getSession();
			this.application = this.context.getApplication();
		}
	}

	/**
	 * 加入 request
	 * 
	 * @param key
	 * @param o
	 */
	protected void putRequest(String key, Object o) {
		loadBase();
		this.request.put(key, o);
	}

	/**
	 * 输出xml
	 * 
	 * @param xml
	 */
	protected void printOutXml(String xml) {
		printOut(xml, CONTENT_TYPE_XML);
	}

	/**
	 * 输出html
	 * 
	 * @param text
	 */
	protected void printOutText(String text) {
		printOut(text, CONTENT_TYPE_HTML);
	}

	/**
	 * 输出文本
	 * 
	 * @param text
	 * @param contentType
	 */
	protected void printOut(String text, String contentType) {
		if (text == null || contentType == null)
			return;

		try {
			printOut(text.getBytes("utf-8"), contentType);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 输出文本
	 * 
	 * @param data
	 * @param contentType
	 */
	protected void printOut(final byte[] data, final String contentType) {
		if (data == null || contentType == null)
			return;

		ActionContext.getContext().getActionInvocation().getProxy()
				.setExecuteResult(false);
		HttpServletResponse response = ServletActionContext.getResponse();
		OutputStream os = null;
		try {

			response.setContentType(contentType);
			response.setCharacterEncoding("UTF-8");
			response.setHeader("Pragma", "No-cache");
			response.setHeader("Cache-Control", "no-cache");
			response.setDateHeader("Expires", 0);
			os = response.getOutputStream();
			os.write(data);
		} catch (Throwable e) {
			e.printStackTrace();
		} finally {
			try {
				os.flush();
				ServletActionContext.getPageContext().getOut().clear();
				ServletActionContext.getPageContext().pushBody();
			} catch (Exception e) {
			}
			try {
				os.close();
			} catch (IOException e) {
			}
		}
	}

	/**
	 * 下载文件
	 * 
	 * @param srcFullName
	 *            服务器上完整文件名
	 * @param saveAsName
	 *            客户端保存的文件名
	 * @return
	 */
	protected String download(String srcFullName, String saveAsName) {
		HttpServletResponse response = ServletActionContext.getResponse();
		InputStream is = null;
		OutputStream os = null;
		try {
			response
					.setContentType("application/x-msdownload;charset=ISO-8859-1");
			response.setHeader("Content-Disposition", "attachment; filename="
					+ saveAsName);
			os = response.getOutputStream();
			is = new FileInputStream(srcFullName);
			byte[] b = new byte[1024];
			while (is.read(b) != -1)
				os.write(b);
			b = null;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				os.flush();
				ServletActionContext.getPageContext().getOut().clear();
				ServletActionContext.getPageContext().pushBody();
			} catch (Exception e) {
			}
			try {
				os.close();
				is.close();
			} catch (Exception e) {
			}
		}
		return null;
	}

	public SERVICE getService() {
		return service;
	}

	public void setService(SERVICE service) {
		this.service = service;
	}

}
