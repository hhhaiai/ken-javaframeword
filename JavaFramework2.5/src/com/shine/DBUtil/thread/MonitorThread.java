package com.shine.DBUtil.thread;

import com.shine.DBUtil.DBUtil;

public final class MonitorThread extends Thread {
	private boolean monitorState = false;
	private int cacheTime = 1800;

	public void run() {
		while (monitorState) {
			try {
				DBUtil
						.getInstance()
						.executeUpdate(
								"jdbc/cache",
								"delete from cache where julianday(time)*86400<(julianday(strftime('%Y-%m-%d %H:%M:%S','now','localtime'))*86400-"
										+ cacheTime + ");");
				Thread.sleep(cacheTime * 1000);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public boolean isMonitorState() {
		return monitorState;
	}

	public void setMonitorState(boolean monitorState) {
		this.monitorState = monitorState;
	}

	public int getCacheTime() {
		return cacheTime;
	}

	public void setCacheTime(int cacheTime) {
		this.cacheTime = cacheTime;
	}
}
