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
				SnmpAbstract snmpAbstract = (SnmpAbstract) args[0];
				Object o = snmpAbstract.getOidValueString((String)args[1],snmpAbstract.getVersion());
				System.out.println(o.toString());
				if(o==null){
					SnmpPoolManager.getManager().setStatu(false);
				}else{
					SnmpPoolManager.getManager().setStatu(true);	
				}
				//ReflectionUtil.invokeMethod(args[2], (String) args[3],o);
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
