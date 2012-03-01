package com.shine.platform.logger;

/**
 * 日志工厂
 * @author JiangKunpeng 2012.03.01
 * @version 2012.03.01
 */
@SuppressWarnings("unchecked")
public class LoggerFactory {
	private static Class<? extends ILogger> loggerClass = DefaultLogger.class;
	
	private LoggerFactory(){
	}
	
	/**
	 * 设置日志实现类对象
	 * @param clazz
	 */
	public static void setILoggerClass(Class<? extends ILogger> clazz){
		loggerClass = clazz;
	}
	
	/**
	 * 获取日志打印器
	 * @param name
	 * @return
	 */
	public static ILogger getLogger(String name){
		ILogger logger = getLogger();
		logger.setName(name);
		return logger;
	}
	
	/**
	 * 获取日志打印器
	 * @param clazz
	 * @return
	 */
	public static ILogger getLogger(Class clazz){
		ILogger logger = getLogger();
		logger.setClass(clazz);
		return logger;
	}
	
	/**
	 * 通过实现类对象获取日志打印器，如果异常则返回默认日志打印器DefaultLogger
	 * @return
	 */
	private static ILogger getLogger(){
		ILogger logger = null;
		try {
			logger = loggerClass.newInstance();
		} catch (Exception e) {
			System.out.println("实例化日志实现类[" + loggerClass.getName() + "]异常：" + e.getMessage());
		}
		if(logger==null)
			logger = new DefaultLogger();
		return logger;
	}
	
}
