package com.shine.framework.Rmi;

import java.rmi.Remote;

public interface IRmiManager extends Remote {
	public Object remotingInvoke(String args[]);
}
