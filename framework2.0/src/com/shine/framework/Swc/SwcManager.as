package com.shine.framework.Swc
{
	import flash.display.Loader;
	import flash.events.Event;
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import flash.system.ApplicationDomain;
	import flash.system.LoaderContext;
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;
	import mx.core.UIComponent;
	
	import nochump.util.zip.ZipEntry;
	import nochump.util.zip.ZipFile;
	
	public class SwcManager extends UIComponent
	{
		//swc的路径
		public var swcUrl:String="";
		//library swf路径
		public var libraryUrl:String="";
		//加载完成的方法
		public var method:Function;
		
		
		public function SwcManager(value:String=null,completeMethod:Function=null)
		{
			super();
			if(value!=null){
				this.swcUrl=value;
			}
			
			if(completeMethod!=null){
				this.method=completeMethod;
			}
			this.visible=false;
		}
		
		//加载swc
		public function loadSwc(value:String=null,completeMethod:Function=null):void{
			if(value!=null){
				this.swcUrl=value;
			}
			
			if(completeMethod!=null){
				this.method=completeMethod;
			}
			
			if(this.swcUrl!=null){
				var loader:URLLoader = new URLLoader();
				loader.addEventListener(Event.COMPLETE,swcLoaded);
				loader.dataFormat = URLLoaderDataFormat.BINARY;
				loader.load(new URLRequest(swcUrl));
			}else{
				Alert.show("不可以加载空的swc地址");
			}
		}
		
		
		//加载swc完成
		private function swcLoaded(e:Event):void
		{
			var byte:ByteArray = e.target.data;
			byte = swc2swf(byte);
			
			var loader:Loader = new Loader();
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE,libReady);
			loader.loadBytes(byte,new LoaderContext(false,ApplicationDomain.currentDomain));
		}
		
		
		//加载library 完成 
		private function libReady(e:Event):void
		{
			if(method!=null)
				method.call(this);
		}
		
		//解压
		public function swc2swf(byte:ByteArray):ByteArray
		{
			var zipFile:ZipFile = new ZipFile(byte);
			var zipEntry:ZipEntry = null;
			if(libraryUrl!=null)
				zipEntry = zipFile.getEntry(libraryUrl);
			else
				zipEntry = zipFile.getEntry("library.swf");
			return zipFile.getInput(zipEntry)
		}
		
	}
}