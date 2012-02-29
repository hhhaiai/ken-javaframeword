package com.shine.platform.context;

import java.util.HashMap;
import java.util.Iterator;
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
 * 通过插件动态加载struts配置文件
 * @author JiangKunpeng 2012.02.28
 * @version 2012.02.29
 */
public class StrutsFilterDispatcher extends StrutsPrepareAndExecuteFilter{	

	@Override   
	public void init(FilterConfig filterConfig) throws ServletException  {		
        InitOperations init = new InitOperations();
        try {
            FilterHostConfig config = new FilterHostConfig(filterConfig);
            init.initLogging(config);
            Dispatcher dispatcher = createDispatcher(config);
            dispatcher.init();  
            init.initStaticContentLoader(config, dispatcher);

            prepare = new PrepareOperations(filterConfig.getServletContext(), dispatcher);
            execute = new ExecuteOperations(filterConfig.getServletContext(), dispatcher);
		    this.excludedPatterns = init.buildExcludedPatternsList(dispatcher);
            postInit(dispatcher, filterConfig);
        } finally {
            init.cleanup();
        }
	}
	private static final String CONFIG = "config";
    private Dispatcher createDispatcher(HostConfig config) {
        Map<String, String> params = new HashMap<String, String>();
        for (Iterator<String> e = config.getInitParameterNames(); e.hasNext(); ) {
 	        String name = e.next();
 	        String value = config.getInitParameter(name); 
	        if(CONFIG.equals(name))
	     	    params.put(CONFIG, getStrutsXMLs(value));
	        else
		        params.put(name, value);
        }
        return new Dispatcher(config.getServletContext(), params);
    }
    
	private String getStrutsXMLs(String defaultCfg) {
	    StringBuffer strutsXmls = new StringBuffer(100);
	    if(defaultCfg!=null){
	    	strutsXmls.append(defaultCfg);
	    	for(String xml : ConfigFactory.getFactory().getStrutsPluginXmls()){
	    		strutsXmls.append(",").append(xml.replaceAll("%20", " "));
	    	}
	    }else{
	    	for(String xml : ConfigFactory.getFactory().getStrutsPluginXmls()){
	    		strutsXmls.append(xml.replaceAll("%20", " ")).append(",");
	    	}
	    	int len = strutsXmls.length();
	    	if(len>0)
	    		strutsXmls.delete(len-1, len);
	    }
		return strutsXmls.toString();
	} 
}
