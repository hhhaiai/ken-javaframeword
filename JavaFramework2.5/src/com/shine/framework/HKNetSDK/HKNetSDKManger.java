package com.shine.framework.HKNetSDK;

import com.shine.framework.HKNetSDK.ifs.HCNetSDK;

/**
 * 海康威视sdk
 * 
 * @author viruscodecn
 * 
 */
public class HKNetSDKManger {
	private static HKNetSDKManger manager = null;

	private long lUserID;

	HCNetSDK.NET_DVR_DEVICEINFO_V30 m_strDeviceInfo;

	public static HKNetSDKManger getManager() {
		if (manager == null)
			manager = new HKNetSDKManger();
		return manager;
	}

	/**
	 * 获取HCNetSDK.dll位置
	 * 
	 * @return
	 */
	public String getHCNETSDKPath() {
		return getClass().getResource("HCNetSDK.dll").getPath();
	}

	/**
	 * 获取PlayCtrl.dll位置
	 * 
	 * @return
	 */
	public String getPlayCtrlPath() {
		return getClass().getResource("PlayCtrl.dll").getPath();
	}

	private long regedit(String ip, short port, String userName, String password) {
		m_strDeviceInfo = new HCNetSDK.NET_DVR_DEVICEINFO_V30();
		return 0;
	}

}
