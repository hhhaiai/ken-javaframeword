package com.shine.framework.GaugeExplorer
{
	import flash.display.Graphics;
	import flash.geom.Point;
	import mx.formatters.NumberFormatter;
	import mx.formatters.NumberBaseRoundType;
	import flash.geom.Matrix;
	
	public class Util
	{
		public static var increments:Array = [0.01,0.02,0.05,0.1,0.2,0.5,1,2,5,10,15,20,30,40,50,100,200,1000,10000,100000,1000000];
		
		
		public static function optimalScale(min:Number , max:Number, desiredNumPoints:Number = 5, zero:Boolean = true):Array
		{
			if(max < min)
			{
				var temp:Number = min;
				min = max;
				max = temp;
			}
			var range:Number = max - (zero?0:min);
			//var step:Number = range / desiredNumPoints;		
			var increment:Number = increments[0];
			for(var i:int = 0;i<increments.length;i++)
			{
				if(Math.abs(range - (increments[i] * desiredNumPoints)) < Math.abs(range - (increment * desiredNumPoints)))
				{
					increment = increments[i];
				}
			}

			var first:Number = Math.floor((zero?0:min) / increment) * increment;
			var last:Number = Math.ceil(max/increment) * increment;

			var nf:NumberFormatter = new NumberFormatter();
			
			nf.precision = Math.ceil(Math.log(1/increment)/Math.log(10));
			nf.rounding = NumberBaseRoundType.NEAREST;
			var graduations:Array = new Array();
			for(var j:Number = first;j <= last;j += increment)
			{
				if(increment < 1)
					graduations.push(nf.format(j));
				else
					graduations.push(String(j));
			}	
			return graduations;		
		}
		
		//Goes around a circle, basically taking 2 points on the circle at a time, finding the tangents at those
		//points and using the point where the 2 tangents intersect as a control point for a quadratic bezier between
		// the points. Fairly closely approximates a circular curve with minimal effort.
		public static function circCurveTo(graphics:Graphics, fromAngle:Number,toAngle:Number,centerx:Number,centery:Number,radius:Number):Point
		{
			var startPoint:Point = new Point((Math.sin(fromAngle)*radius) + centerx,(-Math.cos(fromAngle)*radius) + centery);
			graphics.moveTo(startPoint.x,startPoint.y);
			for(var i:Number = fromAngle; i < toAngle; i+= Math.PI/8)
			{
				var p1:Point = new Point((Math.sin(i)*radius) + centerx,(-Math.cos(i)*radius) + centery);
				var p2:Point = new Point((Math.sin(Math.min(i + Math.PI/8,toAngle))*radius) + centerx,(-Math.cos(Math.min(i + Math.PI/8,toAngle))*radius) + centery);
				
				//work out the slopes of the lines from the center to 2 points on the circle
				var p1slope:Number = (p1.y - centery) / (p1.x - centerx) ;
				var p2slope:Number = (p2.y - centery) / (p2.x - centerx) ;
				
				//invert and negate to get the slope of the tangent to the circle
				p1slope = -(1/((p1slope == 0)?0.0001:p1slope));//replace a slope of 0 with a very small number
				p2slope = -(1/((p2slope == 0)?0.0001:p2slope));

				//work out the y-intercepts of the tangents
				var p1intersect:Number = p1.y - (p1slope * p1.x);
				var p2intersect:Number = p2.y - (p2slope * p2.x);
				//solve simultaneously to give the intersection point of the tangents
				var tix:Number = (p2intersect - p1intersect) / (p1slope -p2slope);				
				var tiy:Number = (tix * p1slope ) + p1intersect;
				
				graphics.curveTo(tix,tiy,p2.x,p2.y);
				
			}
			return startPoint;
		}
		
		public static function drawRoundRectAtAngle(graphics:Graphics, x:Number, y:Number, width:Number, height:Number, cornerRadius:Number, angle:Number):void
		{
			var rotate:Matrix = new Matrix();
			rotate.rotate(angle);
			var nextPoint:Point;
			var controlPoint:Point;
			
			
			nextPoint = new Point(x + cornerRadius,y);
			nextPoint = rotate.transformPoint(nextPoint);
			graphics.moveTo(nextPoint.x,nextPoint.y);
			nextPoint = new Point(x + width - cornerRadius,y);
			nextPoint = rotate.transformPoint(nextPoint);
			graphics.lineTo(nextPoint.x,nextPoint.y);
			controlPoint = new Point(x + width, y);
			nextPoint = new Point(x + width,y + cornerRadius);
			nextPoint = rotate.transformPoint(nextPoint);
			controlPoint = rotate.transformPoint(controlPoint);
			graphics.curveTo(controlPoint.x,controlPoint.y,nextPoint.x,nextPoint.y);
			nextPoint = new Point(x + width,y + height - cornerRadius);
			nextPoint = rotate.transformPoint(nextPoint);
			graphics.lineTo(nextPoint.x,nextPoint.y);
			controlPoint = new Point(x + width, y + height) ;
			nextPoint = new Point(x + width - cornerRadius,y + height);
			nextPoint = rotate.transformPoint(nextPoint);
			controlPoint = rotate.transformPoint(controlPoint);
			graphics.curveTo(controlPoint.x,controlPoint.y,nextPoint.x,nextPoint.y);
			nextPoint = new Point(x + cornerRadius,y + height);
			nextPoint = rotate.transformPoint(nextPoint);
			graphics.lineTo(nextPoint.x,nextPoint.y);
			controlPoint = new Point(x,y + height);
			nextPoint = new Point(x,y + height - cornerRadius);
			nextPoint = rotate.transformPoint(nextPoint);
			controlPoint = rotate.transformPoint(controlPoint);
			graphics.curveTo(controlPoint.x,controlPoint.y,nextPoint.x,nextPoint.y);
			nextPoint = new Point(x,y + cornerRadius);
			nextPoint = rotate.transformPoint(nextPoint);
			graphics.lineTo(nextPoint.x,nextPoint.y);
			controlPoint = new Point(x,y);
			nextPoint = new Point(x + cornerRadius,y);
			nextPoint = rotate.transformPoint(nextPoint);
			controlPoint = rotate.transformPoint(controlPoint);
			graphics.curveTo(controlPoint.x,controlPoint.y,nextPoint.x,nextPoint.y);
		}
	}
}