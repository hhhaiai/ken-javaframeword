package com.shine.framework.core.util
{
	import com.shine.framework.core.model.BaseXmlModel;
	
	import mx.collections.ArrayCollection;
	import mx.controls.Alert;

	public class XMLArrayCollection extends ArrayCollection
	{
		public function XMLArrayCollection()
		{
		}
		
		/**
		 * 获取所有节点
		 * */
		public function saxXmlNode(value:XML):void{
			var baseXMLModel:BaseXmlModel=new BaseXmlModel;
			baseXMLModel.initBaseXmlValue(value.toXMLString());
			this.addItem(baseXMLModel);	
			baseXMLModel=null;
			
			if(value.children().length()!=0){
				for each(var xml:XML in value.children()){
					saxXmlNode(xml);
				}
			}
		}
		
		/**
		 * 获取所有指定名称的节点
		 * */
		public function saxXmlNodeByTag(value:XML,tag:Array):void{
			if(tag.indexOf(value.name().toString())!=-1){
				var baseXMLModel:BaseXmlModel=new BaseXmlModel;
				baseXMLModel.initXmlValue(value.toXMLString());
				this.addItem(baseXMLModel);
			}

			if(value.children().length()!=0){
				for each(var xml:XML in value.children()){
					saxXmlNodeByTag(xml,tag);
				}
			}
		}
		
		/**
		 * 获取指定的model
		 **/
		public function getBaseXMLModel(value:int):BaseXmlModel{
			return this.getItemAt(value) as BaseXmlModel;
		}
		
	}
}