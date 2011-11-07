package com.shine.DBUtil.threadModel;

import java.util.ArrayList;

import com.shine.DBUtil.DBUtil;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class UpdateThreadModel extends ThreadModel {

	public UpdateThreadModel() {
		this.setType("dbUpdate");
		this.setTimeOut(1000);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void excute(Object... args) {
		try {
			if (args.length != 0) {
				String jndi = (String) args[0];

				ArrayList<String> list = (ArrayList<String>) args[1];
				if (list.size() != 0) {
					DBUtil.getInstance().executeBatchUpdate(jndi,
							(ArrayList) list.clone());
					list.clear();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (args != null)
				args = null;
		}
	}

}
