package com.shine.sourceflow.web.show;

import com.shine.DBUtil.model.DBModel;
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
		DBModel dbModel = this.dbModels.get(DATA_DEFAULT);
		for (int i = 0; i < dbModel.size(); i++) {
			cvsStr.append(dbModel.get(i).getString("ip_alias"));
			cvsStr.append(";");
			cvsStr.append(dbModel.get(i).getString("src_ip_total"));
			cvsStr.append("\\n");
		}
		this.charts.put(DATA_DEFAULT, cvsStr.toString());
	}
}
