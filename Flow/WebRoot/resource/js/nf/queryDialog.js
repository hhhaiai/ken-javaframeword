/**
 * @fileOverview Query dialog.
 * @author 彭日聪
 * @version 1.0.0
 * @change
    修改者      修改时间         版本       修改描述
*/
/*
rl.provided("nf:queryDialog");
*/
rl.importJs("lib.rpc.XHRequest");
rl.importJs("gui.dialog.Dialog");

nf.queryDialog = rl.createComp({
	ctype : "Dialog",
	iniVisible : false,
	contentType : "dom",
	content : 'queryDialogContent',
	autoFit : true,
	requestingUrl : ""
});

nf.queryReq = new rl.rpc.XHRequest({
	responseType : "text",
	async : true,
	disableCache : true,
	query : function(url){
		if(this.requesting) this.abort();
		
		this.request({
			url : url
		});
	},
	showRspContent : function(content){
		rl.getDom("dlgRspCtn").innerHTML = content;
	},
	successHandler : function(rsp, response){
		nf.queryReq.showRspContent(rsp);
	},
	failureHandler : function(response){
		nf.queryReq.showRspContent("查询失败，请检查网络及服务器。");
	}
});

/**
 * Show queryDialog then do query with given urlString and day
 */
function showQuery(urlString, day){
	var dlg = nf.queryDialog,
		url = combineQueryUrl(urlString, day);
	
	dlg.show();
	dlg.requestingUrl = urlString;
	nf.queryReq.query(url);
}

/**
 * Do query in queryDialog with queryDialog.requestingUrl and queryDay
 * The queryDialog.requestingUrl is set in method showQuery,
 * The queryDay is DateSelect component in queryDialog.
 */
function dlgQuery(){
	var day = rl.getComp("queryDay").getValue(),
		url = combineQueryUrl(nf.queryDialog.requestingUrl, day);
	
	if(!rl.isNonNullStr(day)){
		alert("请选择日期！");
		return ;
	}
	nf.queryReq.query(url);
}

function combineQueryUrl(urlString, day){
	return urlString + "&input.day=" + day;
}
