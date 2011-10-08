package com.shine.sourceflow.web.show;

import java.util.ArrayList;
import java.util.List;

import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.model.DBRowModel;
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
		List<String> tableDatas = new ArrayList<String>();
		DBModel dbModel = this.getDefaultDbModel();
		for (DBRowModel rowModel : dbModel) {
			StringBuffer data = new StringBuffer();
			data.append(rowModel.getString("app_alias"));
			data.append(",");
			data.append(rowModel.getString("total_bytes_all"));
			data.append(",");
			data.append(rowModel.getString("total_bytes_in"));
			data.append(",");
			data.append(rowModel.getString("bytes_in_percentage"));
			data.append(",");
			data.append(rowModel.getString("total_bytes_out"));
			data.append(",");
			data.append(rowModel.getString("bytes_out_percentage"));
			tableDatas.add(data.toString());
		}
		return tableDatas;
	}

	@Override
	protected String getTableTitles() {
		return "应用程序,总流量(MB),流入(MB),百分比,流出(MB),百分比";
	}

	@Override
	protected String getPDFTitle() {
		return "应用流量";
	}
}
