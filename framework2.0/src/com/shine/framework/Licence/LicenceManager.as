package com.shine.framework.Licence
{
	import com.shine.framework.core.util.ReferenceUtil;
	
	public class LicenceManager
	{
		private static var _instance:LicenceManager;
		//licence数据 url+date
		public var licenceValue:String="";
		//licence 模式
		public var licenceStatus:String="";
		
		public function LicenceManager(enforcer:SingletonEnforcer)
		{
		}
		
		public static function getInstance():LicenceManager
		{
			if (LicenceManager._instance == null)
			{
				LicenceManager._instance=new LicenceManager(new SingletonEnforcer());
			}
			return LicenceManager._instance;
		}
		
		public function loadLicence(swcUrl:String):void{
			
		}
		
		//检查licence
		public function checkLicence():Boolean{
			var o:Object=ReferenceUtil.referenceClass("com.shine.framework.Licence.file::LicenceFile");
			if(o.licence!=null&&String(o.licence).length!=0){
				this.licenceValue=String(o.licence);
			}
			return false;
		}
	}
}
class SingletonEnforcer
{
}