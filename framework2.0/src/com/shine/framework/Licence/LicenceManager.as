package com.shine.framework.Licence
{
	import com.shine.framework.Browser.BrowserUtils;
	import com.shine.framework.Swc.SwcManager;
	import com.shine.framework.core.util.ReferenceUtil;
	
	import mx.controls.Alert;
	
	public class LicenceManager
	{
		private static var _instance:LicenceManager;
		//licence数据 
		public var licence:String="";
		//licence 模式
		public var licenceConfig:String="";
		//licence 状态
		public var licenceStatus:Boolean=false;
		//返回值方法
		public var returnMethod:Function;
		
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
		
		//加载swc
		public function loadLicence(swcUrl:String,returnMethod:Function=null):void{
			var swcManage:SwcManager =new SwcManager;
			swcManage.loadSwc(swcUrl,loadComplete);
			if(returnMethod!=null){
				this.returnMethod=returnMethod;
			}
		}
		
		//加载完成
		private function loadComplete():void{
			if(checkLicenceName()==true&&checkLicenceUrl()==true){
				licenceStatus=true;
			}else{
				licenceStatus=false;
			}
			
			if(returnMethod!=null){
				this.returnMethod.call(this);
			}
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
				if(BrowserUtils.getBrowserBaseUrl()==String(o.licenceUrl))
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