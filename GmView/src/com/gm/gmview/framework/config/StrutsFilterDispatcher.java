package com.gm.gmview.framework.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.FilterConfig;
import javax.servlet.ServletException;

import org.apache.struts2.dispatcher.Dispatcher;
import org.apache.struts2.dispatcher.ng.ExecuteOperations;
import org.apache.struts2.dispatcher.ng.HostConfig;
import org.apache.struts2.dispatcher.ng.InitOperations;
import org.apache.struts2.dispatcher.ng.PrepareOperations;
import org.apache.struts2.dispatcher.ng.filter.FilterHostConfig;
import org.apache.struts2.dispatcher.ng.filter.StrutsPrepareAndExecuteFilter;

/**
 * 读取系统中所有struts的配置文件
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class StrutsFilterDispatcher extends StrutsPrepareAndExecuteFilter {
	private static final List<String> xmls = new ArrayList<String>();

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		InitOperations init = new InitOperations();
		try {
			FilterHostConfig config = new FilterHostConfig(filterConfig);
			init.initLogging(config);
			Dispatcher dispatcher = createDispatcher(config);
			dispatcher.init();
			init.initStaticContentLoader(config, dispatcher);

			prepare = new PrepareOperations(filterConfig.getServletContext(),
					dispatcher);
			execute = new ExecuteOperations(filterConfig.getServletContext(),
					dispatcher);
			this.excludedPatterns = init.buildExcludedPatternsList(dispatcher);
			postInit(dispatcher, filterConfig);
		} finally {
			init.cleanup();
		}
	}

	private Dispatcher createDispatcher(HostConfig config) {
		Map<String, String> params = new HashMap<String, String>();
		for (Iterator e = config.getInitParameterNames(); e.hasNext();) {
			String name = (String) e.next();
			String value = config.getInitParameter(name);
			if (name.equals("config"))
				params.put("config", getStrutsXMLs(value));
			else
				params.put(name, value);
		}
		return new Dispatcher(config.getServletContext(), params);
	}

	private String getStrutsXMLs(String defaultCfg) {
		StringBuffer strutsxmls = new StringBuffer(100);
		strutsxmls.append(defaultCfg);
		// 以下代码改在FrameworkConfigFactory中注入,为了能指定其他的struts.xml JiangKunpeng
		// 2012-09-20
		// strutsxmls.append(",").append(FrameworkConfigFactory.getConfig().getSysPath());
		// strutsxmls.append("WEB-INF/config/struts.xml");
		for (String xml : xmls)
			strutsxmls.append(",").append(xml);
		return strutsxmls.toString();
	}

	public static void registerXML(String xmlPath) {
		if (xmlPath != null)
			xmls.add(xmlPath.replace("%20", " "));
	}
}
