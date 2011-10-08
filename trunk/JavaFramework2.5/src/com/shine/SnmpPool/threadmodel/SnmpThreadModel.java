package com.shine.SnmpPool.threadmodel;

import com.shine.SnmpPool.SnmpPoolManager;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.SnmpAbstract;

/**
 * snmp异步获取snmp数据
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class SnmpThreadModel extends ThreadModel {
	protected String methodName;
	protected Object object;

	public SnmpThreadModel() {
		this.setType("snmpGet");
		this.setTimeOut(1000);
	}

	public SnmpThreadModel(Object object, String methodName) {
		this.object = object;
		this.methodName = methodName;
		this.setType("snmpGet");
		this.setTimeOut(1000);
	}

	@Override
	public void excute(Object... args) {
		try {
			if (args != null && args.length != 0) {
				SnmpAbstract snmpAbstract = SnmpPoolManager.getManager()
						.getIdleSnmp((String) args[0]);
				Object o = ReflectionUtil.invokeMethod(snmpAbstract,
						(String) args[1], args[2]);
				ReflectionUtil.invokeMethod(args[3], (String) args[4], o);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
