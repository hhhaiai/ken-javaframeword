package com.shine.framework.IIS;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.shine.framework.core.util.SnmpHelper;

/**
 * IIS监控管理类
 * 
 * @author viruscodecn@gmail.com
 * @blog http://blog.csdn.net/arjick/archive/2011/05/27/6450608.aspx
 * 
 */
@SuppressWarnings("unchecked")
public class IISUtils {
	/**
	 * 获取IIS数据发送信息
	 * 
	 * totalBytesSentHighWord 这是自服务启动后，WWW 服务发送的总字节数中的高 32 位。
	 * totalBytesSentLowWord 这是自服务启动后，WWW 服务发送的总字节数中的低 32 位。
	 * totalBytesReceivedHighWord 这是自服务启动后，WWW 服务接收的总字节数中的高 32 位。
	 * totalBytesReceivedLowWord 这是自服务启动后，WWW 服务接收的总字节数中的低 32 位。
	 * totalFilesSent这是自服务启动后，WWW 服务发送的文件总数。 totalFilesReceived 这是自服务启动后，WWW
	 * 服务接收的文件总数。
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @return
	 */
	public static Map<String, String> getIISDataInfo(String ip,
			String community, int port) {
		Map<String, String> map = new HashMap<String, String>();
		SnmpHelper snmpUtils = null;
		String[] oid = { "1.3.6.1.4.1.311.1.7.3.1.1",
				"1.3.6.1.4.1.311.1.7.3.1.2", "1.3.6.1.4.1.311.1.7.3.1.3",
				"1.3.6.1.4.1.311.1.7.3.1.5", "1.3.6.1.4.1.311.1.7.3.1.5",
				"1.3.6.1.4.1.311.1.7.3.1.6" };
		try {
			snmpUtils = new SnmpHelper(ip, community, port, 2);
			List<String> dataList = snmpUtils.getTableView(oid);
			map.put("totalBytesSentHighWord", dataList.get(0));
			map.put("totalBytesSentLowWord", dataList.get(1));
			map.put("totalBytesReceivedHighWord", dataList.get(2));
			map.put("totalBytesReceivedLowWord", dataList.get(3));
			map.put("totalFilesSent", dataList.get(4));
			map.put("totalFilesReceived", dataList.get(5));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			snmpUtils.close();
		}
		return map;
	}

	/**
	 * 获取IIS连接计数
	 * 
	 * currentAnonymousUsers 当前使用 WWW 服务建立匿名连接的用户数。 currentNonAnonymousUsers
	 * 当前使用 WWW 服务建立非匿名连接的用户数。 totalAnonymousUsers 这是自服务启动后，与 WWW 服务建立匿名连接的用户总数。
	 * totalNonAnonymousUsers 这是自服务启动后，与 WWW 服务建立非匿名连接的用户总数。 maxAnonymousUsers
	 * 这是自服务启动后，使用 WWW 服务建立匿名连接的最大用户数量。 maxNonAnonymousUsers 这是自服务启动后，与 WWW
	 * 服务建立同时非匿名连接的最大数量。 currentConnections 这是与 WWW 服务建立的当前连接数。 maxConnections
	 * 这是自服务启动后，与 WWW 服务建立的同时连接的最大数量。 connectionAttempts 这是自服务启动后，已尝试使用 WWW
	 * 服务的连接次数。 logonAttempts 这是自服务启动后，尝试登录到 WWW 服务的次数。
	 * 
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @return
	 */
	public static Map<String, String> getIISConnectionInfo(String ip,
			String community, int port) {
		Map<String, String> map = new HashMap<String, String>();
		SnmpHelper snmpUtils = null;
		String[] oid = { "1.3.6.1.4.1.311.1.7.3.1.7",
				"1.3.6.1.4.1.311.1.7.3.1.8", "1.3.6.1.4.1.311.1.7.3.1.9",
				"1.3.6.1.4.1.311.1.7.3.1.10", "1.3.6.1.4.1.311.1.7.3.1.11",
				"1.3.6.1.4.1.311.1.7.3.1.12", "1.3.6.1.4.1.311.1.7.3.1.13",
				"1.3.6.1.4.1.311.1.7.3.1.14", "1.3.6.1.4.1.311.1.7.3.1.15",
				"1.3.6.1.4.1.311.1.7.3.1.16" };
		try {
			snmpUtils = new SnmpHelper(ip, community, port, 2);
			List<String> dataList = snmpUtils.getTableView(oid);
			map.put("currentAnonymousUsers", dataList.get(0));
			map.put("currentNonAnonymousUsers", dataList.get(1));
			map.put("totalAnonymousUsers", dataList.get(2));
			map.put("totalNonAnonymousUsers", dataList.get(3));
			map.put("maxAnonymousUsers", dataList.get(4));
			map.put("maxNonAnonymousUsers", dataList.get(5));
			map.put("currentConnections", dataList.get(6));
			map.put("maxConnections", dataList.get(7));
			map.put("connectionAttempts", dataList.get(8));
			map.put("logonAttempts", dataList.get(9));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			snmpUtils.close();
		}
		return map;
	}

