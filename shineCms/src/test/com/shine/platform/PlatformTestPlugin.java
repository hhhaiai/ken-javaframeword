package test.com.shine.platform;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;
import com.shine.platform.plugin.IPlugin;

public class PlatformTestPlugin implements IPlugin{
	ILogger logger = LoggerFactory.getLogger(getClass());
	
	public void destory() {
		
	}

	public String getName() {
		return "PlatformTest";
	}

	public void init() {
		logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:test/com/shine/platform/testContext.xml");
		ConfigFactory.getFactory().registerStrutsPluginXml(getClass().getResource("struts.xml").getPath());
	}

	public void start() {
		logger.debug("启动插件[" + getName() + "]");
	}
	
}
