package com.shine.framework.core.view
{
	import flash.display.Sprite;
	
	import mx.controls.Alert;
	import mx.controls.Label;
	import mx.core.UIComponent;

	public class ExpanLine
	{
		public var weight:Number=1;
		public var color:uint=0x00CC33;
		public var line_x1:Number;
		public var line_x2:Number;
		public var line_y1:Number;
		public var line_y2:Number;
		
		private var lines:Sprite=new Sprite();
		private var comp:UIComponent;
		
		public var infoLabe:SunshineLabel;
		
		//是否要箭头  
		public var isArrow:Boolean=false;
		//箭头大小  
		public var radius:uint=6;
		
		public function ExpanLine()
		{
			
		}
		
		public function initLine():void{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(line_x2, line_y2);
			refreshArrow();
			refreshLabel();
		}
		
		public function initLabel(value:String):void{
			if(value!=null&&value.length!=0){
				infoLabe=new SunshineLabel;
				infoLabe.text=value;
			}
		}
		
		
		public function resetBeginLine(x1:int, y1:int):void
		{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(x1, y1);
			lines.graphics.lineTo(line_x2, line_y2);
			this.line_x1=x1;
			this.line_y1=y1;
			refreshArrow();
			refreshLabel();
		}
		
		public function resetEndLine(x2:int, y2:int):void
		{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(x2, y2);
			this.line_x2=x2;
			this.line_y2=y2;
			refreshArrow();
			refreshLabel()
		}
		
		public function refreshLine():void
		{
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(line_x2, line_y2);
			refreshArrow();
			refreshLabel()
		}
		
		public function removeLine():void
		{
			lines.graphics.clear();
			refreshArrow();
			refreshLabel()
		}
		
		public function refreshLabel():void{
			if(infoLabe!=null){
				infoLabe.x=getMiddleX()-infoLabe.width/2;
				infoLabe.y=getMiddleY()-infoLabe.height/2;
			}
		}
		
		public function changeColor(value:uint):void{
			this.color=value;
			lines.graphics.clear();
			lines.graphics.lineStyle(weight, color, 1);
			lines.graphics.moveTo(line_x1, line_y1);
			lines.graphics.lineTo(line_x2, line_y2);
			refreshArrow();
			refreshLabel();
		}
		
		public function getLine():UIComponent
		{
			if(comp==null)
				comp=new UIComponent();
			comp.addChild(lines);
			return comp;
		}
		
		//刷新箭头
		public function refreshArrow():void{
			if (isArrow)
			{
				var angle:Number=this.getAngle();
				var centerX:Number=(line_x1 + line_x2) / 2 - radius * Math.cos(angle * (Math.PI / 180));
				var centerY:Number=(line_y1 + line_y2) / 2 + radius * Math.sin(angle * (Math.PI / 180));
				var topX:Number=(line_x1 + line_x2) / 2;
				var topY:Number=(line_y1 + line_y2) / 2 ;
				var leftX:Number=centerX + radius * Math.cos((angle + 120) * (Math.PI / 180));
				var leftY:Number=centerY - radius * Math.sin((angle + 120) * (Math.PI / 180));
				var rightX:Number=centerX + radius * Math.cos((angle + 240) * (Math.PI / 180));
				var rightY:Number=centerY - radius * Math.sin((angle + 240) * (Math.PI / 180));
				lines.graphics.beginFill(uint(color), 1);
				lines.graphics.lineStyle(2, uint(color), 1);
				lines.graphics.moveTo(topX, topY);
				lines.graphics.lineTo(leftX, leftY);
				lines.graphics.lineTo(centerX, centerY);
				lines.graphics.lineTo(rightX, rightY);
				lines.graphics.lineTo(topX, topY);
				lines.graphics.endFill();
			}
		}
		
		public function getMiddleX():Number{
			return (line_x1 + line_x2) / 2;
		}
		
		public function getMiddleY():Number{
			return (line_y1 + line_y2) / 2
		}
		
		
		//获得线的角度  
		public function getAngle():Number
		{
			var tmpx:Number=line_x2 - line_x1;
			var tmpy:Number=line_y1 - line_y2;
			var angle:Number=Math.atan2(tmpy, tmpx) * (180 / Math.PI);
			return angle;
		}
	}
}