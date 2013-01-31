package com.shine.platform.security;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.StrutsStatics;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.shine.common.sysmgr.entity.SysFreeUrl;
import com.shine.framework.entity.PersistResult;
import com.shine.platform.context.ConfigFactory;
import com.shine.platform.security.auth.FunctionUrl;
import com.shine.platform.security.auth.Menu;
import com.shine.platform.security.auth.User;

/**
 * URL权限拦截器
 * @author JiangKunpeng 2012.02.29
 * @version 2013.01.30
 */
public class UrlSecurityInterceptor extends AbstractInterceptor{

	private static final long serialVersionUID = 7676294474119408460L;

	//头文件中标识请求类型的键
	private static final String RequestHeaderType = "X-Requested-With";
	//头文件类型表示为Ajax的值(JQuery、Ext等脚本框架均使用这个值,如果自定义的Ajax提交也需设置这个头文件才能判别出来)
	private static final String AjaxHeaderValue = "XMLHttpRequest";
	
	private static final String NoAuthority = "noauthority";		//没权限返回的值
	private static final String TimeOut = "timeout";				//没登录或登录超时返回的值
	
	private UrlSecurityContext urlSecurityContext;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		//标识为不检查权限,做测试或者新建项目初始化权限数据时使用,在项目的boot.xml中加入<attribute name="authorityCheck">false</attribute>即可
		if("false".equals(ConfigFactory.getFactory().getAttribute("authorityCheck")))
			return invocation.invoke();
		
		HttpServletRequest request = ServletActionContext.getRequest();
		String uri = request.getRequestURI();
		String appContext = ConfigFactory.getFactory().getAppContext();
		int idx = uri.indexOf(appContext);
		if(idx!=-1){
			uri = uri.substring(idx+appContext.length());
		}
		SysFreeUrl freeUrl = urlSecurityContext.getFreeUrl(uri);
		List<Menu> myMenus = null;
		User user = (User)request.getSession().getAttribute(ConfigFactory.SESSION_CURRENT_USER);
		int status = 0;
		boolean checkSession = false;	//是否需再检测当前登录用户
		out:
		if(freeUrl!=null){
			if(freeUrl.getLoginNeed()!=null&&freeUrl.getLoginNeed()==1){
				if(user==null){
					status = 2;
					break out;
				}
			}
		}else{
			Menu menu = urlSecurityContext.getMenu(uri);
			if(menu==null){
				FunctionUrl furl = urlSecurityContext.getUrl(uri);
				if(furl!=null){
					status = 1;
					List<FunctionUrl> myUrls = (List<FunctionUrl>)request.getSession().getAttribute(ConfigFactory.SESSION_CURRENT_URLS);
					if(myUrls!=null){
						for(FunctionUrl myUrl : myUrls){
							if(furl.getUrlId().equals(myUrl.getUrlId())){
								status = 0;
								//这里可做简单的日志记录
								System.out.println("进入："+furl.getFunction().getMenu().getMenuName()+"->"+furl.getFunction().getFunName());
								break out;
							}
						}
					}else{
						checkSession = true;
					}
				}
			}else{
				status = 1;
				myMenus = (List<Menu>)request.getSession().getAttribute(ConfigFactory.SESSION_CURRENT_MENUS);
				if(myMenus!=null){
					for(Menu myMenu : myMenus){
						if(menu.getMenuId().equals(myMenu.getMenuId())){
							status = 0;
							System.out.println("进入：" + menu.getMenuName());
							break out;
						}
					}
				}else{
					checkSession = true;
				}
			}
		}
		//如果没被自由权限URL过滤并没从SESSION中获取到任何权限数据则说明用户未登录或登录超时
		if(checkSession&&user==null){
			status = 2;
		}
		if(status!=0){
			PersistResult pr = null;
			String requestType = request.getHeader(RequestHeaderType);
			switch (status) {
			case 1:
				pr = new PersistResult(PersistResult.NOAUTHORITY, PersistResult.MSG_NOAUTHORITY);
				if(AjaxHeaderValue.equals(requestType)){
					printOutText(invocation, pr.toJson());
					return null;
				}else{
					return NoAuthority;
				}
			case 2:
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
		return invocation.invoke();
	}
	
	private final static String CONTENT_TYPE_HTML = "text/html;charset=UTF-8";
	
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
