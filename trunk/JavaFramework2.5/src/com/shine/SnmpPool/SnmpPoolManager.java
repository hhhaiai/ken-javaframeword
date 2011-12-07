package com.shine.SnmpPool;

import java.util.List;
import java.util.Map;

import org.dom4j.Element;

import com.shine.SnmpPool.threadmodel.SnmpThreadModel;
import com.shine.SnmpPool.utils.SnmpPool;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.SnmpAbstract;
import com.shine.framework.core.util.SnmpHelper4j;
import com.shine.framework.core.util.XmlUitl;

/**
 * snmp采集池的管理器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class SnmpPoolManager {
	private static SnmpPoolManager manager = null;

	// 采集器默认实现类常量
	private static final String SNMP4J = "com.shine.framework.core.util.SnmpHelper4j";

	private int threadSize = 2;

	// Snmp池引用
	private SnmpPool snmpPool = new SnmpPool();

	public static SnmpPoolManager getManager() {
		if (manager == null)
			manager = new SnmpPoolManager();
		return manager;
	}

	/**
	 * 初始化snmp异步查询线程
	 */
	public void init() {
		SnmpThreadModel snmpThreadModel = null;
		for (int i = 0; i < this.threadSize; i++) {
			snmpThreadModel = new SnmpThreadModel();
			snmpThreadModel.setThreadName("snmpThreadModel" + i);
			ThreadPoolManager.getManager().addThread(snmpThreadModel);
			snmpThreadModel = null;
		}
		ThreadPoolManager.getManager().startThreadPool();

		// 清空预设文件采集器历史记录
		try {
			XmlUitl
					.deleteAllSubElement("src/com/shine/SnmpPool/config/snmpv.xml");
		} catch (Exception e) {
			// 可以自定义异常处理
			e.printStackTrace();
		}
	}

	/**
	 * 初始化snmp异步查询线程
	 * 
	 * @param threadSize
	 */
	public void init(int threadSize) {
		this.threadSize = threadSize;
		init();
	}

	/**
	 * 增加snmpthread
	 */
	private void autoAddSnmpThread() {

	}

	/**
	 * 加入snmp接收器
	 * 
	 * @param name
	 * @param ip
	 * @param community
	 *            团体名
	 * @param port
	 * @param poolSize
	 * @throws Exception
	 */
	public void addSnmp(String name, String ip, String community, int port,
			int poolSize) throws Exception {
		addSnmp(name, ip, community, port, poolSize,
				"com.shine.framework.core.util.SnmpHelper4j");
	}

	/**
	 * 初始化snmp采集器
	 * 
	 * @param name
	 * @param ip
	 * @param community
	 * @param port
	 * @param poolSize
	 * @param classPath
	 * @throws Exception
	 */
	public void addSnmp(String name, String ip, String community, int port,
			int poolSize, String classPath) throws Exception {
		try {
			for (int i = 0; i < poolSize; i++) {
				SnmpAbstract snmpAbstract = (SnmpAbstract) ReflectionUtil
						.getClasstoObject(classPath);
				snmpAbstract.init(ip, community, port, 0);
				snmpPool.addSnmp(name, snmpAbstract);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 获取指定的oid的value
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public String getOidValue(String name, String oid) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getOidValueString(oid);
	}

	/**
	 * 异步获取指定的oid的value
	 * 
	 * @param name
	 * @param oid
	 * @param object
	 * @param methodName
	 */
	public void getAsynchronousOidValue(String name, String oid, Object object,
			String methodName) {
		if (ThreadPoolManager.getManager().getIdleThread("snmpGet") != null) {
			ThreadPoolManager.getManager().getIdleThread("snmpGet").setValues(
					name, "getOidValueString", oid, object, methodName);
		} else {
			System.err.println("异步查询线程不够");
			autoAddSnmpThread();
		}
	}

	/**
	 * 批量获取oid的value
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public List<String> getOidValue(String name, String oid[]) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getTableView(oid);
	}

	/**
	 * 异步批量获取oid的value
	 * 
	 * @param name
	 * @param oid
	 * @param object
	 * @param methodName
	 */
	public void getAsynchronousOidValue(String name, String oid[],
			Object object, String methodName) {

	}

	/**
	 * 获取值得oid的table view
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public List<String> getTableValue(String name, String oid) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getTableView(oid);
	}

	/**
	 * 异步获取值得oid的table view
	 * 
	 * @param name
	 * @param oid
	 * @param object
	 * @param methodName
	 */
	public void getAsynchronousgetTableValue(String name, String oid,
			Object object, String methodName) {

	}

	/**
	 * 批量获取值得oid的table view
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public List<String> getTableValue(String name, String oid[]) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getTableView(oid);
	}

	/**
	 * 异步批量获取值得oid的table view
	 * 
	 * @param name
	 * @param oid
	 * @param object
	 * @param methodName
	 */
	public void getAsynchronousgetTableValue(String name, String oid[],
			Object object, String methodName) {

	}

	public SnmpPool getSnmpPool() {
		return snmpPool;
	}

	public void setSnmpPool(SnmpPool snmpPool) {
		this.snmpPool = snmpPool;
	}

	/**
	 * 获取空闲snmp连接器
	 * 
	 * @param name
	 * @return
	 */
	public SnmpAbstract getIdleSnmp(String name) {
		return this.snmpPool.getIdleSnmp(name);
	}

	/**
	 * 关闭指定的snmp池
	 * 
	 * @param name
	 */
	public void close(String name) {
		this.snmpPool.close(name);
	}

	/**
	 * 关闭所有snmp池
	 */
	public void close() {
		this.snmpPool.close();
	}

	/**
	 * 是否存Snmp版本预设值
	 * 
	 * @return
	 */
	private Map<String, String> isExistSnmpPreprocess(String ip) {
		List<Element> list = null;
		try {
			
			list = XmlUitl
					.getAllElementByPath(
							"src/com/shine/SnmpPool/config/snmpv.xml",
							"snmpv");
			for (Element e : list) {
				Map<String, String> ma = XmlUitl.getAllAttribute(e);
				if (ip.equals(ma.get("ip"))) {
					return ma;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			list = null;
		}
		return null;
	}

	/**
	 * Snmp Pool是否存在连接器
	 * 
	 * @param name
	 * @return
	 */
	public SnmpAbstract snmpPoolIsHaveSnmpHelper(String name) {
		SnmpAbstract snmpabstract = getIdleSnmp(name);
		if (snmpabstract != null) {
			return snmpabstract;
		}
		return null;
	}

	/**
	 * 加载Snmp采集数据
	 */
	public void getSnmpData(String name, String ip, String comunity, int port,
			String oid, Object object, String methodName) {

	}

	/**
	 * 启动SNMP采集器
	 * 
	 * @param ip
	 * @param comunity
	 * @param port
	 * @param oid
	 */
	public void getSnmpData(String ip, int port, String oid, String name) {
		SnmpAbstract snmpabstract = snmpPoolIsHaveSnmpHelper(name);
		if (snmpabstract != null) {
			System.out.println(".....池中存在缓存,直接加载.....");
			ThreadPoolManager.getManager().getIdleThread("snmpGet").setValues(
					snmpabstract.getIp(), snmpabstract.getPort(),
					snmpabstract.getVersion(), snmpabstract, oid,
					"getOidValueString");
		} else {
			this.selectSnmpHelperProcess(ip, port, oid, name);
		}
	}

	/**
	 * SNMP数据采集
	 */
	public void selectSnmpHelperProcess(String ip, int port, String oid,
			String name) {
		Map<String, String> snmpMap = null;
		try {
			snmpMap = this.isExistSnmpPreprocess(ip);
			// 存在预设版本
			if (snmpMap != null) {
				System.out.println("....存在预设版本....");
				SnmpAbstract snmpAbstract = (SnmpAbstract) ReflectionUtil
						.getClasstoObject(snmpMap.get("vstr"));
				snmpAbstract.init(snmpMap.get("ip"), "public", Integer
						.parseInt(snmpMap.get("port")), Integer
						.parseInt(snmpMap.get("version")));
				ThreadPoolManager.getManager().getIdleThread("snmpGet")
						.setValues(snmpAbstract.getIp(),
								snmpAbstract.getPort(),
								snmpAbstract.getVersion(), snmpAbstract, oid,
								"getOidValueString");
				// 不存在预设版本，Snmp4j为默认值
			} else {
				System.out.println("....不存在预设版本....");
				SnmpAbstract snmpAbstract = (SnmpAbstract) ReflectionUtil
						.getClasstoObject(this.getDefaultSnmpProcess());
				snmpAbstract.init(ip, "public", port, 0);	
				ThreadPoolManager.getManager().getIdleThread("snmpGet")
						.setValues(ip, port, 0, snmpAbstract, oid,
								"getOidValueString");
			}
		} catch (Exception e) {
			e.printStackTrace();
			snmpMap = null;
		}
	}

	/**
	 * 获取默认SNMP采集器实现类
	 * 
	 * @return
	 */
	private String getDefaultSnmpProcess() {
		return SnmpPoolManager.SNMP4J;
	}

	public int getThreadSize() {
		return threadSize;
	}

	public void setThreadSize(int threadSize) {
		this.threadSize = threadSize;
	}
}
