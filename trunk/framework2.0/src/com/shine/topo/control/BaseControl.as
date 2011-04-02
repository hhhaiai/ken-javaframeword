package com.shine.topo.control
{
	import com.shine.framework.core.util.ArrayMap;
	import com.shine.framework.core.util.ReferenceUtil;
	import com.shine.topo.view.topo.BaseTopoContainer;
	
	import mx.controls.Alert;
	
	public class BaseControl extends ArrayMap
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