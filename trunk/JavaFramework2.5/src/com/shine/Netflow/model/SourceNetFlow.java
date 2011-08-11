package com.shine.Netflow.model;

public class SourceNetFlow {
	private int routeId = 0;
	private int versionNum = 0;
	private byte[] netflowData;

	public int getRouteId() {
		return routeId;
	}

	public void setRouteId(int routeId) {
		this.routeId = routeId;
	}

	public int getVersionNum() {
		return versionNum;
	}

	public void setVersionNum(int versionNum) {
		this.versionNum = versionNum;
	}

	public byte[] getNetflowData() {
		return netflowData;
	}

	public void setNetflowData(byte[] netflowData) {
		this.netflowData = netflowData;
	}

}
