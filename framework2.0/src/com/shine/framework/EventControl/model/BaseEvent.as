package com.shine.framework.EventControl.model
{
	import com.shine.framework.core.util.ArrayMap;
	
	import flash.events.Event;
	
	public class BaseEvent extends Event
	{
		public var map:ArrayMap=new ArrayMap;
		
		public function BaseEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
		}
		
		public function put(key:Object,value:Object):void{
			map.put(key,value);
		}
		

		public function get(key:Object):Object{
			return map.get(key);
		}
	}
}