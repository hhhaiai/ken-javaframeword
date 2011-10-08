package com.shine.sourceflow.web.show;

import java.util.List;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.show.ProtocolTrafficDto;
import com.shine.sourceflow.service.show.ProtocolTrafficService;

public class ProtocolTrafficAction extends ShowGenericAction {
	private static final long serialVersionUID = 1276004260896639231L;
	
	public ProtocolTrafficAction() {
		this.dto = new ProtocolTrafficDto();
		this.service = new ProtocolTrafficService();
	}

	@Override
	protected void generateCharts() {
		StringBuffer cvsStr = new StringBuffer();
		DBModel dbModel = dbModels.get(DATA_DEFAULT);
		for (int i = 0; i < dbModel.size(); i++) {
			cvsStr.append(dbModel.get(i).getString("protocol_alias"));
			cvsStr.append(";");
			cvsStr.append(dbModel.get(i).getString("src_protocol_total"));
			cvsStr.append(";");
			cvsStr.append(dbModel.get(i).getString("dst_protocol_total"));
			cvsStr.append("\\n");
		}
		this.charts.put(DATA_DEFAULT, cvsStr.toString());
	}

	@Override
	protected String getPDFTitle() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected List<String> getTableDatas() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String getTableTitles() {
		// TODO Auto-generated method stub
		return null;
	}

}
