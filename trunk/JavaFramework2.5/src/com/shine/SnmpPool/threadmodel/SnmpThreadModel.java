package com.shine.SnmpPool.threadmodel;

import java.util.ArrayList;
import java.util.List;

import com.shine.SnmpPool.SnmpPoolManager;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.SnmpAbstract;
import com.shine.framework.core.util.XmlUitl;

/**
 * SNMP异步获取SNMP数据
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
		this();
		this.object = object;
		this.methodName = methodName;
	}

	@Override
	public void excute(Object... args) {
		try {
			if (args != null && args.length != 0) {
				String resutlData = null;
				SnmpAbstract snmpabstract = (SnmpAbstract) args[3];
				String rmsg = snmpabstract.getOidValueString((String) args[4],
						snmpabstract.getVersion());
				// 当前实现类类路径
				String currentClassPath = snmpabstract.getClass().getName();
				if (rmsg != null) {
					// 第一次预设值采集成功
					resutlData = rmsg + " ----一次采集";
				} else {
					// 测试当前实现类其它(v1/v2/v3)版本进行采集数据
					String otherMsg = snmpabstract
							.getOidValueString((String) args[4]);

					// 测试其它实现类采集器采信数据
					if (otherMsg == null) {
						// 除当前实现类的其它实现类采集器
						List<String> list = getClassPathList(currentClassPath);
						for (int i = 0; i < list.size(); i++) {
							String antherClassPath = list.get(i);
							snmpabstract = (SnmpAbstract) ReflectionUtil
									.getClasstoObject(antherClassPath);
							snmpabstract.init((String) args[0], "public",
									(Integer) args[2], (Integer) args[3]);
							String info = snmpabstract
									.getOidValueString((String) args[4]);
							if (info != null) {
								resutlData = info + " ----Snmp版本循环采集";
								snmpabstract.setImplementClass(antherClassPath);
								break;
							}
						}
					} else {
						resutlData = otherMsg + " ----V1/V2/V3循环采集";
						snmpabstract.setImplementClass(currentClassPath);
					}
				}

				// 进入SNMP连接池
				if (resutlData != null) {
					SnmpPoolManager.getManager().getSnmpPool().addSnmp(
							"Port-oid", snmpabstract);

					// 生成预设值，保存到xml文件中
					boolean flag = XmlUitl.isExistRecord("",snmpabstract.getIp());
					if(flag){
						String ip=snmpabstract.getIp();
						String port = ""+snmpabstract.getPort();
						String vstr = snmpabstract.getImplementClass();
						String version = ""+snmpabstract.getVersion();
						String[] data ={ip,port,vstr,version};
						XmlUitl.modifyXml("src/com/shine/SnmpPool/config/snmpv.xml",data);
					}else{
						XmlUitl.createSubElement("src/com/shine/SnmpPool/config/snmpv.xml",snmpabstract.getIp(),snmpabstract.getPort(),snmpabstract.getImplementClass(),snmpabstract.getVersion());
					}
					
					System.out.println("最终采集设备数据-->" + resutlData);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 其它采集器实现类类路径
	 * 
	 * @param cp
	 * @return
	 */
	private List<String> getClassPathList(String cp) {
		List<String> list = new ArrayList<String>();
		list.add("com.shine.framework.core.util.SnmpHelper4j");
		list.add("com.shine.framework.core.util.SnmpHelper");
		for (int i = 0; i < list.size(); i++) {
			String temp = list.get(i);
			if (cp.equals(temp)) {
				list.remove(i);
			}
		}
		return list;
	}
}
