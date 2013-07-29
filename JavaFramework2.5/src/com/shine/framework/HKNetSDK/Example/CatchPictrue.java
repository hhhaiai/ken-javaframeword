package com.shine.framework.HKNetSDK.Example;

import com.shine.framework.HKNetSDK.HKNetSDKManger;

public class CatchPictrue {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		HKNetSDKManger.getManager().catchPicture(
				HKNetSDKManger.getManager().regedit("192.168.20.185", 8000,
						"admin", "12345"), 1, "d:/123.jpg");

	}

}