	/**
	 * 获取IIS请求计数器信息
	 * 
	 * totalOptions 这是自服务启动后，使用 OPTIONS 方法进行的 HTTP 请求数。 totalGets 这是自服务启动后，使用
	 * GET 方法进行的 HTTP 请求数。Get 请求是最常见的 HTTP 请求。 totalPosts 这是自服务启动后，使用 POST 方法进行的
	 * HTTP 请求数。 totalHeads 这是自服务启动后，使用 HEAD 方法进行的 HTTP 请求数。HEAD
	 * 请求通常表明某个客户端正在查询请求已经确定需要刷新的文档的状态。 totalPuts 这是自服务启动后，使用 PUT 方法进行的 HTTP
	 * 请求数。 totalDeletes 这是自服务启动后，使用 DELETE 方法进行的 HTTP 请求数。Delete 请求通常用于文件删除。
	 * totalTraces 这是自服务启动后，使用 TRACE 方法进行的 HTTP 请求数。Trace
	 * 请求允许客户端在请求链的末尾查看接收的内容，并使用该信息进行诊断。 totalMove 这是自服务启动后，使用 MOVE 方法进行的 HTTP
	 * 请求数。Move 请求用于移动文件和目录。 totalCopy 这是自服务启动后，使用 COPY 方法进行的 HTTP 请求数。Copy
	 * 请求用于复制文件和目录。 totalMkcol 这是自服务启动后，使用 MKCOL 方法进行的 HTTP 请求数。Mkcol
	 * 请求用于在服务器上创建目录。 totalPropfind 这是自服务启动后，使用 PROPFIND 方法进行的 HTTP 请求数。Propfind
	 * 请求检索文件和目录的属性值。 totalProppatch 这是自服务启动后，使用 PROPPATCH 方法进行的 HTTP
	 * 请求数。Proppatch 请求设置文件和目录上的属性值。 totalSearch 这是自服务启动后，使用 SEARCH 方法进行的 HTTP
	 * 请求数。Search 请求用于查询服务器以查找与客户端提供的一组条件匹配的资源。 totalLock 这是自服务启动后，使用 LOCK 方法进行的
	 * HTTP 请求数。Lock 请求用于为一个用户锁定文件，只允许该用户修改该文件。 totalUnlock 这是自服务启动后，使用 UNLOCK
	 * 方法进行的 HTTP 请求数。Unlock 请求用于删除文件锁定。 totalOthers 这是自服务器启动后，使用除
	 * OPTIONS、GET、HEAD
	 * 、POST、PUT、DELETE、TRACE、MOVE、COPY、MKCOL、PROPFIND、PROPPATCH、SEARCH、LOCK 或
	 * UNLOCK 方法的 HTTP 请求。 currentCGIRequests 这是正由 WWW 服务同时处理的当前 CGI 请求的数量。
	 * currentBGIRequests 这是正由 WWW 服务同时处理的当前 ISAPI 请求的数量。 totalCGIRequests
	 * 这是自服务启动后，CGI 请求的总数。 totalBGIRequests 这是自服务启动后，收到的 ISAPI 请求的总数。
	 * maxCGIRequests 这是自服务启动后，WWW 服务同时处理的 CGI 请求的最大数量。 maxBGIRequests
	 * 这是自服务启动后，WWW 服务同时处理的 ISAPI 请求的最大数量。
	 * 
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @return
	 */
	public static Map<String, String> getIISRequestInfo(String ip,
			String community, int port) {
		Map<String, String> map = new HashMap<String, String>();
		SnmpHelper snmpUtils = null;
		String[] oid = { "1.3.6.1.4.1.311.1.7.3.1.17",
				"1.3.6.1.4.1.311.1.7.3.1.18", "1.3.6.1.4.1.311.1.7.3.1.19",
				"1.3.6.1.4.1.311.1.7.3.1.20", "1.3.6.1.4.1.311.1.7.3.1.21",
				"1.3.6.1.4.1.311.1.7.3.1.22", "1.3.6.1.4.1.311.1.7.3.1.23",
				"1.3.6.1.4.1.311.1.7.3.1.24", "1.3.6.1.4.1.311.1.7.3.1.25",
				"1.3.6.1.4.1.311.1.7.3.1.26", "1.3.6.1.4.1.311.1.7.3.1.27",
				"1.3.6.1.4.1.311.1.7.3.1.28", "1.3.6.1.4.1.311.1.7.3.1.29",
				"1.3.6.1.4.1.311.1.7.3.1.30", "1.3.6.1.4.1.311.1.7.3.1.31",
				"1.3.6.1.4.1.311.1.7.3.1.32", "1.3.6.1.4.1.311.1.7.3.1.33",
				"1.3.6.1.4.1.311.1.7.3.1.34", "1.3.6.1.4.1.311.1.7.3.1.35",
				"1.3.6.1.4.1.311.1.7.3.1.36", "1.3.6.1.4.1.311.1.7.3.1.37",
				"1.3.6.1.4.1.311.1.7.3.1.38" };

		try {
			snmpUtils = new SnmpHelper(ip, community, port, 2);
			List<String> dataList = snmpUtils.getTableView(oid);
			map.put("totalOptions", dataList.get(0));
			map.put("totalGets", dataList.get(1));
			map.put("totalPosts", dataList.get(2));
			map.put("totalHeads", dataList.get(3));
			map.put("totalPuts", dataList.get(4));
			map.put("totalDeletes", dataList.get(5));
			map.put("totalTraces", dataList.get(6));
			map.put("totalMove", dataList.get(7));
			map.put("totalCopy", dataList.get(8));
			map.put("totalMkcol", dataList.get(9));
			map.put("totalPropfind", dataList.get(10));
			map.put("totalProppatch", dataList.get(11));
			map.put("totalSearch", dataList.get(12));
			map.put("totalLock", dataList.get(13));
			map.put("totalUnlock", dataList.get(14));
			map.put("totalOthers", dataList.get(15));
			map.put("currentCGIRequests", dataList.get(16));
			map.put("currentBGIRequests", dataList.get(17));
			map.put("totalCGIRequests", dataList.get(18));
			map.put("totalBGIRequests", dataList.get(19));
			map.put("maxCGIRequests", dataList.get(20));
			map.put("maxBGIRequests", dataList.get(21));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			snmpUtils.close();
		}
		return map;
	}

