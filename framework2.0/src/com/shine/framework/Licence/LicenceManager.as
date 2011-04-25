package com.shine.framework.Licence
{
	import com.shine.framework.core.util.ReferenceUtil;
	import com.shine.framework.Browser.BrowserUtils;
	
	public class LicenceManager
	{
		private static var _instance:LicenceManager;
		//licence数据 
		public var licence:String="";
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
		
		//检查licence name
		public function checkLicenceName():Boolean{
			var o:Object=ReferenceUtil.referenceClass("com.shine.framework.Licence.file::LicenceFile");
			if(licence.length!=0){
				if(o.licence!=null&&String(o.licence).length!=0){
					if(licence==String(o.licence))
						return true;
				}else{
					return false;
				}
			}
			return false;
		}
		
		//检查licence name
		public function checkLicenceUrl():Boolean{
			var o:Object=ReferenceUtil.referenceClass("com.shine.framework.Licence.file::LicenceFile");
			if(o.licenceUrl!=null&&String(o.licenceUrl).length!=0){
				if(BrowserUtils.getBrowserFullUrl()==String(o.licenceUrl))
					return true;
			}else{
				return true;
			}
			return false;
		}
	}
}
class SingletonEnforcer
{
}