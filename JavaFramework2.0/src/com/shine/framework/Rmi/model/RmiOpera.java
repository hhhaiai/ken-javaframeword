package com.shine.framework.Rmi.model;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

public class RmiOpera extends UnicastRemoteObject implements IRmiOpera {

	public RmiOpera() throws RemoteException {
		super();
	}

	@Override
	public Object remotingInvoke(String[] args) throws RemoteException {
		return "String";
	}

}
