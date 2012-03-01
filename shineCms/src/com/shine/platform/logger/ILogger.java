package com.shine.platform.logger;

/**
 * 日志接口
 * @author JiangKunpeng 2012.03.01
 * @version 2012.03.01
 */
@SuppressWarnings("unchecked")
public interface ILogger {
	public abstract void setClass(Class clazz);
	
	public abstract void setName(String name);

	public abstract boolean isDebugEnabled();

	public abstract boolean isErrorEnabled();

	public abstract boolean isFatalEnabled();

	public abstract boolean isInfoEnabled();

	public abstract boolean isTraceEnabled();

	public abstract boolean isWarnEnabled();

	public abstract void trace(Object obj);

	public abstract void trace(Object obj, Throwable throwable);

	public abstract void debug(Object obj);

	public abstract void debug(Object obj, Throwable throwable);

	public abstract void info(Object obj);

	public abstract void info(Object obj, Throwable throwable);

	public abstract void warn(Object obj);

	public abstract void warn(Object obj, Throwable throwable);

	public abstract void error(Object obj);

	public abstract void error(Object obj, Throwable throwable);

	public abstract void fatal(Object obj);

	public abstract void fatal(Object obj, Throwable throwable);
}
