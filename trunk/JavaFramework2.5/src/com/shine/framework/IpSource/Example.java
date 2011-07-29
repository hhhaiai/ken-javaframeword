package com.shine.framework.IpSource;

public class Example {

	public static void main(String[] args) {
		String[] ips = new String[]{"220.181.6.18","72.14.203.99","183.60.3.145"
				,"218.16.151.187","219.136.139.87"};
		for (String ip : ips) {
			System.out.println(ip+"\t"+InternetIPSeeker.getInstance().getAddress(ip));
		}

	}

}
