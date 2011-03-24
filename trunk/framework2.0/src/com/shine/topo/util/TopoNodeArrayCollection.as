package com.shine.topo.util
{
	import com.shine.topo.view.node.BaseNodeContainer;
	
	import mx.collections.ArrayCollection;
	import mx.controls.Alert;
	
	public class TopoNodeArrayCollection extends ArrayCollection
	{
		public function TopoNodeArrayCollection(source:Array=null)
		{
			super(source);
		}
		
		public function getNode(value:int):BaseNodeContainer{
			return this.getItemAt(value) as BaseNodeContainer;
		}
		
		public function getNodeByAttribute(key:String,value:String):BaseNodeContainer{
			for each(var baseNodeContainer:BaseNodeContainer in this){
				if(baseNodeContainer.baseXmlModel.getString(key)==value){
					return baseNodeContainer;
				}
			}
			return null;
		}
	}
}