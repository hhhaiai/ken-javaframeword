package com.shine.featuresView.model
{
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.util.XMLArrayCollection;
	import com.shine.framework.core.util.XMLUtils;
	
	
	public class BusinessModel extends BaseXmlModel
	{
		public var modelArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public var lineArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public var alarmArrayCollection:XMLArrayCollection=new XMLArrayCollection;
		public function BusinessModel()
		{
			super();
		}
		
		public function setXml(value:XML):void{
			this.initXmlValue(value.toXMLString());
			
			modelArrayCollection.removeAll();
			modelArrayCollection=XMLUtils.saxXmlNodeByTag(value,["Node"]);
			
			lineArrayCollection.removeAll();
			lineArrayCollection=XMLUtils.saxXmlNodeByTag(value,["Line"]);
			
			alarmArrayCollection.removeAll();
			alarmArrayCollection=XMLUtils.saxXmlNodeByTag(value,["Log"]);
		}
	}
}