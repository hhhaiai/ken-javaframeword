package com.shine.topo.util
{
	import com.shine.topo.view.Line.TopoLine;
	
	import mx.collections.ArrayCollection;
	import mx.controls.Alert;
	
	public class TopoLinesArrayCollection extends ArrayCollection
	{
		public function TopoLinesArrayCollection(source:Array=null)
		{
			super(source);
		}
		
		//获取line
		public function getTopoLine(value:int):TopoLine{
			return this.getItemAt(value) as TopoLine;
		}
		
		//获取line
		public function getTopoLineByXml(value:String):TopoLine{
			var num:int=this.length;
			
			for(var i:int=0;i<num;i++){
				if(value==this.getTopoLine(i).baseXmModel.xml){
					return this.getTopoLine(i);
				}
			}
			return null;
		}
		
		//加入topo line
		public function addTopoLine(value:TopoLine):void{
			this.addItem(value);
		}
		
		//删除topo line
		public function removeTopoLine(value:TopoLine):void{
			var num:int=this.length;
			
			for(var i:int=0;i<num;i++){
				if(value.baseXmModel.xml==this.getTopoLine(i).baseXmModel.xml){
					this.removeItemAt(i);
				}
			}
		}
		
		//删除topo line
		public function removeTopoLineByXml(value:String):void{
			var num:int=this.length;
			
			for(var i:int=0;i<num;i++){
				if(value==this.getTopoLine(i).baseXmModel.xml){
					this.removeItemAt(i);
					break;
				}
			}
		}
		
		//检查是否存在该line
		public function checkTopoLine(value:TopoLine):Boolean{
			var num:int=this.length;
			
			for(var i:int=0;i<num;i++){
				if(value.baseXmModel.xml==this.getTopoLine(i).baseXmModel.xml){
					return true;
				}
			}
			return false;
		}
		
		//检查是否存在该xml
		public function checkTopoLineByXml(value:String):Boolean{
			var num:int=this.length;
			for(var i:int=0;i<num;i++){
				if(value==this.getTopoLine(i).baseXmModel.xml){
					return true;
				}
			}
			return false;
		}
	}
}