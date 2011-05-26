package com.shine.workflow.jbpm.model
{
	import com.shine.framework.core.model.BaseXmlModel;
	
	public class BasePointModel extends BaseXmlModel
	{
		public function BasePointModel(value:String=null)
		{
			super(value);
		}
		
		public function setPoint(value:String):void{
			this.initXmlValue(value);
		}
	}
}