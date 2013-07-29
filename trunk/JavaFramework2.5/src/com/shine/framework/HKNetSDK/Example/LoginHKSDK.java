package com.shine.framework.HKNetSDK.Example;

import com.shine.framework.HKNetSDK.HKNetSDKManger;

/**
 * 登陆摄像头
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class LoginHKSDK {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println(HKNetSDKManger.getManager().regedit(
				"192.168.20.185", 8000, "admin", "12345"));

	}

}
