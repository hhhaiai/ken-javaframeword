package com.shine.cofferChart.model.lineCharts
{
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.util.XMLArrayCollection;
	import com.shine.framework.core.util.XMLUtils;
	
	public class LineChartsModel extends BaseXmlModel
	{
		public var linesArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public var nodesArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public function LineChartsModel(value:String=null)
		{
			super(value);
		}
		
		public function setXml(value:XML):void{
			this.initXmlValue(value.toXMLString());
			
			linesArrayCollection.removeAll();
			linesArrayCollection=XMLUtils.saxXmlNodeByTag(value,["line"]);
			
			nodesArrayCollection.removeAll();
			nodesArrayCollection=XMLUtils.saxXmlNodeByTag(value,["node"]);
		}
	}
}