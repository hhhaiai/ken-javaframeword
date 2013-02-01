package com.shine.platform.struts;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.StrutsStatics;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.shine.framework.entity.PersistResult;
import com.shine.platform.security.UrlSecurityContext;

/**
 * Struts拦截器，用于做URL权限控制等
 * @author JiangKunpeng 2012.02.29
 * @version 2013.02.01
 */
public class ShineInterceptor extends AbstractInterceptor{

	private static final long serialVersionUID = 7676294474119408460L;

	//头文件中标识请求类型的键
	private static final String RequestHeaderType = "X-Requested-With";
	//头文件类型表示为Ajax的值(JQuery、Ext等脚本框架均使用这个值,如果自定义的Ajax提交也需设置这个头文件才能判别出来)
	private static final String AjaxHeaderValue = "XMLHttpRequest";
	//没权限返回的值
	private static final String NoAuthority = "noauthority";
	//没登录或登录超时返回的值
	private static final String TimeOut = "timeout";				
	//输出文本的MIME类型
	private final static String CONTENT_TYPE_HTML = "text/html;charset=UTF-8";
	
	private UrlSecurityContext urlSecurityContext;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		
		//如果有加载URL权限插件则进行权限验证
		if(urlSecurityContext!=null){
			int status = urlSecurityContext.validate(invocation);
			if(status!=0){
				PersistResult pr = null;
				String requestType = request.getHeader(RequestHeaderType);
				switch (status) {
				case 1:	//没权限
					pr = new PersistResult(PersistResult.NOAUTHORITY, PersistResult.MSG_NOAUTHORITY);
					if(AjaxHeaderValue.equals(requestType)){
						printOutText(invocation, pr.toJson());
						return null;
					}else{
						return NoAuthority;
					}
				case 2:	//未登录或登录超时
					pr = new PersistResult(PersistResult.TIMEOUT, PersistResult.MSG_TIMEOUT);
					if(AjaxHeaderValue.equals(requestType)){
						printOutText(invocation, pr.toJson());
						return null;
					}else{
						return TimeOut;
					}
				default:
					break;
				}
			}
		}
		return invocation.invoke();
	}
	
	/**
	 * 输出字符串
	 * @param invocation
	 * @param text
	 */
	private void printOutText(ActionInvocation invocation,String text){
		printOut(invocation, text.getBytes(), CONTENT_TYPE_HTML);
	}
	
	/**
	 * 输出字节
	 * @param invocation
	 * @param data
	 * @param contentType
	 */
	private void printOut(ActionInvocation invocation,final byte[] data,final String contentType){
		HttpServletResponse response = (HttpServletResponse)invocation.getInvocationContext().get(StrutsStatics.HTTP_RESPONSE);
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

	public void setUrlSecurityContext(UrlSecurityContext urlSecurityContext) {
		this.urlSecurityContext = urlSecurityContext;
	}
	
}
