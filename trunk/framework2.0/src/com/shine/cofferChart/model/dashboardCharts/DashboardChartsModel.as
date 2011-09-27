package com.shine.cofferChart.model.dashboardCharts
{
	import com.shine.framework.core.model.BaseXmlModel;
	
	public class DashboardChartsModel extends BaseXmlModel
	{
		public function DashboardChartsModel(value:String=null)
		{
			super(value);
		}
		
		public function setXml(value:XML):void{
			this.initXmlValue(value.toXMLString());
		}
	}
}