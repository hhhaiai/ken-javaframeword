package com.shine.framework.core.model
{
	import com.hurlant.crypto.cert.X509Certificate;
	import com.shine.framework.core.util.XMLArrayCollection;
	import com.shine.framework.core.util.XMLUtils;
	import com.shine.framework.core.util.XmlModelArrayCollection;
	
	import mx.controls.Alert;

	public class XmlModel extends BaseXmlModel
	{
		private var xmlModelArray:XmlModelArrayCollection=new XmlModelArrayCollection;
		public function XmlModel(value:String=null)
		{
			super();
			initModel(value);
		}
		
		//初始化数据
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
		
		//加入子节点
		public function addChildNode(tag:String,childXml:XML,attributes:Array=null,values:Array=null):void{
			for each(var xmlModel:XmlModel in xmlModelArray){
				xmlModel.addChildNode(tag,childXml,attributes,values);
			}

			if(tagCheck(tag,attributes,values)){
				var xmlModel:XmlModel=new XmlModel;
				xmlModel.initModel(childXml.toXMLString());
				xmlModelArray.addXmlModel(xmlModel);
			}		
		}
		
		//修改属性
		public function editXml(tag:String,attributes:Array,values:Array,editAttributes:Array,editValue:Array):void{
			if(tagCheck(tag,attributes,values)){
				edit(editAttributes,editValue);
			}
			
			for each(var xmlModel:XmlModel in xmlModelArray){
				xmlModel.editXml(tag,attributes,values,editAttributes,editValue);
			}
		}
		
		//删除某个子节点
		public function deleteXmlByIndex(value:int):void{
			if(value<xmlModelArray.length)
				xmlModelArray.removeItemAt(value);
		}
		
		//删除某个xml
		public function deleteXmlByTag(tag:String,attributes:Array=null,values:Array=null):void{
			var num:int=xmlModelArray.length;
			for(var i:int=0;i<num;i++){
				if(xmlModelArray.getXmlModel(i).tagCheck(tag,attributes,values)){
					xmlModelArray.removeItemAt(i);
//				}else{
//					xmlModelArray.getXmlModel(i).deleteXmlByTag(tag,attributes,values);
				}
			}
		}
		
		//删除某个xml
		public function deleteXml(xml:String):void{
			var num:int=xmlModelArray.length;
			for(var i:int=0;i<num;i++){
				if(xml==xmlModelArray.getXmlModel(i).xml){
					xmlModelArray.removeItemAt(i);
//				}else{
//					xmlModelArray.getXmlModel(i).deleteXml(xml);
				}
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
		
		
		//检查是否存在节点
		public function checkTag(tag:Array):Boolean{
			var xmlModelArray:XMLArrayCollection=XMLUtils.saxXmlNodeByTag(XML(this.xml),tag);
			if(xmlModelArray.length!=0){
				return true
			}
			return false;
		}
		
		//检查该节点是否符合属性
		public function tagCheck(tag:String,attributes:Array,values:Array):Boolean{
			if(String(XML(this.xml).name())==tag){
				if(attributes!=null&&values!=null){
					if(attributes.length==values.length){
						var num:int=attributes.length;
						for(var i:int=0;i<num;i++){
							if(this.getString(attributes[i])!=values[i])
								return false;
						}
						return true;
					}
				}else{
					return true;
				}
			}
			return false;
		}
		
		//获取子节点
		public function getChileNode(value:int):BaseXmlModel{
			if(value<xmlModelArray.length){
				return xmlModelArray.getItemAt(value) as BaseXmlModel;
			}
			return null;
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