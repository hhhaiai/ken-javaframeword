package com.shine.framework.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.SocketException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.util.ServletContextAware;
import org.jdom.Document;
import org.jdom.Element;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.shine.util.xml.JDomUtil;

/**
 * Struts2的Action基类
 * @author JiangKunpeng 2012.03.09
 * @version 2012.03.09
 */
public class GenericAction extends ActionSupport implements ServletRequestAware,ServletResponseAware,ServletContextAware,Serializable{

	private static final long serialVersionUID = 7828158677125093725L;
	
	protected HttpServletRequest request;
	protected HttpSession session;
	protected HttpServletResponse response;
	protected ServletContext context;
	protected RequestDataExtractor extor;
	
	protected final static String CONTENT_TYPE_HTML = "text/html;charset=UTF-8";
	protected final static String CONTENT_TYPE_XML = "text/xml;charset=UTF-8"; 
	
	/**
	 * 输出XML
	 * @param root
	 */
	protected void printOutXML(Element root){
		printOutXML(new Document(root));
	}
	
	/**
	 * 输出XML
	 * @param doc
	 */
	protected void printOutXML(Document doc){
		printOutXML(JDomUtil.doc2String(doc));
	}
	
	/**
	 * 输出XML
	 * @param xmlContent
	 */
	protected void printOutXML(String xml)  {
		printOut(xml, CONTENT_TYPE_XML);
	}

	/**
	 * 输出文本
	 * @param text
	 */
	protected void printOutText(String text)  {
		printOut(text, CONTENT_TYPE_HTML);
	}
	
	/**
	 * 输出
	 * @param text
	 * @param contentType
	 */
	protected void printOut(final String text,final String contentType){
		if(text == null || contentType == null) return;
		try {
			printOut(text.getBytes("utf-8"), contentType);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 输出
	 * @param data
	 * @param contentType
	 */
	protected void printOut(final byte[] data,final String contentType){
		if(data == null || contentType == null) return;
		
		ActionContext.getContext().getActionInvocation().getProxy().setExecuteResult(false);
		OutputStream os = null;
		try {
			response.setContentType(contentType);
			response.setCharacterEncoding("UTF-8");
			response.setHeader("Pragma","No-cache");
			response.setHeader("Cache-Control","no-cache");
			response.setDateHeader("Expires", 0);
			os = response.getOutputStream();
			os.write(data);
			os.flush();
		} catch (Throwable e) {
			e.printStackTrace();
		}finally{
			try {
				os.close();
			} catch (IOException e) {
			}
		}
	}
	
	/**
	 * 直接输出一个文件，文件下载,一定要注意编码
	 * @param filename		下载时默认文件名
	 * @param _file
	 * @throws Exception
	 */
	protected void indrectReturnFile(String filename,File _file) throws Exception {
		ActionContext.getContext().getActionInvocation().getProxy().setExecuteResult(false);
		HttpServletResponse response = ServletActionContext.getResponse();
		OutputStream os = null;
		InputStream _in =  null;
		try {
	    	 _in = new FileInputStream(_file);
            filename=new String(filename.getBytes("GBK"),"ISO-8859-1");
            response.setContentType("application/x-msdownload;charset=GBK");
            response.setHeader("Content-Disposition", "attachment; filename="+filename);
            os = response.getOutputStream();
            
            byte[] b = new byte[1024];
			while (_in.read(b) != -1)
				os.write(b);
			
            os.flush();
		} catch(SocketException se){
		} catch (Throwable e) {
			e.printStackTrace();
		}finally{
		    try {
                _in.close();
            } catch (IOException e) {
                throw new RuntimeException("关闭流失败！", e);
            }
		}
	}
	

	public void setContext(ServletContext context) {
		this.context = context;
	}
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
		this.session = request.getSession();
		this.extor = new RequestDataExtractor(request);
	}
	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}
	public void setServletContext(ServletContext context) {
		this.context = context;
	}
}
