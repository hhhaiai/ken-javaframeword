package com.shine.cofferChart.model.columnCharts
{
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.util.XMLArrayCollection;
	import com.shine.framework.core.util.XMLUtils;
	
	public class ColumnsChartsModel extends BaseXmlModel
	{
		public var columnsArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public var nodesArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public function ColumnsChartsModel(value:String=null)
		{
			super(value);
		}
		
		public function setXml(value:XML):void{
			this.initXmlValue(value.toXMLString());
			
			
			columnsArrayCollection.removeAll();
			columnsArrayCollection=XMLUtils.saxXmlNodeByTag(value,["column"]);
			
			nodesArrayCollection.removeAll();
			nodesArrayCollection=XMLUtils.saxXmlNodeByTag(value,["node"]);
		}
			
	}
}