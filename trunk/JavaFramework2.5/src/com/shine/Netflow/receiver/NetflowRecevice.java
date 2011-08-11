package com.shine.Netflow.receiver;

import java.net.DatagramPacket;
import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.NetflowManager;
import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.model.SourceNetFlow;
import com.shine.Netflow.threadModel.ProcessThreadModel;
import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.Netflow.utils.NetFlowUtil;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.Udp.model.UdpRecevice;

/**
 * netflow接收器 用于接收并且解析netflow
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class NetflowRecevice extends UdpRecevice {

	private int cache = 20;
	private List<SourceNetFlow> list = new ArrayList<SourceNetFlow>();

	/**
	 * 初始接收器
	 */
	public NetflowRecevice() {
		super();

		this.setKey("netFlow");
	}

	/**
	 * 初始化接收器
	 * 
	 * @param cache
	 */
	public NetflowRecevice(int cache) {
		super();

		this.setKey("netFlow");
		this.setCache(cache);
	}

	@Override
	public void recevice(String ip, int port, String data) {
		// TODO Auto-generated method stub
	}

	@Override
	public void recevice(DatagramPacket packet) {
		// TODO Auto-generated method stub
	}

	/**
	 * 接收到数据
	 */
	@Override
	public void recevice(String ip, int port, byte[] data) {
		if (list.size() > cache) {
			if (ThreadPoolManager.getManager().getIdleThread("process") != null) {

				ThreadPoolManager.getManager().getIdleThread("process")
						.setValues(((ArrayList) list).clone());
				list.clear();
			} else {
				System.err.println("数据包过多，抛弃部分数据,并且升级系统....");
				NetflowManager.getManager().autoUpdate();
				list.clear();
			}
		} else {
			int versionNum = NetFlowUtil.toIntNumber(data, 0, 2);
			if ((versionNum > 9) || (versionNum <= 0)) {
				//System.err.println("接收到不符合要求数据包....");
				return;
			}

			// 构造原始数据包
			String rooteIP = NetflowManager.getManager().getRouteMap().get(ip);
			if (rooteIP != null) {
				SourceNetFlow sourceNetFlow = new SourceNetFlow();
				sourceNetFlow.setRouteId(Integer.parseInt(rooteIP));
//				sourceNetFlow.setVersionNum(versionNum);
				sourceNetFlow.setNetflowData(data);
				list.add(sourceNetFlow);
				sourceNetFlow = null;
			}
		}
	}

	public int getCache() {
		return cache;
	}

	public void setCache(int cache) {
		this.cache = cache;
	}

}
