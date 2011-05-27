package com.shine.workflow.jbpm.model
{
	import com.shine.framework.core.model.BaseXmlModel;
	import mx.controls.Alert;
	
	public class ProcessModel extends BaseXmlModel
	{
		public function ProcessModel(value:String=null)
		{
			super(value);
		}
		
		public function setXml(value:String):void{
			this.initXmlValue(value);
			
			for each(var xml:XML in XML(value).children()){
				Alert.show(xml.toXMLString());
			}
		}
	}
}