	/**
	 * 获取阻塞和死锁信息
	 * 
	 * currentBlockedRequests 这是由于带宽限制设置而被 WWW 服务暂时阻塞的当前请求数量。
	 * totalBlockedRequests 这是由于带宽限制设置而被 WWW 服务暂时阻塞的请求总数。 totalAllowedRequests
	 * 这是自服务启动后，服务器上启用了带宽限制设置时 WWW 服务已允许的请求总数。 totalRejectedRequests
	 * 这是自服务启动后，由于带宽限制设置而被拒绝的请求总数。 totalNotFoundErrors
	 * 这是自服务启动后，由于找不到请求的文档，服务器无法处理的请求数。通常，将它们作为 HTTP 404 错误代码报告给客户端。
	 * totalLockedErrors 这是自服务启动后，由于请求的文档锁定，服务器无法处理的请求总数。通常，将它们作为 HTTP 423
	 * 错误代码报告给客户端。 measuredBandwidth 这是 WWW 服务使用的 I/O 带宽，它是一分钟内的平均值。
	 * 
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @return
	 */
	public static Map<String, String> getIISBlockInfo(String ip,
			String community, int port) {
		Map<String, String> map = new HashMap<String, String>();
		SnmpHelper snmpUtils = null;
		String[] oid = { "1.3.6.1.4.1.311.1.7.3.1.39",
				"1.3.6.1.4.1.311.1.7.3.1.40", "1.3.6.1.4.1.311.1.7.3.1.41",
				"1.3.6.1.4.1.311.1.7.3.1.42", "1.3.6.1.4.1.311.1.7.3.1.43",
				"1.3.6.1.4.1.311.1.7.3.1.44", "1.3.6.1.4.1.311.1.7.3.1.45" };
		try {
			snmpUtils = new SnmpHelper(ip, community, port, 2);
			List<String> dataList = snmpUtils.getTableView(oid);
			map.put("currentBlockedRequests", dataList.get(0));
			map.put("totalBlockedRequests", dataList.get(1));
			map.put("totalAllowedRequests", dataList.get(2));
			map.put("totalRejectedRequests", dataList.get(3));
			map.put("totalNotFoundErrors", dataList.get(4));
			map.put("totalLockedErrors", dataList.get(5));
			map.put("measuredBandwidth", dataList.get(6));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			snmpUtils.close();
		}
		return map;
	}
}
