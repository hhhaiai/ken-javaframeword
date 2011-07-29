package com.shine.framework.HttpClient;

import java.io.IOException;
import java.net.URL;
import java.security.Security;

import javax.net.ssl.SSLSocketFactory;


import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.commons.httpclient.protocol.ProtocolSocketFactory;
import org.apache.commons.httpclient.protocol.SSLProtocolSocketFactory;
import org.apache.commons.lang.StringUtils;

import com.shine.framework.HttpClient.util.NameValuePairUtil;

/**
 * HttpClientUtil 使用httpclient 3.1
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2010-11-30
 */
public class HttpClientUtil {
	private static final String CONTENT_CHARSET = "utf-8";// httpclient读取内容时使用的字符集

	/**
	 * get new http client
	 * 
	 * @return
	 */
	public static HttpClient getHttpClient() {
		try {
			HttpClient httpClient = new HttpClient();
			return httpClient;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 关闭
	 * 
	 * @param httpClient
	 */
	public static void close(HttpClient httpClient) {
		if (httpClient != null)
			httpClient = null;
	}

	/**
	 * 获取get方法的执行结果
	 * 
	 * @param httpClient
	 * @param getUrl
	 * @return
	 */
	public static boolean getMethodReturnBoolean(HttpClient httpClient,
			String getUrl) {
		GetMethod getMethod = null;
		try {
			getMethod = new GetMethod(getUrl);
			getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
					new DefaultHttpMethodRetryHandler());
			// 执行getMethod
			int statusCode = httpClient.executeMethod(getMethod);

			return HttpClientUtil.isSucess(statusCode);
		} catch (HttpException e) {
			// 发生致命的异常，可能是协议不对或者返回的内容有问题
			System.out.println("Please check your provided http address!");
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			// 发生网络异常
			e.printStackTrace();
			return false;
		} finally {
			// 释放连接
			if (getMethod != null)
				getMethod.releaseConnection();
		}
	}

	/**
	 * get 方法超时时间
	 * 
	 * @param httpClient
	 * @param getUrl
	 * @return
	 */
	public static int getMethodTimeOut(HttpClient httpClient, String getUrl) {
		GetMethod getMethod = null;
		try {
			Long beginTime = System.nanoTime();
			getMethod = new GetMethod(getUrl);
			getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
					new DefaultHttpMethodRetryHandler());
			// 执行getMethod
			int statusCode = httpClient.executeMethod(getMethod);
			long endTime = System.nanoTime();

			if (HttpClientUtil.isSucess(statusCode))
				return (int) (endTime - beginTime) / 1000;
			else
				return 0;
		} catch (HttpException e) {
			// 发生致命的异常，可能是协议不对或者返回的内容有问题
			System.out.println("Please check your provided http address!");
			e.printStackTrace();
			return 0;
		} catch (IOException e) {
			// 发生网络异常
			e.printStackTrace();
			return 0;
		} finally {
			// 释放连接
			if (getMethod != null)
				getMethod.releaseConnection();
		}
	}

