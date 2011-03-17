package com.shine.framework.SecurityUtil;

import java.math.BigInteger;

public class Example {
	public static void main(String args[]) throws Exception {
		String inputStr = "简单加密";
		System.err.println("原文:\n" + inputStr);

		byte[] inputData = inputStr.getBytes();
		String code = SecurityUtil.encryptBASE64(inputData);

		System.err.println("BASE64加密后:\n" + code);

		byte[] output = SecurityUtil.decryptBASE64(code);

		String outputStr = new String(output);

		System.err.println("BASE64解密后:\n" + outputStr);

		System.out.println("==================");

		String key = SecurityUtil.initMacKey();
		System.err.println("Mac密钥:\n" + key);

		System.err.println("Mac加密后:\n"
				+ SecurityUtil.encryptHMAC(inputData, key));

		System.out.println();

		String key_a1 = SecurityUtil.initMacKey(SecurityUtil.KEY_MAC_A1);
		System.err.println("Mac A1密钥:\n" + key);

		System.err.println("Mac A1加密后:\n"
				+ SecurityUtil.encryptHMAC(inputData, key_a1));
		System.err.println("Mac A1加密后:\n"
				+ SecurityUtil.encryptHMAC(inputData, key_a1));

		System.out.println("===================");

		BigInteger md5 = new BigInteger(SecurityUtil.encryptMD5(inputData));
		System.err.println("MD5:\n" + md5.toString(16));

		BigInteger sha = new BigInteger(SecurityUtil.encryptSHA(inputData));
		System.err.println("SHA:\n" + sha.toString(32));

		BigInteger mac = new BigInteger(SecurityUtil.encryptHMAC(inputData,
				inputStr));
		System.err.println("HMAC:\n" + mac.toString(16));
	}
}
