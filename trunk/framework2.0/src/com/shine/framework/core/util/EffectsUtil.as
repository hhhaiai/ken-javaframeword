package com.shine.framework.core.util
{
	import mx.core.UIComponent;
	import mx.effects.Blur;
	import mx.effects.Glow;
	
	import spark.effects.Fade;
	import spark.effects.Move;
	import spark.effects.Resize;


	public class EffectsUtil
	{
		public function EffectsUtil()
		{
		}
		
		//淡入
		public static function fadeEffect(target:UIComponent,alphaFrom:Number=0,alphaTo:Number=1,duration:Number=1000):Fade{
			var fade:Fade=new Fade(target);
			fade.alphaFrom=alphaFrom;
			fade.alphaTo=alphaTo;
			fade.duration=duration;
			return fade;
		}
		
		//移动
		public static function moveEffect(target:UIComponent,xTo:Number,yTo:Number,duration:Number=1000):Move{
			var move:Move=new Move(target);
			move.xTo=xTo;
			move.yTo=yTo;
			move.duration=duration;
			return move;
		}
		
		//缩放
		public static function resizeEffect(target:UIComponent,widthTo:Number,heightTo:Number,duration:Number=1000):Resize{
			var resize:Resize=new Resize(target);
			resize.widthTo=widthTo;
			resize.heightTo=heightTo;
			resize.duration=duration;
			return resize;	
		}
		
		//模糊
		public static function blurEffect(target:UIComponent,blurXTo:Number=50,blurYTo:Number=50,duration:Number=1000):Blur{
			var blur:Blur=new Blur(target);
			blur.blurXTo=blurXTo;
			blur.blurYTo=blurYTo;
			blur.duration=duration;
			return blur;	
		}

		//发亮
		public static function glowEffect(target:UIComponent,alphaFrom:Number=1,alphaTo:Number=0.4,blurXFrom:Number=0.0,blurXTo:Number=70.0,blurYFrom:Number=0.0,blurYTo:Number=70.0,color:uint=0x13B3AA,duration:Number=1000):Glow{
			var glow:Glow=new Glow(target);
			glow.alphaFrom=alphaFrom;
			glow.alphaTo=alphaTo;
			glow.blurXFrom=blurXFrom;
			glow.blurXTo=blurXTo;
			glow.blurYFrom=blurYFrom;
			glow.blurXTo=blurXTo;
			glow.color=color;
			glow.duration=duration;
			return glow;
		}
	}
}