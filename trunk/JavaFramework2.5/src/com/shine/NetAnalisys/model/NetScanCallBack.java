package com.shine.NetAnalisys.model;

import java.util.ArrayList;
import java.util.List;

public class NetScanCallBack implements NetAnalyzeCallBack {
	private boolean isAnalyzeFinished = false;
	
	private List<String> ipList = new ArrayList<String>();
	
	public void callback(ArrayList<String> list) {
		for (String ip : list) {
			ipList.add(ip);
		}
	}

	@Override
	public boolean isAnalyzeFinished() {
		return isAnalyzeFinished;
	}

	@Override
	public void setAnalyzeFinished(boolean finish) {
		isAnalyzeFinished = finish;
	}
	
	public List<String> getIpList() {
		while (!this.isAnalyzeFinished()) {
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
			}
		}
		return ipList;
	}
	
	public void print() {
		while (!this.isAnalyzeFinished()) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
			}
		}
		for (String ip : ipList) {
			System.out.println("指定IP:" + ip + " 已经连通");
		}
	}
}
