package test.com.shine.platform;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.plugin.IPlugin;

public class PlatformTestPlugin implements IPlugin{
	Log logger = LogFactory.getLog(getClass());
	
	public void destory() {
		
	}

	public String getName() {
		return "PlatformTest";
	}

	public void init() {
		if(logger.isDebugEnabled())
			logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:test/com/shine/platform/testContext.xml");
		ConfigFactory.getFactory().registerStrutsPluginXml(getClass().getResource("struts.xml").getPath());
	}

	public void start() {
		
	}
	
}
