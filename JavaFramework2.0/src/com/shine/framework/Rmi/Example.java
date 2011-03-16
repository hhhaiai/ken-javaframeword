package com.shine.framework.Rmi;

import java.rmi.RemoteException;

import com.shine.framework.Rmi.model.IRmiOpera;
import com.shine.framework.Rmi.model.RmiOpera;

public class Example {
	public static void main(String args[]) throws RemoteException {
		IRmiOpera iRmiManager = new RmiOpera();
		RmiManager.initRmiServer("127.0.0.1", "abc", iRmiManager);

		IRmiOpera iRmiManager2 = RmiManager.initRmiClient("127.0.0.1", "abc");
		System.out.println(iRmiManager2.remotingInvoke(null).toString());
	}
}
