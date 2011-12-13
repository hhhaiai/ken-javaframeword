package com.shine.NetAnalisys.threadModel;

import java.util.List;

import com.shine.NetAnalisys.util.PortScanUtil;
import com.shine.framework.ThreadPoolUtil.model.MethodThreadModel;
import com.shine.framework.core.util.ReflectionUtil;

/**
 * 网络端口扫描线程
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class NetPortThreadModel extends MethodThreadModel {
	public NetPortThreadModel() {
		super();
		this.setType("netPortThreadModel");
	}

	@Override
	public void excute(Object... args) {
		try {
			if (args.length != 0) {
				List<Integer> list = PortScanUtil.scanPort((String) args[0],
						Integer.valueOf((String) args[1]), Integer
								.valueOf((String) args[2]));
				ReflectionUtil.invokeMethod(object, methodName, list);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
