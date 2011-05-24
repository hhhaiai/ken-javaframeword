package com.shine.framework.ProxyServer.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class ProxyServerHelper {

	private ProxyRunnable proxyRunnable;

	private String host;

	private int remoteport;

	private int localport;

	private boolean state = false;

	public ProxyServerHelper() {

	}

	/**
	 * 监听服务器
	 * 
	 * @param host
	 * @param remoteport
	 * @param localport
	 */
	public ProxyServerHelper(String host, int remoteport, int localport) {
		this.host = host;
		this.remoteport = remoteport;
		this.localport = localport;
	}

	/**
	 * 启动接收数据包
	 */
	public final void startProxy() {
		System.out.println("Starting proxy for " + host + ":" + remoteport
				+ " on port " + localport);
		this.state = true;
		if (proxyRunnable == null) {
			proxyRunnable = new ProxyRunnable();
			proxyRunnable.setHelper(this);
			proxyRunnable.start();
		}
	}

	/**
	 * 关闭proxy 服务器
	 */
	public void close() {
		state = false;
	}

	/**
	 * runs a single-threaded proxy server on the specified local port. It never
	 * returns.
	 */
	public void runServer() throws IOException {
		// Create a ServerSocket to listen for connections with
		ServerSocket ss = new ServerSocket(localport);

		final byte[] request = new byte[1024];
		byte[] reply = new byte[4096];

		while (state) {
			Socket client = null, server = null;
			try {
				// Wait for a connection on the local port
				client = ss.accept();

				final InputStream streamFromClient = client.getInputStream();
				final OutputStream streamToClient = client.getOutputStream();

				// Make a connection to the real server.
				// If we cannot connect to the server, send an error to the
				// client, disconnect, and continue waiting for connections.
				try {
					server = new Socket(host, remoteport);
				} catch (IOException e) {
					PrintWriter out = new PrintWriter(streamToClient);
					out.print("Proxy server cannot connect to " + host + ":"
							+ remoteport + ":\n" + e + "\n");
					out.flush();
					client.close();
					continue;
				}

				// Get server streams.
				final InputStream streamFromServer = server.getInputStream();
				final OutputStream streamToServer = server.getOutputStream();

				// a thread to read the client's requests and pass them
				// to the server. A separate thread for asynchronous.
				Thread t = new Thread() {
					public void run() {
						int bytesRead;
						try {
							while ((bytesRead = streamFromClient.read(request)) != -1) {
								streamToServer.write(request, 0, bytesRead);
								streamToServer.flush();
							}
						} catch (IOException e) {
						}

						// the client closed the connection to us, so close our
						// connection to the server.
						try {
							streamToServer.close();
						} catch (IOException e) {
						}
					}
				};

				// Start the client-to-server request thread running
				t.start();

				// Read the server's responses
				// and pass them back to the client.
				int bytesRead;
				try {
					while ((bytesRead = streamFromServer.read(reply)) != -1) {
						streamToClient.write(reply, 0, bytesRead);
						streamToClient.flush();
					}
				} catch (IOException e) {
				}

				// The server closed its connection to us, so we close our
				// connection to our client.
				streamToClient.close();
			} catch (IOException e) {
				System.err.println(e);
			} finally {
				try {
					if (server != null)
						server.close();
					if (client != null)
						client.close();
				} catch (IOException e) {
				}
			}
		}
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getRemoteport() {
		return remoteport;
	}

	public void setRemoteport(int remoteport) {
		this.remoteport = remoteport;
	}

	public int getLocalport() {
		return localport;
	}

	public void setLocalport(int localport) {
		this.localport = localport;
	}

	public boolean isState() {
		return state;
	}

	public void setState(boolean state) {
		this.state = state;
	}

}

class ProxyRunnable extends Thread {
	private ProxyServerHelper helper;

	public void run() {
		try {
			if (helper != null)
				helper.runServer();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public ProxyServerHelper getHelper() {
		return helper;
	}

	public void setHelper(ProxyServerHelper helper) {
		this.helper = helper;
	}

}
