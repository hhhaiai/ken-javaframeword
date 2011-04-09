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
		
		public static function saxXmlNodeByTag(value:XML,tag:Array):XMLArrayCollection{
			var xmlArrayCollection:XMLArrayCollection=new XMLArrayCollection();
			xmlArrayCollection.saxXmlNodeByTag(value,tag);
			return xmlArrayCollection;
		}
		
		public static function editXMLNodeValue(xml:XML,tag:String,attribute:Array,editAttribute:Array):XML{
			
			
			return xml;
		}
		
		
	}
}