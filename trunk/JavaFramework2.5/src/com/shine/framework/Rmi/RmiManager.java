package com.shine.framework.Rmi;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;

import com.shine.framework.Rmi.model.IRmiOpera;

public class RmiManager {
	private static String port = "1099";

	/**
	 * 初始rmi客户端
	 * @param ip
	 * @param port
	 * @param rmiName
	 * @return
	 */
	public static IRmiOpera initRmiClient(String ip, String port, String rmiName) {
		try {
			IRmiOpera iRmiOpera = (IRmiOpera) Naming.lookup("rmi://" + ip + ":"
					+ port + "/" + rmiName);
			return iRmiOpera;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 初始化rmi客户端
	 * @param ip
	 * @param rmiName
	 * @return
	 */
	public static IRmiOpera initRmiClient(String ip, String rmiName) {
		return initRmiClient(ip, port, rmiName);
	}

	/**
	 * 初始化rmi服务器
	 * @param ip
	 * @param port
	 * @param rmiName
	 * @param iRmiOpera
	 */
	public static void initRmiServer(String ip, String port, String rmiName,
			IRmiOpera iRmiOpera) {
		try {
			LocateRegistry.createRegistry(Integer.parseInt(port));
			System.out.println(port);
			Naming.rebind("rmi://127.0.0.1:" + port + "/" + rmiName, iRmiOpera);
			System.out.println("初始化rmi server完成");
		} catch (MalformedURLException e) {
			System.out.println("发生URL畸形异常！");
			e.printStackTrace();
		} catch (RemoteException e) {
			System.out.println("创建远程对象发生异常！");
			e.printStackTrace();
		}
	}

	/**
	 * 初始化rmi服务器
	 * @param ip
	 * @param rmiName
	 * @param iRmiOpera
	 */
	public static void initRmiServer(String ip, String rmiName,
			IRmiOpera iRmiOpera) {
		initRmiServer(ip, port, rmiName, iRmiOpera);
	}
}
