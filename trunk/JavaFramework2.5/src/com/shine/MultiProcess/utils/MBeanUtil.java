package com.shine.MultiProcess.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.*;

import javax.naming.Context;
import javax.naming.InitialContext;

//import weblogic.management.MBeanHome;

public class MBeanUtil {
	private MBeanUtil() {
	}

	// public static MBeanHome getMBeanHome(String ip, String port, String
	// username, String password) {
	// String url = "t3://" + ip + ":" + port;
	//    	
	// Hashtable ht = new Hashtable();
	// ht.put("java.naming.provider.url", url);
	// ht.put("java.naming.factory.initial",
	// "weblogic.jndi.WLInitialContextFactory");
	// ht.put("java.naming.security.principal", username);
	// ht.put("java.naming.security.credentials", password);
	// try {
	// Context ctx = new InitialContext(ht);
	// MBeanHome home = (MBeanHome)ctx.lookup("weblogic.management.adminhome");
	// return home;
	// }catch (Exception e) {
	// e.printStackTrace();
	// System.out.println("访问服务器错误：" + ip + "_" + port);
	// }
	// /**
	// * 如果不行，则以匿名试下
	// */
	// ht.put("java.naming.security.principal", "");
	// ht.put("java.naming.security.credentials", "");
	// try {
	// Context ctx = new InitialContext(ht);
	// MBeanHome home = (MBeanHome)ctx.lookup("weblogic.management.adminhome");
	// return home;
	// }catch (Exception e) {
	// e.printStackTrace();
	// System.out.println("访问服务器错误：" + ip + "_" + port);
	// }
	// return null;
	// }
	//    
	// public static List getMBeanContent(String ip, String port, String
	// username, String password,String name){
	// return getMBeanContent(getMBeanHome(ip,port,username,password),name);
	// }
	//    
	// public static List getMBeanContent(MBeanHome home,String name){
	// Set set = home.getMBeansByType(name);
	// if(set != null){
	// List infos = new ArrayList();
	// Iterator iter = set.iterator();
	// while(iter.hasNext())
	// infos.add(toMap(iter.next()));
	// return infos;
	// }
	// return null;
	// }
	//    
	// private static Map toMap(Object mbean){
	// Method[] methods = mbean.getClass().getMethods();
	// Map map = new HashMap();
	// for(int i=0;i<methods.length;i++){
	// if(methods[i].getName().startsWith("get") &&
	// methods[i].getParameterTypes().length==0){
	// try{
	// String attribute = methods[i].getName().substring(3);
	// String value = methods[i].invoke(mbean,null).toString();
	// map.put(attribute, value);
	// }catch(Exception e){
	// }
	// }
	// }
	// return map;
	// }
	//    
	// public static void printMBean(List beans){
	// for(int i=0;i<beans.size();i++){
	// System.out.println(i + "===========================");
	// Map map = (Map)beans.get(i);
	// Iterator itor = map.keySet().iterator();
	// while(itor.hasNext()){
	// String key = (String)itor.next();
	// System.out.println(key + "=" + map.get(key));
	// }
	// }
	// }

	public static void main(String[] args) throws Exception {
		// MBeanHome home = MBeanUtil.getMBeanHome("127.0.0.1","7001","","");
		// List list = MBeanUtil.getMBeanContent(home, "EntityEJBRuntime");
		// MBeanUtil.printMBean(list);

		System.out.println("process start");
		BufferedReader bfr = new BufferedReader(
				new InputStreamReader(System.in));
		while (true) {
			String line = bfr.readLine();
			if (line != null) {
				System.out.println("order:" + line);
			} else {
				return;
			}
		}
	}
}
