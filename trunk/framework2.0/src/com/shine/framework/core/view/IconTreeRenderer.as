package com.shine.framework.core.view
{
	import mx.controls.treeClasses.TreeItemRenderer;
	import flash.xml.*;   
	
	import mx.collections.*;   
	import mx.controls.Alert;   
	import mx.controls.Image;   
	import mx.controls.listClasses.*;   
	import mx.controls.treeClasses.*;   
	/*  
	*  ICON Tree的渲染器  
	*/  
	public class IconTreeRenderer extends TreeItemRenderer   
	{   
		protected var myImage:Image;    
		private var imageWidth:Number = 16;   
		private var imageHeight:Number = 16;   
		[Embed(source="resource/image/config/leaf.gif")]
		[Bindable]
		public var defaultImg:Class;
		
		public function IconTreeRenderer ()    
		{   
			super();   
		}   
		
		override protected function createChildren():void  
		{   
			super.createChildren();   
			myImage = new Image();   
			myImage.source = defaultImg;   
			myImage.width=imageWidth;   
			myImage.height=imageHeight;   
			myImage.setStyle( "verticalAlign", "middle" );
			myImage.maintainAspectRatio=false;
			addChild(myImage);   
			
		}      
		//通过覆盖data方法来动态设置tree的节点图标   
		override public function set data(value:Object):void  
		{   
			super.data = value;   
			var imageSource:String=value.@icon;   
			if(imageSource.length!=0)   
			{   
				myImage.source=imageSource;   
			}else{  
				myImage.source=defaultImg;   
			}   
		}   
		//隐藏原有图标，并设置它的坐标   
		override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void  
		{   
			super.updateDisplayList(unscaledWidth, unscaledHeight);   
			if(super.data !=null)   
			{   
				if (super.icon != null)   
				{   
					myImage.x = super.icon.x;   
					myImage.y = 2;   
					super.icon.visible=false;   
				}   
				else  
				{   
					myImage.x = super.label.x;   
					myImage.y = 2;   
					super.label.x = myImage.x + myImage.width + 17;   
				}   
			}   
		}   
	}
}