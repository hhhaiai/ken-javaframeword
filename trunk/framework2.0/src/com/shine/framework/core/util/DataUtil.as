package com.shine.framework.core.util
{

	public class DataUtil
	{
		public function DataUtil()
		{
		}

		/**
		 * 检查是否是空数据
		 * @param value:String 检查数据
		 * */
		public static function isNull(value:String):Boolean
		{
			if (value == null || value.length == 0)
				return true;
			return false;
		}

		/**
		 * StringReplaceAll
		 * @param source:String 源数据
		 * @param find:String 替换对象
		 * @param replacement:Sring 替换内容
		 * @return String
		 * **/
		public static function StringReplaceAll(source:String, find:String, replacement:String):String
		{
			return source.split(find).join(replacement);
		}


		/**
		 * 随机数范围
		 * @param min 源数据
		 * @param max 源数据
		 * @return int
		 * */
		private static function randRange(min:Number, max:Number):Number
		{
			var randomNum:Number=Math.floor(Math.random() * (max - min + 1)) + min;
			return randomNum;
		}
		
		/**
		 * 是否是错误数据
		 * @param strValue 源数据
		 * @return Boolean
		 * */
		public static  function isIllString(strValue:String):Boolean
		{
			for(var i:int=1;i<strValue.length+1;i++)
			{
				var str:String=strValue.substring(i-1,i)
				
				if(str=="`"||str=="~"||str=="!"||str=="@"||str=="#"||str=="$"||str=="%"||str=="^"||str=="&"||str=="*"||str=="("||str==")"||str=="?"||str=="["||str=="]"||str==","||str==".")
				{
					return true;
				}
			}
			return false;
		}
		
		/**
		 * url转义
		 * @param value url
		 * @return url
		 * */
		public function urlEnCode(value:String):String{
			return escape(value);
		}
		
		/**
		 * url反转义
		 * @param value url
		 * @return url
		 * */
		public function unUrlEnCode(value:String):String{
			return unescape(value);
		}
		
		/**
		 * 判断用户是否输入数字
		 * @param value url
		 * @return boolean
		 * */
		public static  function isNumber(value:String):Boolean
		{
			if(String(Number(value))=="NaN"){
				return false;
			}
			return true;
		}
		
		//计算2点距离
		public static function getDistance(x1:Number,x2:Number,y1:Number,y2:Number):Number{
			return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));;
		}
		
		//圆周运动  x:圆心x y:圆心y r:半径  angle:弧度
		public static function getRoundPoint(x:Number,y:Number,r:Number,angle:Number):Object{
			var o:Object=new Object;
			o.x = x + (Math.cos(angle) * r);
			o.y = y + (Math.sin(angle) * r);
			return o;
		}
	}
}