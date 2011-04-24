package com.shine.framework.Swf
{
	import flash.display.Loader;
	import flash.events.Event;
	import flash.net.URLRequest;
	
	import mx.controls.Alert;
	import mx.core.UIComponent;
	
	public class SwfManager extends UIComponent
	{
		//swc的路径
		public var swfUrl:String="";
		//加载完成的方法
		public var method:Function;
		
		public function SwfManager(value:String=null,completeMethod:Function=null)
		{
			super();
			
			if(value!=null){
				this.swfUrl=value;
			}
			
			if(completeMethod!=null){
				this.method=completeMethod;
			}
		}
		
		//加载swf
		public function loadSwf(value:String=null,completeMethod:Function=null):void{
			if(value!=null){
				this.swfUrl=value;
			}
			
			if(completeMethod!=null){
				this.method=completeMethod;
			}
			
			if(this.swfUrl!=null){
				var loader:Loader = new Loader();  
				loader.contentLoaderInfo.addEventListener(Event.COMPLETE ,swfLoaded);  
				loader.load(new URLRequest(this.swfUrl));
			}else{
				Alert.show("不可以加载空的swc地址");
			}
		}
		
		//加载swc完成
		private function swfLoaded(e:Event):void
		{
			if(method!=null)
				method.call(this);
		}
	}
}