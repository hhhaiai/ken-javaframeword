package com.shine.platform.logger;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * 默认日志实现类(org.apache.commons.logging)
 * @author JiangKunpeng 2012.03.01
 * @version 2012.03.01
 */
@SuppressWarnings("unchecked")
public class DefaultLogger implements ILogger{
	private Log logger = null; 
	
	@Override
	public void setClass(Class clazz) {
		this.logger = LogFactory.getLog(clazz);
	}
	
	@Override
	public void setName(String name) {
		this.logger = LogFactory.getLog(name);
	}
	
	/**
	 * 获取apache的日志打印器，如果没指定class或name，则使用本类的类对象
	 * @return
	 */
	private Log getLogger(){
		if(logger==null)
			logger = LogFactory.getLog(this.getClass());
		return logger;
	}
	
	@Override
	public void debug(Object obj) {
		if(getLogger().isDebugEnabled())
			getLogger().debug(obj);
	}

	@Override
	public void debug(Object obj, Throwable throwable) {
		if(getLogger().isDebugEnabled())
			getLogger().debug(obj, throwable);
	}

	@Override
	public void error(Object obj) {
		if(getLogger().isErrorEnabled())
			getLogger().error(obj);
	}

	@Override
	public void error(Object obj, Throwable throwable) {
		if(getLogger().isErrorEnabled())
			getLogger().error(obj, throwable);
	}

	@Override
	public void fatal(Object obj) {
		if(getLogger().isFatalEnabled())
			getLogger().fatal(obj);
	}

	@Override
	public void fatal(Object obj, Throwable throwable) {
		if(getLogger().isFatalEnabled())
			getLogger().fatal(obj, throwable);
	}

	@Override
	public void info(Object obj) {
		if(getLogger().isInfoEnabled())
			getLogger().info(obj);
	}

	@Override
	public void info(Object obj, Throwable throwable) {
		if(getLogger().isInfoEnabled())
			getLogger().info(obj, throwable);
	}

	@Override
	public boolean isDebugEnabled() {
		return getLogger().isDebugEnabled();
	}

	@Override
	public boolean isErrorEnabled() {
		return getLogger().isErrorEnabled();
	}

	@Override
	public boolean isFatalEnabled() {
		return getLogger().isFatalEnabled();
	}

	@Override
	public boolean isInfoEnabled() {
		return getLogger().isInfoEnabled();
	}

	@Override
	public boolean isTraceEnabled() {
		return getLogger().isTraceEnabled();
	}

	@Override
	public boolean isWarnEnabled() {
		return getLogger().isWarnEnabled();
	}

	@Override
	public void trace(Object obj) {
		if(getLogger().isTraceEnabled())
			getLogger().trace(obj);
	}

	@Override
	public void trace(Object obj, Throwable throwable) {
		if(getLogger().isTraceEnabled())
			getLogger().trace(obj, throwable);
	}

	@Override
	public void warn(Object obj) {
		if(getLogger().isWarnEnabled())
			getLogger().warn(obj);
	}

	@Override
	public void warn(Object obj, Throwable throwable) {
		if(getLogger().isWarnEnabled())
			getLogger().warn(obj, throwable);
	}
	
}
