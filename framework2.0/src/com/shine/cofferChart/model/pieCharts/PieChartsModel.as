package com.shine.cofferChart.model.pieCharts
{
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.util.XMLArrayCollection;
	import com.shine.framework.core.util.XMLUtils;
	
	public class PieChartsModel extends BaseXmlModel
	{
		public var nodesArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public function PieChartsModel(value:String=null)
		{
			super(value);
		}
		
		public function setXml(value:XML):void{
			this.initXmlValue(value.toXMLString());
			
			nodesArrayCollection.removeAll();
			nodesArrayCollection=XMLUtils.saxXmlNodeByTag(value,["node"]);
		}
	}
}