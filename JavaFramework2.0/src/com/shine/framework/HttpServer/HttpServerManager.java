package com.shine.framework.HttpServer;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.handler.DefaultHandler;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.webapp.WebAppContext;
import org.mortbay.thread.BoundedThreadPool;
import org.mortbay.xml.XmlConfiguration;
import org.xml.sax.SAXException;

public class HttpServerManager {
	private Server server;

	@SuppressWarnings("deprecation")
	public void initJettyHttpServer(String contextName, String warPath,
			String port) {
		if (server.isRunning()) {
			System.err.println("请关闭http服务器再重启");
			return;
		}

		try {
			server = new Server();
			BoundedThreadPool threadPool = new BoundedThreadPool();
			// 设置线程池
			threadPool.setMaxThreads(100);
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
