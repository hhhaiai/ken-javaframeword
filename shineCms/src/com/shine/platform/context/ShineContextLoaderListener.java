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

import com.shine.platform.plugin.PluginContext;

/**
 * 系统启动监听器<br/>
 * (重写spring上下文监听器,加载spring前加载系统参数并扫描系统插件,<br/>
 * 加载spring同时初始化插件,加载spring后启动插件)
 * @author JiangKunpeng 2012.02.14
 * @version 2012.02.15
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
		configLocation = configLocation + ","+ConfigFactory.getFactory().getSpringPluginXmls().get(0);
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
		//初始化系统配置工厂
		ConfigFactory.getFactory().init(event.getServletContext());
		//初始化插件
		PluginContext.getContext().initPlugins();
		
		this.contextLoader = createContextLoader();
		if (this.contextLoader == null) {
			this.contextLoader = this;
		}
		this.contextLoader.initWebApplicationContext(event.getServletContext());
		
		ApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
		
		//注入Spring上下文到系统配置工厂
		ConfigFactory.getFactory().setSpringContext(springContext);
		//启动所有插件
		PluginContext.getContext().startPlugins();
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
