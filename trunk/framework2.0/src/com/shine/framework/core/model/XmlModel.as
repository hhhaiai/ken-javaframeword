package com.shine.framework.core.model
{
	import com.hurlant.crypto.cert.X509Certificate;
	import com.shine.framework.core.util.XmlModelArrayCollection;
	
	import mx.controls.Alert;

	public class XmlModel extends BaseXmlModel
	{
		private var xmlModelArray:XmlModelArrayCollection=new XmlModelArrayCollection;
		public function XmlModel()
		{
			super();
		}
		
		public function initModel(value:String):void{
			this.xml=value;
			
			this.initXmlValue(value);
			
			xmlModelArray.removeAll();
			for each(var xml:XML in XML(value).children()){
				var xmlModel:XmlModel=new XmlModel;
				xmlModel.initModel(xml.toXMLString());
				xmlModelArray.addXmlModel(xmlModel);
			}
		}
		
		//修改属性
		public function editXml(tag:String,attributes:Array,values:Array,editAttributes:Array,editValue:Array):void{
			if(String(XML(this.xml).name())==tag){
				if(editAttributes.length==editValue.length&&attributes.length==values.length){
					var b:Boolean=true;
					
					var num:int=attributes.length;
					for(var i:int=0;i<num;i++){
						if(this.getString(attributes[i])!=values[i])
							b=false;
					}
					
					if(b){
						edit(editAttributes,editValue);
					}
				}
			}
			
			for each(var xmlModel:XmlModel in xmlModelArray){
				xmlModel.editXml(tag,attributes,values,editAttributes,editValue);
			}
		}
		
		//修改属性
		public function edit(editAttributes:Array,editValue:Array):void{
			if(editAttributes.length==editValue.length){
				var num:int=editAttributes.length;
				for(var i:int=0;i<num;i++){
					this.put(editAttributes[i],editValue[i]);
				}
			}
		}
		
		//获取修改后的xml
		public function getXml():XML{
			var dataXml:XML=XML(this.getOriginalXmlValue());
			
			for each(var xmlModel:XmlModel in xmlModelArray){
				dataXml.appendChild(xmlModel.getXml());
			}
			
			return dataXml;
		}
	}
}