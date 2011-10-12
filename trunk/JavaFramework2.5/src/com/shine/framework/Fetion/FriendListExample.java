package com.shine.framework.Fetion;

public class FriendListExample {

	/**
	 * 获取好友列表
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		FetionManager.getManger().login("13544424150", "");
		FetionManager.getManger().getFriendsList("13544424150");
		FetionManager.getManger().loginOut("13544424150");
	}

}
