package com.shine.framework.Rmi.model;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IRmiOpera extends Remote {
	public Object remotingInvoke(String args[]) throws RemoteException;
}
