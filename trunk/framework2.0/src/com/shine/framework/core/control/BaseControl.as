package com.shine.framework.core.control
{
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.util.ReferenceUtil;
	
	import mx.controls.Alert;
	
	public class BaseControl extends BaseXmlModel
	{
		public function BaseControl()
		{
			super();
		}
		
		public function add(value:Object):void{
			this.put(ReferenceUtil.getClassName(value),value);
		}
	}
}