package com.shine.sourceflow.web.show;

import java.util.ArrayList;
import java.util.List;

import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.model.DBRowModel;
import com.shine.sourceflow.model.show.IPGroupTrafficDto;
import com.shine.sourceflow.service.show.IPGroupTrafficService;

public class IPGroupTrafficAction extends ShowGenericAction {
	private static final long serialVersionUID = 2814554595496949874L;

	public IPGroupTrafficAction() {
		this.dto = new IPGroupTrafficDto();
		this.service = new IPGroupTrafficService();
	}

	@Override
	protected void generateCharts() {
		StringBuffer cvsStr = new StringBuffer();
		DBModel dbModel = dbModels.get(DATA_DEFAULT);
		for (int i = 0; i < dbModel.size(); i++) {
			cvsStr.append(dbModel.get(i).getString("ip_alias"));
			cvsStr.append(";");
			cvsStr.append(dbModel.get(i).getString("src_ip_total"));
			cvsStr.append(";");
			cvsStr.append(dbModel.get(i).getString("dst_ip_total"));
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
			data.append(rowModel.getString("ip_alias"));
			data.append(",");
			data.append(rowModel.getString("src_ip_total"));
			data.append(",");
			data.append(rowModel.getString("src_ip_percentage"));
			data.append(",");
			data.append(rowModel.getString("dst_ip_total"));
			data.append(",");
			data.append(rowModel.getString("dst_ip_percentage"));
			tableDatas.add(data.toString());
		}
		return tableDatas;
	}

	@Override
	protected String getTableTitles() {
		return "IP分组名,流入(MB),百分比,流出(MB),百分比";
	}

	@Override
	protected String getPDFTitle() {
		return "IP分组流量统计";
	}
}
