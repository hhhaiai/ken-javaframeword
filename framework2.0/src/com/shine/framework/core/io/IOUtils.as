package com.shine.framework.core.io
{
	import flash.display.BitmapData;
	import flash.geom.Matrix;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	
	import mx.core.UIComponent;
	import mx.graphics.codec.IImageEncoder;
	import mx.graphics.codec.JPEGEncoder;

	public class IOUtils
	{
		public function IOUtils()
		{
		}
		
		//组件生成字节码
		public static function getBitmapDataByUIComponent(target:UIComponent):BitmapData
		{
			var bd:BitmapData=new BitmapData(target.width, target.height);
			var m:Matrix=new Matrix();
			bd.draw(target, m);
			return bd;
		}
		
		
		
		//组件保存为图片
		public static function saveUIComponentPicture(value:UIComponent,dowloadPictureName:String="save.jpg"):void{
			var bitmapData:BitmapData=getBitmapDataByUIComponent(value);
			var _fileRef:FileReference=new FileReference(); //用于保存文件
			var _encoder:IImageEncoder=new JPEGEncoder(80); //用于编码位图 
			var ba:ByteArray=_encoder.encode(bitmapData); //编码成JPG图片，质量为80
			_fileRef.save(ba, dowloadPictureName); //保存到磁盘，会出现个系统保存对话框。
			ba.clear();
		}
		
		
	}
}