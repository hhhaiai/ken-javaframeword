package com.shine.topo.model
{
	import com.shine.framework.core.model.BaseXmlModel;
	
	public class RightXmlModel extends BaseXmlModel
	{
		public function RightXmlModel(value:String=null)
		{
			super(value);
		}
		
		//获取处理后的url
		public function getHandleUrl(model:BaseXmlModel):String{
			var handleUrl:String="";
			var re:RegExp=/#/;
			var results:Array=this.getString("url").split(re);
			for (var i:int=0; i < results.length; i++)
			{
				if (i % 2 != 0)
				{
					handleUrl=handleUrl + model.getString(results[i]);
				}
				else
				{
					handleUrl=handleUrl + results[i];
				}
			}
			return handleUrl;
		}
	}
}