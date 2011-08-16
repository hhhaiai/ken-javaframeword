package com.shine.Struts2Web.action;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;

public abstract class BaseAction implements Action {
	protected RequestDataExtractor extor;

	private final static String CONTENT_TYPE_HTML = "text/html;charset=UTF-8";
	private final static String CONTENT_TYPE_XML = "text/xml;charset=UTF-8";

	/**
	 * 获取Request
	 * 
	 * @return
	 */
	protected HttpServletRequest getRequest() {
		return ServletActionContext.getRequest();
	}

	/**
	 * 设置request数据集
	 */
	protected void setExtractor() {
		extor = new RequestDataExtractor(getRequest());
	}

	/**
	 * 获取session
	 * 
	 * @return
	 */
	protected Map getSession() {
		return ActionContext.getContext().getSession();
	}

	/**
	 * 获取Response
	 * 
	 * @return
	 */
	protected HttpServletResponse getResponse() {
		return ServletActionContext.getResponse();
	}

	/**
	 * 输出xml
	 * 
	 * @param xmlContent
	 */
	protected void printOutXML(String xmlContent) {
		printOut(xmlContent, CONTENT_TYPE_XML);
	}

	/**
	 * 输出text
	 * 
	 * @param text
	 */
	protected void printOutText(String text) {
		printOut(text, CONTENT_TYPE_HTML);
	}

	/**
	 * 输出数据
	 * 
	 * @param text
	 * @param contentType
	 */
	private void printOut(String text, String contentType) {
		if (text == null || contentType == null)
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
			os.write(text.getBytes("utf-8"));
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
			response.setContentType("application/x-msdownload;charset=UTF-8");
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

}
