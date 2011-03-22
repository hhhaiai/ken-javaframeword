package com.shine.framework.core.util
{

	public class DateUtil
	{
		public function DateUtil()
		{
		}

		/**
		 * 获取时间 example:Fri Jul 23 2010 04:50:37 PM
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getTime(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return date.toLocaleString();
		}

		/**
		 * 获取的日期
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getDate(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return String(date.getDate());
		}

		/**
		 * 获取是星期几
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getDay(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return String(date.getDay());
		}

		/**
		 * 获取月份
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getMonth(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return String(date.getMonth());
		}

		/**
		 * 获取年份
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getYear(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return String(date.getYear());
		}

		/**
		 * 获取完整格式数据 将给定的Date输出为YYYYMMDDHHMMSS格式
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getFullDataStringData(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return date.fullYear.toString() + (date.month + 1 < 10 ? "0" : "") + (date.month + 1) + (date.date < 10 ? "0" : "") + date.date + (date.hours < 10 ? "0" : "") + date.hours + (date.minutes < 10 ? "0" : "") + date.minutes + (date.seconds < 10 ? "0" : "") + date.seconds;
		}

		/**
		 * 获取完整格式数据 将给定的Date输出为YYYY-MM-DD HH:MM:SS格式
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getFullServerDataStringData(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return date.fullYear.toString() + "-" + (date.month + 1 < 10 ? "0" : "") + (date.month + 1) + "-" + (date.date < 10 ? "0" : "") + date.date + " " + (date.hours < 10 ? "0" : "") + date.hours + ":" + (date.minutes < 10 ? "0" : "") + date.minutes + ":" + (date.seconds < 10 ? "0" : "") + date.seconds;
		}

		/**
		 * 获取年月日格式数据 将给定的Date输出为YYYYMMDD格式
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getFullYMDStringData(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return date.fullYear.toString() + (date.month + 1 < 10 ? "0" : "") + (date.month + 1) + (date.date < 10 ? "0" : "") + date.date;
		}

		/**
		 * 获取年月日格式数据 将给定的Date输出为YYYY-MM-DD格式
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getFullServerYMDStringData(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return date.fullYear.toString() + "-" + (date.month + 1 < 10 ? "0" : "") + (date.month + 1) + "-" + (date.date < 10 ? "0" : "") + date.date;
		}

		/**
		 * 获取时分秒格式数据 将给定的Date输出为HHMMSS格式
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getFullHMSStringData(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return (date.hours < 10 ? "0" : "") + date.hours + (date.minutes < 10 ? "0" : "") + date.minutes + (date.seconds < 10 ? "0" : "") + date.seconds;
		}

		/**
		 * 获取时分秒格式数据 将给定的Date输出为HHMMSS格式
		 * 如果date=null即是获取现在的时间
		 * */
		public static function getFullServerHMSStringData(date:Date=null):String
		{
			if (date == null)
			{
				date=new Date();
			}
			return (date.hours < 10 ? "0" : "") + date.hours + ":" + (date.minutes < 10 ? "0" : "") + date.minutes + ":" + (date.seconds < 10 ? "0" : "") + date.seconds;
		}

        /**
        * 获取某个时间往前几一段时间或者往后一段时间
        * 如果date=null即是获取现在的时间
        * */
		public static function dateAdd(datepart:String="", number:Number=0, date:Date=null):Date
		{
			if (date == null)
			{
				date=new Date();
			}

			var returnDate:Date=new Date(date.time);

			switch (datepart.toLowerCase())
			{
				case "fullyear":
				case "month":
				case "date":
				case "hours":
				case "minutes":
				case "seconds":
				case "milliseconds":
					returnDate[datepart]+=number;
					break;
				default:
					/* Unknown date part, do nothing. */
					break;
			}
			return returnDate;
		}

	}
}