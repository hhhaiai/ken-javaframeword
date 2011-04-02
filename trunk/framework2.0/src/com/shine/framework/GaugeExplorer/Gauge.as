package com.shine.framework.GaugeExplorer
{
	import flash.display.Bitmap;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.text.*;
	import flash.utils.Timer;
	
	import mx.controls.Alert;
	import mx.controls.Image;
	import mx.core.UIComponent;
	import mx.core.UITextField;
	import mx.styles.CSSStyleDeclaration;
	import mx.styles.StyleManager;
	import mx.core.IFlexDisplayObject;
	import flash.display.DisplayObject;
	import flash.filters.DropShadowFilter;
	import flash.display.StageQuality;
	import flash.filters.BevelFilter;
	import flash.events.MouseEvent;
	import flash.ui.Mouse;
	
	[Style(name="backgroundAlpha", type="Number", inherit="no")]
	
	[Style(name="backgroundColor", type="uint", format="Color", inherit="no")]
	
	[Style(name="borderColor", type="uint", format="Color", inherit="no")]
	
	[Style(name="borderStyle", type="String", enumeration="solid,none", inherit="no")]
	
	[Style(name="borderThickness", type="Number", format="Length", inherit="no")]
	
	[Style(name="dropShadowEnabled", type="Boolean", inherit="no")]
	
	[Style(name="dropShadowColor", type="uint", format="Color", inherit="yes")]
	
	[Style(name="shadowDirection", type="String", enumeration="left,center,right", inherit="no")]
	
	[Style(name="shadowDistance", type="Number", format="Length", inherit="no")]
	
	[Style(name="tickColor", type="uint", format="Color", inherit="no")]
	
	[Style(name="minorTickLength", type="Number", format="Length", inherit="no")]
	
	[Style(name="minorTickThickness", type="Number", format="Length", inherit="no")]
	
	[Style(name="majorTickLength", type="Number", format="Length", inherit="no")]
	
	[Style(name="majorTickThickness", type="Number", format="Length", inherit="no")]
	
	[Style(name="tickInset", type="Number", format="Length", inherit="no")]
	
	[Style(name="icon", type="Class", inherit="no")]
	
	[Style(name="scalePosition", type="String", enumeration="inside,outside", inherit="yes")]
	
	[Style(name="scaleFontColor", type="uint", format="Color", inherit="no")]
	
	[Style(name="scaleFontFamily", type="String", inherit="yes")]
	
	[Style(name="scaleFontSize", type="Number", format="Length", inherit="yes")]
	
	[Style(name="scaleFontStyle", type="String", enumeration="normal,italic", inherit="yes")]
	
	[Style(name="scaleFontWeight", type="String", enumeration="normal,bold", inherit="yes")]
	
	[Style(name="labelFontColor", type="uint", format="Color", inherit="no")]
	
	[Style(name="labelFontFamily", type="String", inherit="yes")]
	
	[Style(name="labelFontSize", type="Number", format="Length", inherit="yes")]
	
	[Style(name="labelFontStyle", type="String", enumeration="normal,italic", inherit="yes")]
	
	[Style(name="labelFontWeight", type="String", enumeration="normal,bold", inherit="yes")]
	
	
	public class Gauge extends UIComponent
	{
		private var _minimum:Number = 0;
		private var _maximum:Number = 10;
		private var _value:Number = 5;
		
		private var _angleFrom:Number = -2.5;
		private var _angleTo:Number = Math.PI/2;
		private var _backgroundCutAway:Boolean = false;
		
		private var _radius:Number = 100;
		private var _centerx:Number = 100;
		private var _centery:Number = 100;
		
		private var _label:TextField;
		
		private var _showHalfTicks:Boolean = true;
		private var _showQuarterTicks:Boolean = true;
		
		private var _showOuterLine:Boolean = false;
		private var _showInnerLine:Boolean = true;
		
		private var graduations:Array;
		private var labels:Array = new Array();
		private var _scaleInside:Boolean = true;
		private var _scaleGap:Number = 15;
		
		private var _needle:UIComponent;
		private var _needleOffset:Point = new Point(3,95);
		
		private var _zeroReturn:Boolean = false;
		[Bindable]
		public var returnRate:Number = 20;	
		private var timer:Timer;
		private var interval:Number = 10;
		
		private var newIcon:IFlexDisplayObject;
		private var shadow:DropShadowFilter;
		
		[Bindable]
		public var interactive:Boolean = true;
		
		private static var classConstructed:Boolean = classConstruct();
		
		
		private static function classConstruct():Boolean 
		{
			if (!StyleManager.getStyleDeclaration("Gauge"))
			{
				var newStyleDeclaration:CSSStyleDeclaration = new CSSStyleDeclaration();
				//Default styles
				newStyleDeclaration.setStyle("backgroundColor",0xFFFFFF);
				newStyleDeclaration.setStyle("majorTickLength",10);
				newStyleDeclaration.setStyle("minorTickLength",5);
				newStyleDeclaration.setStyle("majorTickThickness",2);
				newStyleDeclaration.setStyle("minorTickThickness",1);
				newStyleDeclaration.setStyle("tickInset",10); 
				newStyleDeclaration.setStyle("borderThickness",3);
				newStyleDeclaration.setStyle("scalePosition","inside");
				StyleManager.setStyleDeclaration("Gauge",newStyleDeclaration, true);
			}
			return true;
		}
		
		public function Gauge()
		{
			super();
			
			
			graduations = Util.optimalScale(_minimum,_maximum,5,false);
			generateLabels();
			timer = new Timer(interval,0);
			timer.addEventListener(TimerEvent.TIMER,this.onTick);
			
			this.addEventListener(MouseEvent.CLICK,selectThis);
			
			_label= new TextField();
			_label.autoSize = TextFieldAutoSize.LEFT;			
			this.addChild(_label);
			
			setNeedle("images/Untitled.png",3,95);
			
			value = minimum;
			invalidateDisplayList();		
		}
		
		public function setNeedleImage(value:String):void{
			setNeedle(value,3,95);
		}
		
		
		private function generateLabels():void
		{
			if(labels != null)
			{
				for(var j:int = 0;j < labels.length;j++)
				{
					if(this.contains(labels[j]))
					{
						this.removeChild(labels[j]);
					}
				}
				//delete all labels
				labels.splice(0,labels.length);
			}
			for(var i:int = 0;i < graduations.length; i++)
			{
				var tf:TextField = new TextField();
				tf.antiAliasType = AntiAliasType.ADVANCED;
				tf.autoSize = TextFieldAutoSize.LEFT;
				tf.text = graduations[i];	
				tf.selectable = false;
				tf.addEventListener(MouseEvent.CLICK,selectThis);	
				labels.push(tf);
				this.addChildAt(tf,0);
			}
		}
		
		
		
		private function imageLoadingComplete(event:Event):void
		{
			event.target.width = Image(event.target).content.loaderInfo.width;
			event.target.height = Image(event.target).content.loaderInfo.height;
			Bitmap(Image(_needle).content).smoothing = true;
		}
		
		private function onTick(event:TimerEvent):void
		{
			if(_zeroReturn)
			{
				value = _value - (returnRate * (interval /1000));
			}
			if(value <= minimum)
			{
				timer.stop();
			}
		}		
		
		private function positionNeedle():void
		{
			var angle:Number = ((_value - graduations[0]) / (graduations[graduations.length - 1] - graduations[0])) * (angleTo - angleFrom) + angleFrom;
			var rotateMatrix:Matrix = new Matrix();
			rotateMatrix.rotate(angle);
			var newCenter:Point = rotateMatrix.deltaTransformPoint(_needleOffset);
			rotateMatrix.translate((_centerx - newCenter.x),(_centery - newCenter.y));
			_needle.transform.matrix = rotateMatrix;
		}
		
		
		
		private function positionScaleLabels():void
		{
			var sweep:Number = angleTo - angleFrom;
			var gradAngle:Number = sweep / (graduations.length - 1); 
			
			var matl:Number =  getStyle("majorTickLength");
			var ti:Number = getStyle("tickInset");
			var labelRadius:Number = _radius - ti - (scaleInside?(matl + _scaleGap):-scaleGap);
			for(var i:int = 0;i<labels.length;i++)
			{
				var angle:Number = angleFrom + (i * gradAngle);
				labels[i].x = Math.sin(angle) * labelRadius + _centerx - (labels[i].width/2) - ((scaleInside?1:-1) * (Math.sin(angle) * (labels[i].width/2))); 
				labels[i].y = -Math.cos(angle) * labelRadius + _centery - labels[i].height/2 + ((scaleInside?1:-1) * (Math.cos(angle) * (labels[i].height/2)));
			}
			
			_label.x = _centerx - _label.width/2;
			_label.y = _centery - _label.height;
		}
		
		
		private function setTextStyles():void
		{
			var tf:TextFormat =  new TextFormat(getStyle("scaleFontFamily"),getStyle("scaleFontSize"),getStyle("scaleFontColor"),(getStyle("scaleFontWeight") == "bold"),(getStyle("scaleFontStyle") == "italic"));
			for(var i:int = 0;i<labels.length;i++)
			{
				TextField(labels[i]).setTextFormat(tf);
			}
			var ltf:TextFormat =  new TextFormat(getStyle("labelFontFamily"),getStyle("labelFontSize"),getStyle("labelFontColor"),(getStyle("labelFontWeight") == "bold"),(getStyle("labelFontStyle") == "italic"));
			_label.setTextFormat(ltf);
		}
		
		protected override function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void
		{
			graphics.clear();
			
			if(newIcon != null)
			{
				newIcon.x = _centerx - newIcon.width/2;
				newIcon.y = _centery - newIcon.height/2 - _radius/2;
			}
			if(shadow == null)
			{
				var fil:Array = new Array();
				shadow = new DropShadowFilter(4,45,0x444444,1);
				fil.push(shadow);
				/* var bevel:BevelFilter = new BevelFilter();
				fil.push(bevel); */
				this.filters = fil;
			}
			
			if(getStyle("borderStyle") == "solid")
				graphics.lineStyle(getStyle("borderThickness"),getStyle("borderColor"));
			
			graphics.beginFill(getStyle("backgroundColor"),getStyle("backgroundAlpha"));
			
			if(_backgroundCutAway)
			{
				var ti:Number = getStyle("tickInset");
				var extraAngle:Number =  Math.acos((Math.pow(_radius,2) + Math.pow(_radius,2) - Math.pow(ti,2))/(2 * _radius * _radius))
				var sp:Point = Util.circCurveTo(graphics,angleFrom - extraAngle ,angleTo + extraAngle,_centerx,_centery,_radius);
				var opp:Number = angleFrom + (angleTo - angleFrom)/2 + Math.PI;
				graphics.lineTo(_centerx + Math.sin(opp) * ti,_centery - Math.cos(opp) * ti);
				graphics.lineTo(sp.x,sp.y);		
			}
			else
			{
				graphics.drawCircle(_centerx,_centery,_radius);
			}
			graphics.endFill();
			
			graphics.lineStyle(getStyle("majorTickThickness"),getStyle("tickColor"));
			if(showOuterLine)
				Util.circCurveTo(graphics,angleFrom,angleTo,_centerx,_centery,_radius - getStyle('tickInset'));
			if(showInnerLine)
				Util.circCurveTo(graphics,angleFrom,angleTo,_centerx,_centery,_radius - getStyle('tickInset') - getStyle('majorTickLength'));
			
			graphics.lineStyle(1,0,1);
			generateTicks();
			setTextStyles();
			callLater(positionScaleLabels);
		}
		
		private function generateTicks():void
		{
			var sweep:Number = angleTo - angleFrom;
			var gradAngle:Number = sweep / (graduations.length - 1);
			var matl:Number =  getStyle("majorTickLength");
			var mitl:Number =  getStyle("minorTickLength");
			var matt:Number = getStyle("majorTickThickness");
			var mitt:Number = getStyle("minorTickThickness");
			var tc:uint = getStyle("tickColor");
			var ti:Number = getStyle("tickInset");
			for(var i:int = 0;i < graduations.length; i++)
			{
				graphics.lineStyle(matt,tc,1);
				graphics.moveTo(Math.sin(angleFrom + (i * gradAngle)) * (_radius - ti - matl) + _centerx,-Math.cos(angleFrom + (i * gradAngle)) * (_radius - ti - matl) + _centery);
				graphics.lineTo(Math.sin(angleFrom + (i * gradAngle)) * (_radius - ti) + _centerx,-Math.cos(angleFrom + (i * gradAngle)) * (_radius - ti) + _centery);
				
				graphics.lineStyle(mitt,tc,1);
				if(showHalfTicks && i != (graduations.length - 1))
				{	
					graphics.moveTo(Math.sin(angleFrom + (i * gradAngle) + (gradAngle/2)) * (_radius - ti - matl) + _centerx,-Math.cos(angleFrom + (i * gradAngle) + (gradAngle/2)) * (_radius - ti - matl) + _centery);
					graphics.lineTo(Math.sin(angleFrom + (i * gradAngle) + (gradAngle/2)) * (_radius - ti - (matl - mitl)) + _centerx,-Math.cos(angleFrom + (i * gradAngle) + (gradAngle/2)) * (_radius - ti - (matl - mitl)) + _centery);	
				}
				if(showQuarterTicks && i != (graduations.length - 1))
				{
					graphics.moveTo(Math.sin(angleFrom + (i * gradAngle) + (gradAngle/4)) * (_radius - ti - matl) + _centerx,-Math.cos(angleFrom + (i * gradAngle) + (gradAngle/4)) * (_radius - ti - matl) + _centery);
					graphics.lineTo(Math.sin(angleFrom + (i * gradAngle) + (gradAngle/4)) * (_radius - ti - (matl - mitl)) + _centerx,-Math.cos(angleFrom + (i * gradAngle) + (gradAngle/4)) * (_radius - ti - (matl - mitl)) + _centery);
					
					graphics.moveTo(Math.sin(angleFrom + (i * gradAngle) + (3*gradAngle/4)) * (_radius - ti - matl) + _centerx,-Math.cos(angleFrom + (i * gradAngle) + (3*gradAngle/4)) * (_radius - ti - matl) + _centery);
					graphics.lineTo(Math.sin(angleFrom + (i * gradAngle) + (3*gradAngle/4)) * (_radius - ti - (matl - mitl)) + _centerx,-Math.cos(angleFrom + (i * gradAngle) + (3*gradAngle/4)) * (_radius - ti - (matl - mitl)) + _centery);
				}
			}
		}
		
		public function setNeedle(value:Object,xOffset:Number, yOffset:Number):void
		{
			if(_needle != null && this.contains(_needle))
				this.removeChild(_needle);
			
			_needleOffset = new Point(xOffset,yOffset);
			
			_needle = new Image();
			_needle.addEventListener(Event.COMPLETE,imageLoadingComplete);
			Image(_needle).source = value;
			_needle.x = _centerx - _needleOffset.x;
			_needle.y = _centery - _needleOffset.y;
			this.addChild(_needle);
		}
		
		[Bindable]
		public function set value(val:Number):void
		{
			if(val > maximum)
				_value = maximum;
			else if(val < minimum)
				_value = minimum;
			else
				_value = val;
			positionNeedle();
			
			if(_zeroReturn && !timer.running)
			{
				timer.start();
			}
		}
		
		public function get value():Number
		{
			return _value;
		}
		
		public function set zeroReturn(value:Boolean):void
		{
			_zeroReturn = value;
			timer.start();
		}
		
		public function get zeroReturn():Boolean
		{
			return _zeroReturn;
		}
		
		[Bindable]
		public function set minimum(value:Number):void
		{
			_minimum = value;
			graduations = Util.optimalScale(_minimum,_maximum,5,false);
			generateLabels();
			value = _value; //need to reset value in case the value is outside the new range
			positionNeedle();
			invalidateDisplayList();
		}
		
		public function get minimum():Number
		{
			return _minimum;
		}
		
		[Bindable]
		public function set maximum(value:Number):void
		{
			_maximum = value;
			graduations = Util.optimalScale(_minimum,_maximum,5,false);
			generateLabels();
			value = _value; //need to reset value in case the value is outside the new range
			positionNeedle();
			invalidateDisplayList();
		}
		
		public function get maximum():Number
		{
			return _maximum;
		}
		
		public override function set width(value:Number):void
		{
			_radius = Math.min(value/2,this.height/2);
			_centerx = value/2;
			positionScaleLabels();
			positionNeedle();
			super.width = value;
		}
		
		public override function set height(value:Number):void
		{
			_radius = Math.min(value/2,this.width/2);
			_centery = value/2;
			positionScaleLabels();
			positionNeedle();
			super.height = value;
		}
		[Bindable]
		public function set angleFrom(value:Number):void
		{
			_angleFrom = value;
			positionNeedle();
			invalidateDisplayList();
		}
		
		public function get angleFrom():Number
		{
			return _angleFrom;
		}
		[Bindable]
		public function set angleTo(value:Number):void
		{
			_angleTo = value;
			positionNeedle();
			invalidateDisplayList();
		}
		
		public function get angleTo():Number
		{
			return _angleTo;
		}
		
		[Bindable]
		public function set label(value:String):void
		{
			if(_label != null)
				_label.text = value;	
			invalidateDisplayList();
		}
		
		public function get label():String
		{
			if(_label != null)
				return _label.text;
			else
				return "";
		}
		
		[Bindable]
		public function set scaleGap(value:Number):void
		{
			_scaleGap = value;
			positionScaleLabels();
		}
		
		public function get scaleGap():Number
		{
			return _scaleGap;
		}
		
		[Bindable]
		public function set scaleInside(value:Boolean):void
		{
			_scaleInside = value;
			positionScaleLabels();
		}
		
		public function get scaleInside():Boolean
		{
			return _scaleInside;
		}
		
		[Bindable]
		public function get showInnerLine():Boolean
		{
			return _showInnerLine;
		}
		
		public function set showInnerLine(value:Boolean):void
		{
			_showInnerLine = value;
			invalidateDisplayList();
		}
		[Bindable]
		public function get showOuterLine():Boolean
		{
			return _showOuterLine;
		}
		
		public function set showOuterLine(value:Boolean):void
		{
			_showOuterLine = value;
			invalidateDisplayList();
		}
		
		[Bindable]
		public function get showHalfTicks():Boolean
		{
			return _showHalfTicks;
		}
		
		public function set showHalfTicks(value:Boolean):void
		{
			_showHalfTicks = value;
			invalidateDisplayList();
		}
		
		[Bindable]
		public function get showQuarterTicks():Boolean
		{
			return _showQuarterTicks;
		}
		
		public function set showQuarterTicks(value:Boolean):void
		{
			_showQuarterTicks = value;
			invalidateDisplayList();
		}
		
		public function set backgroundCutAway(value:Boolean):void
		{
			_backgroundCutAway = value;
			invalidateDisplayList();
		}
		
		public function get backgroundCutAway():Boolean
		{
			return _backgroundCutAway;
		}
		
		private function selectThis(event:MouseEvent):void
		{
			if(interactive)
			{
				if(event.target is TextField)
					this.value = Number(TextField(event.target).text);
				else if(event.target == this)
				{
					var pAngle:Number = (Math.atan2(event.localY - _centery, event.localX - _centerx) );
					pAngle += Math.PI/2;
					if(pAngle > Math.PI){pAngle = pAngle - 2*Math.PI};
					this.value = (((pAngle - _angleFrom) / (_angleTo - angleFrom)) * (Number(graduations[graduations.length - 1]) - Number(graduations[0]))) + Number(graduations[0]);
				}
			}
		}
		
	}
}