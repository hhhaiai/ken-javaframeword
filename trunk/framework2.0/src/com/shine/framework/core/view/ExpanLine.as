package com.shine.framework.core.view
{
	import flash.display.Sprite;
	
	import mx.controls.Alert;
	import mx.core.UIComponent;

	public class ExpanLine
	{
		public var weight:Number=2;
		public var color:uint=0xd9d6c3;
		public var line_x1:Number;
		public var line_x2:Number;
		public var line_y1:Number;
		public var line_y2:Number;
		
		private var lines:Sprite=new Sprite();
		private var comp:UIComponent;
		
		public function ExpanLine()
		{
		}
		
		public function initLine():void{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(line_x2, line_y2);
		}
		
		public function resetBeginLine(x1:int, y1:int):void
		{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(x1, y1);
			lines.graphics.lineTo(line_x2, line_y2);
			this.line_x1=x1;
			this.line_y1=y1;
		}
		
		public function resetEndLine(x2:int, y2:int):void
		{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(x2, y2);
			this.line_x2=x2;
			this.line_y2=y2;
		}
		
		public function refreshLine():void
		{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(line_x2, line_y2);
		}
		
		public function removeLine():void
		{
			lines.graphics.clear();
		}
		
		public function changeColor(value:uint):void{
			this.color=value;
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(line_x2, line_y2);
		}
		
		public function getLine():UIComponent
		{
			if(comp==null)
				comp=new UIComponent();
			comp.addChild(lines);
			return comp;
		}
	}
}