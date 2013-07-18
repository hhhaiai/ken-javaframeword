package com.gm.gmPlatform.service;

import com.gm.framework.web.BaseService;
import com.gm.gmPlatform.GmPlatformManager;
import com.gm.gmPlatform.model.ResultModel;
import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;

public class LoginService extends BaseService {
	public ResultModel loginIn(String userName, String password) {
		ResultModel rm = new ResultModel();

		StringBuffer sql = new StringBuffer();
		sql.append("select count(*) from platform_user where name='");
		sql.append(userName).append("' and password='");
		sql.append(password).append("'");

		try {
			DBModel model = DBUtil.getInstance().executeQuery(
					GmPlatformManager.getManager().getPlatformJndi(),
					sql.toString());
			if (model.next() != 0) {
				if (model.get(0).getString("count(*)").equals("1"))
					rm.setResult(true);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return rm;
	}
}
