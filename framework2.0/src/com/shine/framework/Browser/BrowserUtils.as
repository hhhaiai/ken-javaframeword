package com.shine.framework.Browser
{
	import com.shine.framework.core.util.ArrayMap;
	
	import flash.net.URLRequest;
	import flash.net.navigateToURL;
	
	import mx.managers.BrowserManager;
	import mx.managers.IBrowserManager;
	import mx.utils.URLUtil;
	
	public class BrowserUtils
	{
		public function BrowserUtils()
		{
		}
		
		//设置浏览器标题
		public static function setBrowserTitle(value:String):void{
			BrowserManager.getInstance().setTitle(value);
		}
		
		//获取浏览器的全部url
		public static function getBrowserFullUrl():String{
			var bm:IBrowserManager = BrowserManager.getInstance();
			bm.init();
			return bm.url;
		}
		
		//获取浏览器的不带参数url
		public static function getBrowserBaseUrl():String{
			var bm:IBrowserManager = BrowserManager.getInstance();
			bm.init();
			return bm.base;
		}
		
		//获取当前浏览器url协议
		public static function getBrowserProtocol():String{
			var bm:IBrowserManager = BrowserManager.getInstance();
			bm.init();
			return URLUtil.getProtocol(bm.url);
		}
		
		//获取当前浏览器url端口
		public static function getBrowserPort():int{
			var bm:IBrowserManager = BrowserManager.getInstance();
			bm.init();
			return URLUtil.getPort(bm.url);
		}
		
		//获取当前浏览器url服务器名称
		public static function getBrowserServerName():String{
			var bm:IBrowserManager = BrowserManager.getInstance();
			bm.init();
			return URLUtil.getServerName(bm.url);
		}
		
		//修改当前url
		public static function updateBrowserUrl(value:ArrayMap):void{
			var bm:IBrowserManager = BrowserManager.getInstance();
			bm.init();
			var o:Object = URLUtil.stringToObject(bm.fragment);
			var num:int=value.getLength();
			for(var i:int=0;i<num;i++){
				o[value.getKeyByIndex(i)]=value.getValueByIndex(i);
			}
			bm.setFragment(URLUtil.objectToString(o));
		}
		
		//获取当前浏览器url服务器名称和端口
		public static function getBrowserServerWithPort():String{
			var bm:IBrowserManager = BrowserManager.getInstance();
			bm.init();
			return URLUtil.getServerNameWithPort(bm.url);
		}
		
		//刷新浏览器
		public static function refreshBrowser():void{
			navigateToURL(new URLRequest("javascript:location.reload();"),"_self");
		}
		
		//关闭浏览器
		public static function closeBrowser():void{
			navigateToURL(new URLRequest("javascript:window.close()"),"_self");
		}
	}
}