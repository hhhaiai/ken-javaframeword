package com.shine.framework.Ftp
{
	import flash.events.Event;
	import flash.events.IEventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.FileReference;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	
	import com.shine.framework.Ftp.event.FileUpDownloadEvent;
	import com.shine.framework.core.util.DataUtil;
	
	public class FtpFileUpDownload
	{
		private var ftpSocket:Socket;
		private var ftpResponce:String;
		private var dataSocket:Socket;
		private var dataResponse:String;
		private var clientIP:String;
		private var clientPort:uint;
		private var canceled:Boolean = false;
		private var dispatcher:IEventDispatcher;
		private var fileName:String;
		private var fileData:ByteArray;
		private var _isAnonymous:Boolean = false;
		private var _userName:String;
		private var _serverIP:String;
		private var _userPwd:String;
		private var _userDir:String;
		private var _serverPort:uint = 21;
		private var intervalID:int;
		//
		public function FtpFileUpDownload(dispatcher:IEventDispatcher)
		{
			this.dispatcher = dispatcher;
		}
		
		/**
		 * isAnonymous, FTP 是否允许 匿名访问,默认为false
		 */
		public function get isAnonymous():Boolean{
			return _isAnonymous;
		}
		public function set isAnonymous(value:Boolean):void{
			_isAnonymous = value;
		}
		
		public function get userName():String{
			return _userName;
		}
		public function set userName(value:String):void{
			_userName = value;
		}
		
		public function get serverIP():String{
			return _serverIP;
		}
		public function set serverIP(value:String):void{
			_serverIP = value;
		}
		
		public function get userPwd():String{
			return _userPwd;
		}
		public function set userPwd(value:String):void{
			_userPwd = value;
		}
		
		/**
		 * userDir, FTP 用户上传目录
		 */
		public function get userDir():String{
			return _userDir;
		}
		public function set userDir(value:String):void{
			_userDir = value;
		}
		
		public function get serverPort():uint{
			return _serverPort;
		}
		public function set serverPort(value:uint):void{
			_serverPort = value;
		}
		
		/**
		 * upload file, data is null is not allowed.
		 */
		public function upload(data:ByteArray, fileName:String):void{
			this.fileName = fileName;
			this.fileData = data;
			if(data==null){
				dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,"Data is null is not allowed!"));
				return;
			}
			if(!check()) return;
			connect();
		}
		
		private function check():Boolean{
			var blnResult:Boolean = true;
			if(!isAnonymous){
				if(DataUtil.isNull(userName) || DataUtil.isNull(userPwd)){//
					dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,
						"请输入用户名和口令!"));
					blnResult = false;
				}
			}
			if(DataUtil.isNull(serverIP)){
				dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,
					"请输入FTP服务器IP地址!"));
				blnResult = false;
			}
			return blnResult;
		}
		
		private function connect():void{
			ftpSocket = new Socket(serverIP, serverPort);
			ftpSocket.addEventListener(ProgressEvent.SOCKET_DATA, ftpSocketDataHandle);      ftpSocket.addEventListener(SecurityErrorEvent.SECURITY_ERROR,ftpSocketSecurityErrorHandle);
			ftpSocket.addEventListener(IOErrorEvent.IO_ERROR,ftpIOErrorHandle);
		}
		
		private function ftpIOErrorHandle(evt:IOErrorEvent):void {
			dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,evt.text));
		}
		
		private function ftpSocketSecurityErrorHandle(evt:SecurityErrorEvent):void {
			dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,evt.text));
		}
		
		private function dataSocketSecurityErrorHandle(evt:SecurityErrorEvent):void {
			dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,evt.text));
		}
		
		//发送ftpsocket ftp 指令
		private function sendCommand(arg:String):void {
			arg +="\n";
			var content:ByteArray = new ByteArray();
			content.writeMultiByte(arg,"gb2312");
			ftpSocket.writeBytes(content);
			ftpSocket.flush();
		}
		
		private function dataIOErrorHandle(evt:IOErrorEvent):void {
			dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,evt.text));
		}
		
		private function ftpSocketDataHandle(evt:ProgressEvent):void{
			ftpResponce = ftpSocket.readUTFBytes(ftpSocket.bytesAvailable);
			var serverResponse:String =ftpResponce.substr(0, 3);
			if(ftpResponce.indexOf('227')>-1){
				//取得使用者的ip位置
				var temp:Object = ftpResponce.substring(ftpResponce.indexOf("(")+1 ,ftpResponce.indexOf(")"));
				var upLoadSocket_temp:Object = temp.split(",");
				clientIP = upLoadSocket_temp.slice(0,4).join(".");
				clientPort = parseInt(upLoadSocket_temp[4])*256+
					int(upLoadSocket_temp[5]);
				
				//创建上传的ftp连接
				dataSocket = new Socket(clientIP,clientPort);
				dataSocket.addEventListener(ProgressEvent.SOCKET_DATA, receiveData);
				dataSocket.addEventListener(IOErrorEvent.IO_ERROR,dataIOErrorHandle);
				dataSocket.addEventListener(SecurityErrorEvent.SECURITY_ERROR,dataSocketSecurityErrorHandle);
				//upload file
				sendCommand("STOR "+this.fileName);
			}
			switch(serverResponse){
				case "150":   //开始文件传输
					curPos = 0;
					intervalID = setInterval(sendData,30);
					break;
				case "220": //FTP连接就绪
					sendCommand("USER "+this.userName);
					break;
				case "331"://用户名正确，请继续输入口令
					sendCommand("PASS "+this.userPwd);
					break;
				case "230"://登入成功
					//指定下載文件的類型，I是二進位文件，A是字元文件            
					sendCommand("TYPE A");//設定TYPE為ASCII
					sendCommand("TYPE I");//設定上傳的編碼為8-bit binary
					if(!DataUtil.isNull(userDir))   //设定FTP 上传目录
						sendCommand("CWD "+userDir);
					sendCommand("PASV");//passive模式
					break;
				case "250" ://資料夾切換成功
					break;
				case "226"://关闭数据连接。请求的文件操作成功（比如，文件传输或文件终止)
					ftpSocket.close();
					dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.COMPLETED));
					break;
				case "227" : //Entering Passive Mode (h1,h2,h3,h4,p1,p2).
					break;
				case "530":   //530 Login incorrect
					dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,"用户名或者密码有误!"));
					break;
				case "421":
					dispatcher.dispatchEvent(new FileUpDownloadEvent(FileUpDownloadEvent.ERROR,"连接超时!"));
					break;
				default:
			}
			trace("ftp response: "+ftpResponce);
		}
		
		private var curPos:int = 0;
		
		private function sendData():void{
			var fileContents:ByteArray =this.fileData;
			var fileSize:uint = this.fileData.length;
			var chunk:uint = 1024*2;
			//var pos:int = 0;
			if(curPos+chunk>fileSize){
				dataSocket.close();
				clearInterval(intervalID);
				return;
			}
			dataSocket.writeBytes(fileContents,curPos,chunk);
			dataSocket.flush();
			curPos+=chunk;
		}
		
		private function receiveData():void{
			var responce:String = dataSocket.readUTFBytes(dataSocket.bytesAvailable);
			trace("dataSocket response: "+responce);
		}
	}
}