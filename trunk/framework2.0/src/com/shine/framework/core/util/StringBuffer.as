package com.shine.framework.core.util
{

	public class StringBuffer
	{
		private var content:String="";

		public function StringBuffer(value:String="")
		{
			this.content=value;
		}

		/**
		 * 在字符串最后补充数据
		 * @param value
		 * @return
		 * */
		public function append(value:Object=null):StringBuffer
		{
			if (value != null)
			{
				content=content + String(value);
			}
			return this;
		}

		/**
		 * 在字符串插入数据，如果字符串长度小于插入位置，在字符串最后补充数据
		 * @param offset
		 * @param value
		 * @return
		 * */
		public function insert(offset:int, value:Object):StringBuffer
		{
			if (content.length < offset)
				content=content + String(value);
			else
			{
				content=content.substring(0, offset) + String(value) + content.substring(offset, content.length);
			}
			return this;
		}

		/**
		 * 删除字符区间数据
		 * @param start
		 * @param end
		 * @return
		 * */
		public function deleteStringBuffer(start:int, end:int):StringBuffer
		{
			if (content.length > start)
			{
				if (content.length > end)
				{
					content=content.substring(0, start) + content.substring(end, content.length);
				}
				else
				{
					content=content.substring(0, start);
				}
			}
			return this;
		}
        
        /**
		 * 替换字符区间数据
		 * @param start
		 * @param end
		 * @param value
		 * @return
		 * */
		public function replace(start:int, end:int, value:Object):StringBuffer
		{
			deleteStringBuffer(start, end);
			insert(start, String(value));
			return this;
		}

		/**
		 * 检查是否有该字符串
		 * @param value
		 * @param fromIndex
		 * */
		public function indexOf(value:String, fromIndex:int=0):int
		{
			return content.indexOf(value, fromIndex);
		}

		/**
		 * 清空StringBuffer
		 * */
		public function clean():void
		{
			content="";
		}

		/**
		 * 获取StringBuffer长度 
		 * */
		public function length():int
		{
			return content.length;
		}

		public function toString():String
		{
			return content;
		}

	}
}