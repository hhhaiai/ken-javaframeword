package com.shine.Ftp.util;

import com.shine.Ftp.FtpManager;

public class FtpTest {

	/**
	 * 主方法(测试)
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		FtpManager fm = FtpManager.getManager();
		fm.addFtpClient("192.168.2.18", 21, "administrator", "sunshine");
		//fm.dir("192.168.2.18", 21);
		fm.dir("192.168.2.18", 21,"ftp");
		System.out.println("响应时间："+fm.responseTimes("192.168.2.18", 21)+" ms");
	}

}
