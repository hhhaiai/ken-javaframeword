package com.shine.framework.EventControl
{
	import com.shine.framework.EventControl.model.BaseEvent;
	import com.shine.framework.EventControl.utils.ComponentMap;
	
	import flash.events.Event;
	
	import mx.core.UIComponent;

	public class EventControl
	{
		public var componentMap:ComponentMap=new ComponentMap;
		
		private static var _instance:EventControl;
		public function EventControl(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():EventControl{
			if (EventControl._instance == null)
			{
				EventControl._instance=new EventControl(new SingletonEnforcer());
			}
			return EventControl._instance;
		}
		
		public function dispatchEvent(event:BaseEvent,... components):void{
			if(components.length!=0){
				for each(var component:UIComponent in components){
					component.dispatchEvent(event);
				}
			}else{
				for each(var component:UIComponent in componentMap){
					component.dispatchEvent(event);
				}
			}
		}
		
		public function addComponent(value:UIComponent):void{
			componentMap.addComponent(value);
		}
	}
}
class SingletonEnforcer
{
}