package com.shine.framework.core.util
{
	import mx.collections.ArrayCollection;

	public class XMLUtils
	{
		public function XMLUtils()
		{
		}
		
		public static function saxXmlNode(value:XML):XMLArrayCollection{
			var xmlArrayCollection:XMLArrayCollection=new XMLArrayCollection();
			xmlArrayCollection.saxXmlNode(value);
			return xmlArrayCollection;
		}
		
		//获取所有tag节点
		public static function saxXmlNodeByTag(value:XML,tag:Array):XMLArrayCollection{
			var xmlArrayCollection:XMLArrayCollection=new XMLArrayCollection();
			xmlArrayCollection.saxXmlNodeByTag(value,tag);
			return xmlArrayCollection;
		}		
	}
}