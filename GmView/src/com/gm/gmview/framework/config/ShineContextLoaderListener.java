package com.gm.gmview.framework.config;

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

public class ShineContextLoaderListener extends ContextLoaderListener {
	private ContextLoader contextLoader;

	@Override
	protected WebApplicationContext createWebApplicationContext(
			ServletContext sc, ApplicationContext parent) {
		// return super.createWebApplicationContext(sc, parent);
		Class<?> contextClass = determineContextClass(sc);
		if (!ConfigurableWebApplicationContext.class
				.isAssignableFrom(contextClass)) {
			throw new ApplicationContextException("Custom context class ["
					+ contextClass.getName() + "] is not of type ["
					+ ConfigurableWebApplicationContext.class.getName() + "]");
		}
		ConfigurableWebApplicationContext wac = (ConfigurableWebApplicationContext) BeanUtils
				.instantiateClass(contextClass);

		// Assign the best possible id value.
		if (sc.getMajorVersion() == 2 && sc.getMinorVersion() < 5) {
			// Servlet <= 2.4: resort to name specified in web.xml, if any.
			String servletContextName = sc.getServletContextName();
			wac
					.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX
							+ ObjectUtils.getDisplayString(servletContextName));
		} else {
			// Servlet 2.5's getContextPath available!
			try {
				String contextPath = (String) ServletContext.class.getMethod(
						"getContextPath").invoke(sc);
				wac
						.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX
								+ ObjectUtils.getDisplayString(contextPath));
			} catch (Exception ex) {
				throw new IllegalStateException(
						"Failed to invoke Servlet 2.5 getContextPath method",
						ex);
			}
		}

		// 将默认的spring配置文件与插件注入的配置文件融合
		String configLocation = sc.getInitParameter(CONFIG_LOCATION_PARAM); // 这里获取到web.xml中通过param配置的spring配置文件路径
		// String fusionConfigLocation =
		// ConfigFactory.getFactory().fusionSpringXml(configLocation, "Spring");
		// //将动态加载的spring配置文件和默认的配置文件拼接在一起

		wac.setParent(parent);
		wac.setServletContext(sc);
		// wac.setConfigLocation(fusionConfigLocation); //设置配置文件路径为拼接后的值
		customizeContext(sc, wac);
		wac.refresh();
		return wac;
	}

	/**
	 * Initialize the root web application context.
	 */
	public void contextInitialized(ServletContextEvent event) {
		// 初始化系统配置，将启动时需要的配置文件加载到系统全局变量中
		// ConfigFactory.getFactory().init(event.getServletContext());

		this.contextLoader = createContextLoader();
		if (this.contextLoader == null) {
			this.contextLoader = this;
		}
		this.contextLoader.initWebApplicationContext(event.getServletContext());
	}
}
