package com.shine.framework.HttpServer;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.webapp.WebAppContext;
import org.mortbay.thread.BoundedThreadPool;

/**
 * HttpServerManager
 * 
 * 相关的包
 * 
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2011-03-23
 * @blog http://blog.csdn.net/arjick/archive/2011/04/26/6364746.aspx
 */
public class HttpServerManager {
	private Server server;

	/**
	 * 初始化服务器导入war，连接数默认为100
	 * 
	 * @param contextName
	 * @param warPath
	 * @param port
	 */
	public void initJettyHttpServerByWar(String contextName, String warPath,
			String port) {
		initJettyHttpServerByWar(contextName, warPath, port, 100);
	}

	/**
	 * 初始化服务器导入war
	 * 
	 * @param contextName
	 * @param warPath
	 * @param port
	 * @param threadPoolNum
	 */
	@SuppressWarnings("deprecation")
	public void initJettyHttpServerByWar(String contextName, String warPath,
			String port, int threadPoolNum) {
		if (server != null && server.isRunning()) {
			System.err.println("请关闭http服务器再重启");
			return;
		}

		try {
			server = new Server();
			BoundedThreadPool threadPool = new BoundedThreadPool();
			// 设置线程池
			threadPool.setMaxThreads(threadPoolNum);
			server.setThreadPool(threadPool);
			// 设置连接参数
			Connector connector = new SelectChannelConnector();
			// 设置监听端口
			connector.setPort(Integer.parseInt(port));
			server.setConnectors(new Connector[] { connector });
			WebAppContext context = new WebAppContext();
			// 访问项目地址
			context.setContextPath(contextName);
			// 启动的war包
			context.setWar(warPath);
			server.addHandler(context);
			server.setStopAtShutdown(true);
			server.setSendServerVersion(true);

			server.start();
			server.join();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 初始化服务器通过项目路径,线程池默认为100
	 * 
	 * @param contextName
	 * @param webPath
	 * @param port
	 */
	@SuppressWarnings("deprecation")
	public void initJettyHttpServer(String contextName, String webPath,
			String port) {
		initJettyHttpServer(contextName, webPath, port, 100);
	}

	/**
	 * 初始化服务器通过项目路径
	 * 
	 * @param contextName
	 * @param webPath
	 * @param port
	 */
	@SuppressWarnings("deprecation")
	public void initJettyHttpServer(String contextName, String webPath,
			String port, int threadPoolNum) {
		if (server != null && server.isRunning()) {
			System.err.println("请关闭http服务器再重启");
			return;
		}

		try {
			server = new Server();
			BoundedThreadPool threadPool = new BoundedThreadPool();
			// 设置线程池
			threadPool.setMaxThreads(threadPoolNum);
			server.setThreadPool(threadPool);
			// 设置连接参数
			Connector connector = new SelectChannelConnector();
			// 设置监听端口
			connector.setPort(Integer.parseInt(port));
			server.setConnectors(new Connector[] { connector });
			WebAppContext context = new WebAppContext(webPath, contextName);
			server.addHandler(context);
			server.setStopAtShutdown(true);
			server.setSendServerVersion(true);

			server.start();
			server.join();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void shutdownJettyHttpServer() {
		if (server == null) {
			System.err.println("http没有初始化再重启");
			return;
		}

		try {
			if (server.isRunning())
				server.stop();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void restartJettyHttpServer() {
		if (server == null) {
			System.err.println("http没有初始化再重启");
			return;
		}

		try {
			if (!server.isRunning())
				server.start();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
