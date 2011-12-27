package com.shine.NetAnalisys.model;

import java.util.ArrayList;

public class NetPortCallBack implements NetAnalyzeCallBack {
	private boolean isAnalyzeFinished = false;
	
	public void callback(ArrayList<Integer> list) {
		for (int port : list) {
			System.err.println("IP端口:" + port + " 开通");
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
}
