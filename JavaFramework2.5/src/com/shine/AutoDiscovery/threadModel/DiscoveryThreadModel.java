package com.shine.AutoDiscovery.threadModel;

import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.core.util.SnmpAbstract;
import com.shine.framework.core.util.SnmpHelper4j;

public class DiscoveryThreadModel extends ThreadModel {

	public DiscoveryThreadModel() {
		this.setType("DiscoveryThreadModel");
		this.setTimeOut(1000);
	}

	@Override
	public void excute(Object... args) {
		if (args.length != 2)
			return;

		try {
			SnmpHelper4j snmpAbstract = new SnmpHelper4j();
			snmpAbstract.init(String.valueOf(args[0]), String.valueOf(args[1]));
			if (snmpAbstract.getSnmp() != null)
				System.out.println(String.valueOf(args[0]) + ":"
						+ String.valueOf(args[1]) + " 连接成功");
			else
				System.out.println(String.valueOf(args[0]) + "连接失败");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(String.valueOf(args[0]) + "连接失败");
		}
	}
}
