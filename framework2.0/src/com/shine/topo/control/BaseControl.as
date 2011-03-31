package com.shine.topo.control
{
	import com.shine.framework.core.util.ArrayMap;
	import com.shine.topo.view.topo.BaseTopoContainer;
	
	public class BaseControl extends ArrayMap
	{
		public function BaseControl()
		{
			super();
		}
		
		public function add(value:Object):void{
			
		}
		
		public function addTopoContainer(name:String,value:BaseTopoContainer):void{
			this.put(name,value);
		}
		
		public function getTopoContainer(name:String):BaseTopoContainer{
			return this.get(name) as BaseTopoContainer;
		}
	}
}