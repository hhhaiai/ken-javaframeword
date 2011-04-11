package com.shine.framework.core.view
{
	import mx.controls.Text;
	import mx.controls.dataGridClasses.DataGridListData;
	import mx.events.FlexEvent;
	import mx.controls.Alert;
	
	public class HTMLDataGridRender extends Text
	{
		public function HTMLDataGridRender()
		{
			super();
		}
		
		private var _data:Object;
		
		[Bindable("dataChange")]
		[Inspectable(environment="none")]
		override public function get data():Object
		{
			return _data;
		}
		override public function set data(value:Object):void
		{
			_data = value;
			
			if (listData)
			{
				if(XML((listData as DataGridListData).label).children().length()!=0){
					htmlText = XML((listData as DataGridListData).label).children().toXMLString();
				}
				else
				   htmlText = (listData as DataGridListData).label;
				
			}
			else if (_data != null)
			{
				if (_data is String)
					htmlText = String(_data);
				else
					htmlText = _data.toString();
			}	
			dispatchEvent(new FlexEvent(FlexEvent.DATA_CHANGE));
		}
	}
}