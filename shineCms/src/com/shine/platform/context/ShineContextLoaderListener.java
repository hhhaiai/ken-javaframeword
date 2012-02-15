package com.shine.platform.context;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

import org.springframework.beans.BeanUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextException;
import org.springframework.util.ObjectUtils;
import org.springframework.web.context.ConfigurableWebApplicationContext;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.shine.platform.starter.IStarter;

/**
 * 系统启动监听器(重写spring上下文监听器)
 * @author JiangKunpeng 2012.02.14
 * @version 2012.02.14
 */
public class ShineContextLoaderListener extends ContextLoaderListener{
	private ContextLoader contextLoader;

	@Override
	protected WebApplicationContext createWebApplicationContext(ServletContext sc, ApplicationContext parent) {
//		return super.createWebApplicationContext(sc, parent);
		Class<?> contextClass = determineContextClass(sc);
		if (!ConfigurableWebApplicationContext.class.isAssignableFrom(contextClass)) {
			throw new ApplicationContextException("Custom context class [" + contextClass.getName() +
					"] is not of type [" + ConfigurableWebApplicationContext.class.getName() + "]");
		}
		ConfigurableWebApplicationContext wac =
				(ConfigurableWebApplicationContext) BeanUtils.instantiateClass(contextClass);

		// Assign the best possible id value.
		if (sc.getMajorVersion() == 2 && sc.getMinorVersion() < 5) {
			// Servlet <= 2.4: resort to name specified in web.xml, if any.
			String servletContextName = sc.getServletContextName();
			wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX +
					ObjectUtils.getDisplayString(servletContextName));
		}
		else {
			// Servlet 2.5's getContextPath available!
			try {
				String contextPath = (String) ServletContext.class.getMethod("getContextPath").invoke(sc);
				wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX +
						ObjectUtils.getDisplayString(contextPath));
			}
			catch (Exception ex) {
				throw new IllegalStateException("Failed to invoke Servlet 2.5 getContextPath method", ex);
			}
		}

		String configLocation = sc.getInitParameter(CONFIG_LOCATION_PARAM);
		//在这里可以拼上自定义配置文件
		System.out.println(configLocation);
//		configLocation = "classpath:applicationContext.xml";
		wac.setParent(parent);
		wac.setServletContext(sc);
		wac.setConfigLocation(configLocation);
		customizeContext(sc, wac);
		wac.refresh();
		return wac;
	}

	/**
	 * Initialize the root web application context.
	 */
	public void contextInitialized(ServletContextEvent event) {
		this.contextLoader = createContextLoader();
		if (this.contextLoader == null) {
			this.contextLoader = this;
		}
		this.contextLoader.initWebApplicationContext(event.getServletContext());
		
		ApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
		IStarter starter = (IStarter)springContext.getBean("starter");
		starter.start(event);
	}

	/**
	 * Return the ContextLoader used by this listener.
	 * @return the current ContextLoader
	 * @deprecated in favor of simply subclassing ContextLoaderListener itself
	 * (which extends ContextLoader, as of Spring 3.0)
	 */
	@Deprecated
	public ContextLoader getContextLoader() {
		return this.contextLoader;
	}
	
}
