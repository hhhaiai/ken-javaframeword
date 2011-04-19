package com.shine.framework.core.util
{
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.model.XmlModel;
	
	import mx.collections.ArrayCollection;
	
	public class XmlModelArrayCollection extends ArrayCollection
	{
		public function XmlModelArrayCollection(source:Array=null)
		{
			super(source);
		}
		
		public function addXmlModel(value:XmlModel):void{
			this.addItem(value);
		}
		
		public function getXmlModel(value:int):XmlModel{
			return this.getItemAt(value) as XmlModel;
		}
		
		public function deleteXmlModel(value:BaseXmlModel):void{
			deleteXml(value.xml);
		}
		
		public function deleteXml(value:String):void{
			var num:int=this.length;
			for(var i:int=num;i>0;i--){
				if(value==this.getXmlModel(i).xml){
					this.removeItemAt(i);
				}
			}
		}
	}
}