/**
 * @fileOverview Defines source view standardList page.
 * @author 彭日聪
 * @version 1.0.0
 * @change
    修改者      修改时间         版本       修改描述
*/
/*
rl.provided("nf:listPage");
*/
rl.importJs("lib.rpc.XHRequest");
rl.importJs("lib.data.bridge.JsonListVisitor");
rl.importJs("gui.menu.ToolBar");
rl.importJs("gui.grid.Grid");
rl.importJs("gui.box.body");
rl.importJs("gui.dialog.Dialog");

nf.clearSearchBtnOptions = {
	id : "clearSearch",
	text : "重置查询",
	iniVisible : false,
	icon : nf.mapIcon("reset_search.gif"),
	action : function(){
		var ds = nf.listPageGrid.dataSource;
		document.queryForm.reset();
		ds.pagingPosition = 1;
		ds.load();
		nf.listPageToolbar.getItemById("clearSearch").hide();
	}
};

/**
 * create standard toolbar.
 * @param {Object} options Options for toolbar.
 * @param {Array} options.items Items options.
 */
nf.createToolbar = function(options){
	var opt = rl.ext({}, options);
	if(rl.isArray(opt.items) && !opt.noMenuSplit){
		opt.items.unshift(new rl.gui.menu.MenuSplit(5));
	}
	delete opt.noMenuSplit;
	
	var toolbar = new rl.gui.menu.ToolBar(rl.ext({
		autoRenderOnReady : false
	}, opt));
	
	return toolbar;
};

/**
 * create standard grid.
 * @param {Object} options Options for grid.
 * @param {String} options.dataUrl The action to access the grid data.
 * @param {Array} options.dataFields Data fields.
 * @param {Array} options.columns Grid columns.
 * @param {String} [options.sendData = 'queryForm'] The data sent with request.
 *  Always be set to a form element(or name).
 * @param {String} [options.primaryKey] Data primary key.
 * @param {Function} [options.rowDblClickAction] Grid row dblClick action.
 */
nf.createGrid = function(options){
	var opt = rl.ext({}, options);
	var xhr = new rl.rpc.XHRequest({
		url : opt.dataUrl,
		responseType : "json",
		sendData : opt.sendData || 'queryForm',
		async : true
	});
	delete opt.dataUrl;
	delete opt.sendData;
	
	var visitor = new rl.data.JsonListVisitor({
		fields : opt.dataFields,
		rspPagesTotal : "page.total",
		rspStatus : "message",
		rspRecords : "data"
	});
	delete opt.dataFields;
	
	var dataTable = new rl.data.Table({
		primaryKey : opt.dataPrimaryKey,
		httpRequest : xhr,
		reqPagingPosition : "jp",
		reqPagingLimit : "perPage",
		pagingLimit : 40,
		dataVisitor : visitor
	});
	delete opt.dataPrimaryKey;
	
	if(rl.isArray(opt.columns) && !opt.noRowNumberingColumn){
		opt.columns.unshift(new rl.gui.grid.RowNumberer({width:20}));
	}
	delete opt.noRowNumberingColumn;
	
	var grid = new rl.Grid(rl.ext({
		dataSource : dataTable,
		enbaleMultiSelect: true,
		clickToSelect: true,
		deferRenderBody : true
	}, opt));
	
	return grid;
};

/**
 * create search dialog.
 * @param {Object} options Options for dialog.
 * @param {String} [options.title = "查询对话框"] Dialog title.
 * @param {String} [options.icon] Dialog icon. Defaults to Source view search icon.
 * @param {Array} [options.bottomBarItems] Bottom bar items options.
 * 
 */
nf.createSearchDialog = function(options){
	var opt = rl.ext({}, options);
	var searchDlg = new rl.gui.dialog.Dialog(rl.ext({
		title : "查询对话框",
		icon : nf.mapIcon("search.gif"),
		contentType : "dom",
		iniVisible : false,
		content : 'queryForm',
		bottomBarItems : [
			{
				text : "查&nbsp;&nbsp;询",
				action : function(){
					var ds = nf.listPageGrid.dataSource;
					
					ds.pagingPosition = 1;
					ds.load();
					searchDlg.hide();
					
					var btn,
						btnId = options.clearSearchBtnId || nf.clearSearchBtnOptions.id;
					if(rl.isNonNullStr(btnId)){
						btn = nf.listPageToolbar.getItemById(btnId);
						if(btn) btn.show();
					}
				}
			}
		]
	}, opt));
	
	return searchDlg;
};

/**
 * create standard list page, consists of toolbar, grid and search dialog(if need).
 * @param {Object} options Options for list page.
 * @param {String} options.toolbar Options for standard toolbar.
 * @param {String} options.grid Options for standard grid.
 * @param {String} [options.searchDialog] Options for search dialog. 
 *  No dialog would be created if it's not a object.
 */
nf.createListPage = function(options){
	nf.listPageToolbar = nf.createToolbar(options.toolbar);
	nf.listPageGrid = nf.createGrid(options.grid);	
	if(rl.isObject(options.searchDialog)){
		nf.searchDialog = nf.createSearchDialog(options.searchDialog);
	}
	
	rl.body.layoutConfig = {
		north : {
			iniSize : 30,
			comp : nf.listPageToolbar
		},
		center : {
			margin : "0 5 0 5",
			comp : nf.listPageGrid
		}
	};
};