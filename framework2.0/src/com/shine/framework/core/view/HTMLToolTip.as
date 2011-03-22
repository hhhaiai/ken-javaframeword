package com.shine.framework.core.view
{
	import mx.controls.ToolTip;
	
	/**
	 * html tooltip view
	 * 
	 * @author viruscodecn@gmail.com
	 * @project FlexFramework 2.0 2011-01-11
	 */
	/*
	ToolTipManager.toolTipClass = HtmlToolTip;
	*/
	public class HTMLToolTip extends ToolTip
	{
		public function HTMLToolTip()
		{
			super();
		}
		
		override protected function commitProperties():void{  		
			super.commitProperties();  
			textField.htmlText = text;            
		}
	}
}