	/**
	 * 获取get的size(KB)
	 * 
	 * @param httpClient
	 * @param getUrl
	 * @return
	 */
	public static String getMethodDataSize(HttpClient httpClient, String getUrl) {
		GetMethod getMethod = null;
		try {
			getMethod = new GetMethod(getUrl);
			getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
					new DefaultHttpMethodRetryHandler());
			// 执行getMethod
			int statusCode = httpClient.executeMethod(getMethod);

			if (HttpClientUtil.isSucess(statusCode))
				return String
						.valueOf(getMethod.getResponseBody().length / 1000);
			else
				return "0";
		} catch (HttpException e) {
			// 发生致命的异常，可能是协议不对或者返回的内容有问题
			System.out.println("Please check your provided http address!");
			e.printStackTrace();
			return "0";
		} catch (IOException e) {
			// 发生网络异常
			e.printStackTrace();
			return "0";
		} finally {
			// 释放连接
			if (getMethod != null)
				getMethod.releaseConnection();
		}
	}

	/**
	 * 获取get方法数据的结果
	 * 
	 * @param httpClient
	 * @param getUrl
	 * @return
	 */
	public static String getMethodDataResult(HttpClient httpClient,
			String getUrl) {
		GetMethod getMethod = null;
		try {
			getMethod = new GetMethod(getUrl);
			getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
					new DefaultHttpMethodRetryHandler());
			// 执行getMethod
			int statusCode = httpClient.executeMethod(getMethod);
			if (HttpClientUtil.isSucess(statusCode))
				return getMethod.getResponseBodyAsString();
			return null;
		} catch (HttpException e) {
			// 发生致命的异常，可能是协议不对或者返回的内容有问题
			System.out.println("Please check your provided http address!");
			e.printStackTrace();
			return "0";
		} catch (IOException e) {
			// 发生网络异常
			e.printStackTrace();
			return "0";
		} finally {
			// 释放连接
			if (getMethod != null)
				getMethod.releaseConnection();
		}
	}

	/**
	 * 检测是否可以post成功,默认utf-8
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @return
	 */
	public static boolean postMethodReturnBoolean(HttpClient httpClient,
			String postUrl, NameValuePair[] data) {
		return postMethodReturnBoolean(httpClient, postUrl, data,
				CONTENT_CHARSET);
	}

	/**
	 * 检测是否可以post成功
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @return
	 */
	public static boolean postMethodReturnBoolean(HttpClient httpClient,
			String postUrl, NameValuePair[] data, String encoding) {
		encoding = encoding.trim();
		PostMethod postMethod = null;
		try {
			postMethod = new PostMethod(postUrl);
			postMethod.setRequestBody(data);
			httpClient.getParams().setParameter(
					HttpMethodParams.HTTP_CONTENT_CHARSET, CONTENT_CHARSET);
			int statusCode = httpClient.executeMethod(postMethod);

			return HttpClientUtil.isSucess(statusCode);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			// 释放连接
			if (postMethod != null)
				postMethod.releaseConnection();
		}
	}

	/**
	 * post 超时时间，默认utf-8
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @return
	 */
	public static int postMethodTimeout(HttpClient httpClient, String postUrl,
			NameValuePair[] data) {
		return postMethodTimeout(httpClient, postUrl, data, CONTENT_CHARSET);
	}

	/**
	 * post 超时时间
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @return
	 */
	public static int postMethodTimeout(HttpClient httpClient, String postUrl,
			NameValuePair[] data, String encoding) {
		encoding = encoding.trim();
		PostMethod postMethod = null;
		try {
			postMethod = new PostMethod(postUrl);
			postMethod.setRequestBody(data);
			httpClient.getParams().setParameter(
					HttpMethodParams.HTTP_CONTENT_CHARSET, CONTENT_CHARSET);
			Long beginTime = System.nanoTime();
			int statusCode = httpClient.executeMethod(postMethod);
			long endTime = System.nanoTime();

			if (HttpClientUtil.isSucess(statusCode))
				return (int) (endTime - beginTime) / 1000;
			else
				return 0;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		} finally {
			// 释放连接
			if (postMethod != null)
				postMethod.releaseConnection();
		}
	}

	/**
	 * 获取post的size(KB),默认utf-8
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @return
	 */
	public static String postMethodDataSize(HttpClient httpClient,
			String postUrl, NameValuePair[] data) {
		return postMethodDataSize(httpClient, postUrl, data, CONTENT_CHARSET);
	}

	/**
	 * 获取post的size(KB)
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @return
	 */
	public static String postMethodDataSize(HttpClient httpClient,
			String postUrl, NameValuePair[] data, String encoding) {
		encoding = encoding.trim();
		PostMethod postMethod = null;
		try {
			postMethod = new PostMethod(postUrl);
			postMethod.setRequestBody(data);
			httpClient.getParams().setParameter(
					HttpMethodParams.HTTP_CONTENT_CHARSET, CONTENT_CHARSET);
			int statusCode = httpClient.executeMethod(postMethod);

			if (HttpClientUtil.isSucess(statusCode))
				return String
						.valueOf(postMethod.getResponseBody().length / 1000);
			else
				return "0";
		} catch (Exception e) {
			e.printStackTrace();
			return "0";
		} finally {
			// 释放连接
			if (postMethod != null)
				postMethod.releaseConnection();
		}
	}

	/**
	 * 获取post结果
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @param encoding
	 * @return
	 */
	public static String postMethodDataResult(HttpClient httpClient,
			String postUrl, NameValuePair[] data, String encoding) {
		encoding = encoding.trim();
		PostMethod postMethod = null;
		try {
			postMethod = new PostMethod(postUrl);
			postMethod.setRequestBody(data);
			httpClient.getParams().setParameter(
					HttpMethodParams.HTTP_CONTENT_CHARSET, CONTENT_CHARSET);
			int statusCode = httpClient.executeMethod(postMethod);
			if (HttpClientUtil.isSucess(statusCode))
				return postMethod.getResponseBodyAsString();
			else
				return null;
		} catch (Exception e) {
			e.printStackTrace();
			return "0";
		} finally {
			// 释放连接
			if (postMethod != null)
				postMethod.releaseConnection();
		}
	}

	/**
	 * 
	 * @param httpClient
	 * @param postUrl
	 * @param data
	 * @param encoding
	 * @return
	 */
	public static String postMethodDataResult(HttpClient httpClient,
			String postUrl, NameValuePairUtil data, String encoding) {
		return postMethodDataResult(httpClient, postUrl, data
				.getNameValuePair(), encoding);
	}

	/**
	 * 把client注册 ssl url
	 * @param url
	 * @param client
	 */
	private void supportSSL(String url, HttpClient client) {
		if (StringUtils.isBlank(url)) {
			return;
		}
		String siteUrl = StringUtils.lowerCase(url);
		if (!(siteUrl.startsWith("https"))) {
			return;
		}

		try {
			setSSLProtocol(siteUrl, client);
		} catch (Exception e) {
			System.out.println(e);
		}
		Security.setProperty("ssl.SocketFactory.provider",
				"com.tool.util.DummySSLSocketFactory");
	}

	/**
	 * 把client设置 ssl url
	 * @param strUrl
	 * @param client
	 * @throws Exception
	 */
	private static void setSSLProtocol(String strUrl, HttpClient client)
			throws Exception {

		URL url = new URL(strUrl);
		String host = url.getHost();
		int port = url.getPort();

		if (port <= 0) {
			port = 443;
		}
		ProtocolSocketFactory factory = new SSLProtocolSocketFactory();
		Protocol authhttps = new Protocol("https", factory, port);
		Protocol.registerProtocol("https", authhttps);
		// set https protocol
		client.getHostConfiguration().setHost(host, port, authhttps);
	}

	/**
	 * 检测是否执行成功
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean isSucess(int statusCode) {
		if (statusCode == HttpStatus.SC_OK
				|| statusCode == HttpStatus.SC_ACCEPTED
				|| statusCode == HttpStatus.SC_MOVED_PERMANENTLY
				|| statusCode == HttpStatus.SC_MOVED_TEMPORARILY
				|| statusCode == HttpStatus.SC_TEMPORARY_REDIRECT)
			return true;
		return false;
	}
}