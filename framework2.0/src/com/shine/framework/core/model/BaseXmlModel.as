package com.shine.framework.core.model
{
	import com.shine.framework.core.util.ArrayMap;
	import com.shine.framework.core.util.StringBuffer;
	
	import mx.controls.Alert;
	
	/**
	 * Base xml model
	 * 
	 * @author viruscodecn@gmail.com
	 * @project FlexFramework 2.0 2011-01-13
	 */
	public class BaseXmlModel extends ArrayMap
	{
		public var xml:String="";
		public function BaseXmlModel()
		{
			super();
		}
		
		//获取xml的数据结构 <node key1="value1" key2="value2" key3="value3" />
		public function getBaseXmlValue():String{
			var xmlData:StringBuffer=new StringBuffer;
			xmlData.append("<node ");
			var length:int=this.getLength();
			for(var i:int=0;i<length;i++){
				xmlData.append(this.getKeyByIndex(i)+"='"+this.getValueByIndex(i)+"' ");
			}
			xmlData.append("/>");
			return xmlData.toString();
		}
		
		//获取xml的数据结构 <node><key1>value1</key1><key2>value2</key2><key3>value3</key3></node>
		public function getXmlValue():String{
			var xml:XML=XML("<node />");
			var length:int=this.getLength();
			for(var i:int=0;i<length;i++){
				var keyXml:XML=XML("<"+this.getKeyByIndex(i)+">"+this.getValueByIndex(i)+"</"+this.getKeyByIndex(i)+">");
				xml.appendChild(keyXml);
			}
			return xml.toXMLString();
		}
		
		/**
		 * 初始xml model的值
		 * */
		public function initXmlValue(value:String):void{
			xml=value;
			this.removeAll();
			var xmlData:XML=XML(value);
			var length:int=xmlData.attributes().length();
			for(var i:int=0;i<length;i++){
				var xmlValue:XML=XML(xmlData.attributes()[i]);
				this.put(xmlValue.name().toString(),xmlValue.toString());
			}
		}
		
		//由key获取String value
		public function getString(key:String):String{
			if(this.get(key)==null)
				return null;
			return String(this.get(key));
		}
		
		//由key获取int value
		public function getInt(key:String):int{
			return int(this.get(key));
		}
	}
}