package com.shine.framework.core.util
{
	import mx.collections.ArrayCollection;
	import mx.controls.Alert;

	/**
	 * Url Parameters Collection
	 * 
	 * @author viruscodecn@gmail.com
	 * @project FlexFramework 2.0 2011-01-11
	 */
	public class UrlParametersArrayCollection extends ArrayCollection
	{
		public var url:String;
		private var urlParamenters:UrlParameters;

		public function UrlParametersArrayCollection(source:Array=null)
		{
			super(source);
		}
        
		//分析url获取url的get参数
		public function analysisParameters(value:String=null):UrlParametersArrayCollection
		{
			if (value != null)
			{
				this.url=value;
			}
			if (url != null)
			{
				var num:int=url.indexOf("?");
				var parametersUrl:String=url.substring(num + 1);
				var parameters:Array=parametersUrl.split(/&/);
				for (var i:int=0; i < parameters.length; i++)
				{
					var parameter:Array=String(parameters[i]).split(/=/);
					urlParamenters=new UrlParameters;
					urlParamenters.prarameterName=parameter[0];
					urlParamenters.prarameter=parameter[1];
					this.addParametersModel(urlParamenters);
					urlParamenters=null;
				}
				parametersUrl=null;
				parameters=null;
			}

            value=null;
			return this;
		}

		//加入一个url参数
		protected function addParametersModel(value:UrlParameters):void
		{
			var name:String=value.prarameterName;
			var parameter:String=value.prarameter;
			var urlParamenters:UrlParameters=null;

			var b:Boolean=true;
			if (this.length != 0)
			{
				var num:int=this.length;
				for (var i:int=0; i < num; i++)
				{
					urlParamenters=this.getItemAt(i) as UrlParameters;
					if (name == urlParamenters.prarameterName)
					{
						(this.getItemAt(i) as UrlParameters).prarameter=parameter;
						b=false;
					}
				}
				if (b == true)
				{
					urlParamenters=new UrlParameters;
					urlParamenters.prarameterName=name;
					urlParamenters.prarameter=parameter;
					this.addItem(urlParamenters);
				}
			}
			else
			{
				urlParamenters=new UrlParameters;
				urlParamenters.prarameterName=name;
				urlParamenters.prarameter=parameter;
				this.addItem(urlParamenters);
			}
		}

	    //加入url参数
		public function addParameters(name:String, parameter:String):void
		{
			var b:Boolean=true;
			var urlParamenters:UrlParameters=null;
			if (this.length != 0)
			{
				var num:int=this.length;
				for (var i:int=0; i < num; i++)
				{
					urlParamenters=this.getItemAt(i) as UrlParameters;
					if (name == urlParamenters.prarameterName)
					{
						(this.getItemAt(i) as UrlParameters).prarameter=parameter;
						b=false;
					}
				}
				if (b == true)
				{
					urlParamenters=new UrlParameters;
					urlParamenters.prarameterName=name;
					urlParamenters.prarameter=parameter;
					this.addItem(urlParamenters);
				}
			}
			else
			{
				urlParamenters=new UrlParameters;
				urlParamenters.prarameterName=name;
				urlParamenters.prarameter=parameter;
				this.addItem(urlParamenters);
			}
		}

		//获取某个url参数
		public function getParameters(name:String):String
		{
			var parameters:String="";
			if (this.length != 0)
			{
				var num:int=this.length;
				for (var i:int=0; i < num; i++)
				{
					urlParamenters=this.getItemAt(i) as UrlParameters;
					if (name == urlParamenters.prarameterName)
					{
						parameters=urlParamenters.prarameter;
					}
					urlParamenters=null;
				}
				return parameters;
			}
			else
			{
				return parameters;
			}
		}
	}
}

class UrlParameters
{
	public var prarameterName:String;
	public var prarameter:String;
	
	public function UrlParameters()
	{
	}
}