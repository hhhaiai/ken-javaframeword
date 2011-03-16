package com.shine.framework.Jmx;

import java.util.HashMap;
import java.util.Map;

import javax.management.MBeanServerConnection;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;

public class JMXManager {
	/**
	 * 建立连接
	 * 
	 * @param ip
	 * @param jmxport
	 * @return
	 */
	public static MBeanServerConnection createMBeanServer(String ip,
			String jmxport, String userName, String password) {
		try {
			String jmxURL = "service:jmx:rmi:///jndi/rmi://" + ip + ":"
					+ jmxport + "/jmxrmi";
			// jmx
			// url
			JMXServiceURL serviceURL = new JMXServiceURL(jmxURL);

			Map map = new HashMap();
			String[] credentials = new String[] { userName, password };
			map.put("jmx.remote.credentials", credentials);
			JMXConnector connector = JMXConnectorFactory.connect(serviceURL,
					map);
			MBeanServerConnection mbsc = connector.getMBeanServerConnection();
			return mbsc;

		} catch (Exception e) {
			// e.printStackTrace();
			System.err.println(ip + "的中间件不可以达");
		}
		return null;
	}

}
