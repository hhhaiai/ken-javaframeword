package com.shine.framework.EventControl.utils
{
	import com.shine.framework.core.util.ArrayMap;
	import com.shine.framework.core.util.ReferenceUtil;
	
	import mx.core.UIComponent;
	
	public class ComponentMap extends ArrayMap
	{
		public function ComponentMap()
		{
			super();
		}
		
		public function addComponent(value:UIComponent):void{
			this.put(ReferenceUtil.getClassName(value),value);
		}
	}
}