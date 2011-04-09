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
		
		/**
		 * 初始xml model的值，把xml节点中所有属性和值存入model
		 * 
		 * value=<node key1="value1" key2="value2" key3="value3" />
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
		
		//获取xml的数据结构 <node key1="value1" key2="value2" key3="value3" />
		public function getXmlValue():String{
			var xmlData:StringBuffer=new StringBuffer;
			xmlData.append("<node ");
			var length:int=this.getLength();
			for(var i:int=0;i<length;i++){
				xmlData.append(this.getKeyByIndex(i)+"='"+this.getValueByIndex(i)+"' ");
			}
			xmlData.append("/>");
			return xmlData.toString();
		}
		
		//获取xml的数据结构 <name key1="value1" key2="value2" key3="value3" />
		public function getOriginalXmlValue():String{
			var xmlData:StringBuffer=new StringBuffer;
			xmlData.append("<"+String(XML(this.xml).name())+" ");
			var length:int=this.getLength();
			for(var i:int=0;i<length;i++){
				xmlData.append(this.getKeyByIndex(i)+"='"+this.getValueByIndex(i)+"' ");
			}
			xmlData.append("/>");
			return xmlData.toString();
		}
		
		
		/**
		 * 初始xml model的值，把子节点中的名称做key，值做value
		 * 
		 * value=<node><key1>value1</key1><key2>value2</key2><key3>value3</key3></node>
		 * */
		public function initBaseXmlValue(value:String):void{
			xml=value;
			this.removeAll();
			var xmlData:XML=XML(value);
			for each(var nodeXml:XML in xmlData.children()){
				this.put(nodeXml.name().toString(),nodeXml.toString());
			}
		}
		
		//获取xml的数据结构 <node><key1>value1</key1><key2>value2</key2><key3>value3</key3></node>
		public function getBaseXmlValue():String{
			var xml:XML=XML("<node />");
			var length:int=this.getLength();
			for(var i:int=0;i<length;i++){
				var keyXml:XML=XML("<"+this.getKeyByIndex(i)+">"+this.getValueByIndex(i)+"</"+this.getKeyByIndex(i)+">");
				xml.appendChild(keyXml);
			}
			return xml.toXMLString();
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
		
		//由key获取num value
		public function getNumber(key:String):int{
			return Number(this.get(key));
		}
	}
}