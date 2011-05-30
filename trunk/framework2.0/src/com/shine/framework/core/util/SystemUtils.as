package com.shine.framework.core.util
{
	import flash.system.Capabilities;
	import flash.system.System;
	
	public class SystemUtils
	{
		public function SystemUtils()
		{
		}
		
		public static function getScreenWidth():Number{
			return Capabilities.screenResolutionX;
		}
		
		public static function getScreenHeight():Number{
			return Capabilities.screenResolutionY;
		}
		
		public static function getOs():String{
			return Capabilities.os;
		}
		
		//"PowerPC", "x86", "SPARC", and "ARM".
		public static function getCpuArchitecture():String{
			return Capabilities.cpuArchitecture;
		}
		
		//获取浏览器类型
		public static function getBrowser():String{
			var play:String=Capabilities.playerType;
			if(play=="ActiveX"){
				return "IE";
			}else if(play=="PlugIn"){
				return "Firefox";
			}else{
				return play+"--othors";
			}
		}
		
		public static function getTotleMemory():Number{
			return System.totalMemory;
		}
		
	}
}