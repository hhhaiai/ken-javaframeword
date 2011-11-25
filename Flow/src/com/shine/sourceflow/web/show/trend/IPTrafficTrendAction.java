package com.shine.sourceflow.web.show.trend;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.show.trend.IPTrafficTrendDto;
import com.shine.sourceflow.service.show.trend.IPTrafficTrendService;

public class IPTrafficTrendAction extends TrendGenericAction {
	private static final long serialVersionUID = -6339067387683563186L;
	
	public IPTrafficTrendAction() {
		this.dto = new IPTrafficTrendDto();
		this.service = new IPTrafficTrendService();
	}

	@Override
	protected void generateCharts() {
		StringBuffer cvsStr = new StringBuffer();
		DecimalFormat format = new DecimalFormat("0.00");
		for (Map.Entry<String, DBModel> entry : dbModels.entrySet()) {
			if (!entry.getValue().isEmpty()) {
				cvsStr.append(entry.getKey());
				cvsStr.append(";");
				cvsStr.append(format.format(Double.
						parseDouble(entry.getValue().get(0).
						getString("total_bytes")) / 1048576));
				cvsStr.append("\\n");
			} else {
				cvsStr.append(entry.getKey());
				cvsStr.append(";");
				cvsStr.append("0");
				cvsStr.append("\\n");
			}
		}
		this.charts.put(DATA_DEFAULT, cvsStr.toString());
	}
}
