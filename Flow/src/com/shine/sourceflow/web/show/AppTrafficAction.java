package com.shine.sourceflow.web.show;

import java.util.List;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.show.AppTrafficDto;
import com.shine.sourceflow.service.show.AppTrafficService;

/**
 * 应用程序流量
 */
public class AppTrafficAction extends ShowGenericAction {
	private static final long serialVersionUID = -2996933372857471137L;
	
	public AppTrafficAction() {
		this.dto = new AppTrafficDto();
		this.service = new AppTrafficService();
	}

	@Override
	protected void generateCharts() {
		StringBuffer cvsStr = new StringBuffer();
		DBModel dbModel = dbModels.get(DATA_DEFAULT);
		for (int i = 0; i < dbModel.size(); i++) {
			cvsStr.append(dbModel.get(i).getString("app_alias"));
			cvsStr.append(";");
			cvsStr.append(dbModel.get(i).getString("total_bytes_out"));
			cvsStr.append(";");
			cvsStr.append(dbModel.get(i).getString("total_bytes_in"));
			cvsStr.append("\\n");
		}
		this.charts.put(DATA_DEFAULT, cvsStr.toString());
	}

	@Override
	protected List<String> getTableDatas() {
		return null;
	}

	@Override
	protected String getTableTitles() {
		return null;
	}

	@Override
	protected String getPDFTitle() {
		return null;
	}
}
