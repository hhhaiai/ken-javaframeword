package com.shine.framework.core.util
{
	import flash.external.ExternalInterface;
	import flash.net.URLRequest;
	import flash.net.navigateToURL;
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;
	import mx.core.IUITextField;
	import mx.core.UIComponent;
	
	
	use namespace mx.core.mx_internal;

	public class EventUtil
	{
		public var htmlUIComponent:UIComponent;
		public var xmlUIComponent:UIComponent;
		
		public function EventUtil()
		{
		}
		
		//调用事件
		public static function event(url:String,type:String,value:String=null,method:Function=null):void{
			if (type == "newPage")
			{
				var u:URLRequest=new URLRequest(url);
				navigateToURL(u, "_blank");
			}
			else if (type == "html")
			{
				var baseHttpService:BaseHttpServiceUtil=new BaseHttpServiceUtil;
				baseHttpService.getResultXml(url, showHtmlCanvas);
			}
			else if (type == "xml")
			{
				var baseHttpService:BaseHttpServiceUtil=new BaseHttpServiceUtil;
				baseHttpService.getResultXml(url, showXmlCanvas);
			}
			else if (type == "text")
			{
				var baseHttpService:BaseHttpServiceUtil=new BaseHttpServiceUtil;
				baseHttpService.getResultXml(url, showTextCanvas);
			}
			else
			{
				var re:RegExp=/:/;
				var a:Array=type.split(re);
				if(value!=null)
				    ExternalInterface.call(a[1], url);
				else
					ExternalInterface.call(a[1], url,value);
			}
		}
		
		//保存xml
		private static function showXmlCanvas(value:XML):void{
			alert(value.toXMLString());
		}
		
		private static function showHtmlCanvas(value:String):void{
			alert(value,"提示","html");
		}
		
		private static function showTextCanvas(value:String):void{
			alert(value);
		}
		
		
		//resize alert
		public static function alert(content:String,title:String="提示",typt:String="text",width:int=0,height:int=0):void{
			var alertElement:Alert=Alert.show(content,title);
			
			if(typt=="html"){
				IUITextField(alertElement.alertForm.textField).htmlText = content;
			}
			
            if(width!=0){
				alertElement.width=width;
			}
			if(height!=0){
				alertElement.height=height;
			}
		}
	}
}