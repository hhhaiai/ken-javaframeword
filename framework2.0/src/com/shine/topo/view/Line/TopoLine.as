package com.shine.topo.view.Line
{
	import com.shine.framework.core.model.BaseXmlModel;
	import com.shine.framework.core.view.ExpanLine;
	import com.shine.topo.view.label.LineLabel;
	import com.shine.topo.view.node.BaseNodeContainer;
	
	import mx.controls.Alert;
	
	public class TopoLine extends ExpanLine
	{
		public var baseXmModel:BaseXmlModel;
		public var lineLabel:LineLabel;
		public function TopoLine()
		{
			super();
		}
		
		public function initTopoLine(value:BaseXmlModel,startNode:BaseNodeContainer,endNode:BaseNodeContainer):void{
			this.baseXmModel=value;
			if(startNode==null||endNode==null){
				return;
			}
			
//			if(value.getString("info")!=null){
//				lineLabel=new LineLabel;
//				
//			}

			startNode.addFromLine(this);
			endNode.addToLine(this);
			
			
			value=null;
		}
	}
}