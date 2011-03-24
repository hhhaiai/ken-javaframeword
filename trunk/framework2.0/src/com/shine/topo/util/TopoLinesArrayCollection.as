package com.shine.topo.util
{
	import com.shine.topo.view.Line.TopoLine;
	
	import mx.collections.ArrayCollection;
	
	public class TopoLinesArrayCollection extends ArrayCollection
	{
		public function TopoLinesArrayCollection(source:Array=null)
		{
			super(source);
		}
		
		public function getTopoLine(value:int):TopoLine{
			return this.getItemAt(value) as TopoLine;
		}
		
		public function addTopoLine(value:TopoLine):void{
			this.addItem(value);
		}
		
		public function removeTopoLine(value:TopoLine):void{
			var num:int=this.length;
			
			for(var i:int=0;i<num;i++){
				if(value.baseXmModel.xml==this.getTopoLine(i).baseXmModel.xml){
					this.removeItemAt(i);
				}
			}
		}
	}
}