package com.shine.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.apache.commons.codec.binary.Base64;

/**
 * 加密工具类
 * @author JiangKunpeng 2012.03.08
 * @version 2012.03.09
 */
final public class EncryptUtil {
	private EncryptUtil(){
	}
	
	/**
	 * 简单加密
	 * @param input		要加密的数据
	 * @param algorithm	加密算法(MD5/SHA/SHA-256)
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static byte[] encryptSimple(final byte[] input,final String algorithm) throws NoSuchAlgorithmException{
		MessageDigest md = MessageDigest.getInstance(algorithm);
		return md.digest(input);
	}
	
	/**
	 * 简单加密
	 * @param input		要加密的数据
	 * @param algorithm	加密算法(MD5/SHA/SHA-256)
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static String encryptSimple(final String input,final String algorithm) throws NoSuchAlgorithmException{
		return new String(Base64.encodeBase64(encryptSimple(input.getBytes(), algorithm)));
	}
	
	public static void main(String[] args) {
		//文章内容
		String content = "文章内容...";
		//加密算法 MD5/SHA/SHA-256
		String algorithm = "SHA";
		try {
			String str = encryptSimple(content, algorithm);
			System.out.println("摘要长度："+str.length()+",摘要："+str);
		} catch (Exception e) {
			e.printStackTrace();
		}
		//在后台保存文章时给文章加密并存入密文摘要字段
		//每次访问文章时将内容加密与之前密文摘要对比，如果对比不上说明文章被篡改
	}
}
