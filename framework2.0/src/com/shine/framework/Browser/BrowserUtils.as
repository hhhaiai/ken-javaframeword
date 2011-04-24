package com.shine.framework.Browser
{
	import flash.net.URLRequest;
	import flash.net.navigateToURL;
	
	import mx.managers.BrowserManager;
	
	public class BrowserUtils
	{
		public function BrowserUtils()
		{
		}
		
		//设置浏览器标题
		public function setBrowserTitle(value:String):void{
			BrowserManager.getInstance().setTitle(value);
		}
		
		//获取浏览器的url
		public function getBrowserUrl():String{
			return BrowserManager.getInstance().url;
		}
		
		
		//刷新浏览器
		public function refreshBrowser():void{
			navigateToURL(new URLRequest("javascript:location.reload();"),"_self");
		}
		
		//关闭浏览器
		public function closeBrowser():void{
			navigateToURL(new URLRequest("javascript:window.close()"),"_self");
		}
	}
}