/*
 * $Id: om-grid-roweditor.js,v 1.17 2012/05/07 09:36:42 chentianzhen Exp $
 * operamasks-ui omGrid 1.2
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 * 
 * Depends:
 *  om-grid.js
 *  om-button.js
 */

(function($) {
	var own = Object.prototype.hasOwnProperty,
		self;
    $.omWidget.addInitListener('om.omGrid',function(){
    	self = this;
    	
    	var $elem = self.element,
    		options = self.options,
    		colModel = options.colModel,
    		$grid = $elem.closest('.om-grid'),
    		gridHeaderCols=$('.hDiv thead tr:first th', $grid),
    		editComp,//{name:{type:组件类型,model:列对应model,instance:组件实例}}
    		lastValue;
    		
    	self._triggered = false;//是否已经触发过一次编辑了。
    	//如果所有列都不可编辑，那么_globalEditable=false,这时候所有原生的行都不可编辑，但如果此时设置了options.editMode=="insert",
    	//则新添加进来的行还是可以编辑的。
    	self._globalEditable = false;
    	
    	/**
    	 * <span style='color:red'>(作用于行编辑插件)</span>编辑模式。
    	 * 可选值为"all","insert"，默认为"all"。"all"表示所有行都是可编辑的，但如果所有的列都是不可编辑的，那么行编辑插件仍然会失效。
    	 * 如果有这样的需求，所有的行都是不可编辑的，但是此表格可以动态添加新行，而且这些新行在持久化到后台之前是可以编辑的，那么就要使用"insert"模式了。 
    	 * @name omGrid#editMode
    	 * @type String
    	 * @default "all"
    	 * @example
    	 * $('.selector').omGrid({width : 600, editMode:"insert");
    	 */
    	options.editMode = options.editMode || "all";//默认为all模式，即所有行都可以编辑
    	self._allEditMode = options.editMode=="all";
    		
    	for(var i=0,len=colModel.length; i<len; i++){
    		self._globalEditable = colModel[i]["editor"]? true : false;
    		if(self._globalEditable){
    			break;
    		}
    	}
    	
    	if(!_isEditable()){
    		return ;//不开启编辑功能，该插件任何方法都会失效。
    	}
		self._editComps = {};//缓存每一列的编辑组件，key为colModel中的name,value为{model:模型,instance:组件实例,type:类型}
		self._errorHolders = {};//  name:div   每个编辑单元格对应的出错信息容器
		self._colWidthResize;//如果grid可编辑，在拖动标题栏改变列宽时，当前并不处于编辑状态，则设置此值为true,这样在显示编辑条时由此依据要重新计算各个组件的宽度
		
		options._onRefreshCallbacks.push(_onRefresh);//只有数据刷新后才可以进行初始化
		options._omResizableCallbacks.push(_onResizable);
		
        this.tbody.delegate('tr.om-grid-row','dblclick',editRenderer); 
        this.tbody.delegate('tr.om-grid-row','click',function(event){
        	if(self._triggered && self._editView.editing){
        		if(self._validator && self._validator.valid()){
        			editRenderer.call(this);
        		}else{
        			editRenderer.call(this);
        		}
        	}
        });
        
        var btnScrollTimer;
        $elem.parent().scroll(function(){
        	if(self._triggered){
        		if(btnScrollTimer){
        			clearTimeout(btnScrollTimer);
        		}
        		btnScrollTimer = setTimeout(function(){
    				var pos = _getEditBtnPosition();
            		self._editView.editBtn.animate({"left":pos.left,"top":pos.top},self._editView.editing?"fast":0);
            		btnScrollTimer = null;
    			} , 300);
        	}
        });

      //添加行编辑插件的接口
     	$.extend($["om"]["omGrid"].prototype , {
     		/** <span style='color:red'>(作用于行编辑插件)。</span>取消编辑状态。如果当前某行正处于编辑状态，取消此次的行编辑，相当于点击了行编辑条的“取消”按钮。
     		 * @function 
     		 * @name omGrid#cancleEdit
     		 * @returns jQuery对象
     		 * @example
     		 * $(".selector").omGrid("cancleEdit");
     		 */
     		cancleEdit : 
     			function(cancleBtn/*内部使用，当点击“按钮”也会调用此方法进行处理*/){
     				var $editView = self._editView;
			    	if(!_isEditable() || !self._triggered || (self._triggered && !$editView.editing)){
			    		return ;
			    	}
			    	$editView.view.hide();
			    	$editView.editing = false;
					_resetForm();
					cancleBtn && $(cancleBtn).blur();
        		},
        	
        	/** <span style='color:red'>(作用于行编辑插件)。</span>取消当前所有未提交到后台的改变，也即恢复所有行的原始数据。
        	 * @function
        	 * @name omGrid#cancleChanges
        	 * @returns jQuery对象
        	 * @example
        	 * $(".selector").omGrid("cancleChanges");
        	 */
        	cancleChanges :
        		function(){       			
        			if(!_isEditable() || !_hasChange()){
        				return ;
        			}
        			self._changeData = {"update":{},"insert":{},"delete":{}};//清除缓存
        			_resetForm();//重置编辑表单，清除错误信息
        			self.refresh();//重用dataSource中的数据进行刷新
        		},	
        
        	/** <span style='color:red'>(作用于行编辑插件)。</span>设置某一行进入编辑状态，如果此行正处于编辑状态中，则什么也不做。如果别的行正处于编辑状态中，则取消那一行此次编辑，然后本行进入编辑状态。 
        	 * @function
        	 * @param index 行索引，从0开始 
        	 * @name omGrid#editRow
        	 * @returns jQuery对象
        	 * @example
        	 * $(".selector").omGrid("editRow" , 1);
        	 */
        	editRow : function(index){
        		if(!_isEditable()){
        			return ;
        		}
        		editRenderer.call(self._getTrs().eq(index)[0]);
        	},
        	
        	/** <span style='color:red'>(作用于行编辑插件)。</span>删除某一行，如果该行是新添加的并未保存到后台，则进行物理删除；如果该行是原本就存在的，则只是隐藏并进行标记,当调用了saveChanges后才进行物理删除。
        	 * @function
        	 * @param index 行索引，从0开始 
        	 * @name omGrid#deleteRow
        	 * @returns jQuery对象
        	 * @example
        	 * $(".selector").omGrid("deleteRow" , 0);
        	 */
        	deleteRow : function(index){
        		if(!_isEditable()){
        			return ;
        		}
        		var $tr = self._getTrs().eq(index);
        		self.cancleEdit();
        		var rowId = _getRowId($tr);
        		if($tr.attr("_insert")){
        			delete self._changeData["insert"][rowId];
        			$tr.remove();
        		}else{
        			self._changeData["delete"][rowId] = self._rowIdDataMap[rowId];
        			$tr.attr("_delete", "true");
        			$tr.hide();
        		}
        	},
 
        	/** <span style='color:red'>(作用于行编辑插件)。</span>获取所有未保存的修改。如果没有指定type,返回的是所有的修改，格式为: {update:[],insert:[],delete:[]}，如果指定了参数，如
        	 *  指定了"update"，则返回 [{},{}]
        	 * @function
        	 * @param type 可选值为："insert","update","delete" 
        	 * @name omGrid#getChanges
        	 * @returns 若指定了类型，返回[]，否则返回{update:[],insert:[],delete:[]}
        	 * @example
        	 * $(".selector").omGrid("getChanges" , "update");
        	 */
        	getChanges : function(type){
        		var data = {"update":[] , "insert":[] , "delete":[]},
        			reqType = type? type : "update",
        			changeData = self._changeData,
        			i;
        			
        		if(reqType === "update"){
        			var uData = changeData[reqType];
        			for(i in uData){
        				own.call(uData , i) && data[reqType].push($.extend(true , {} , self._rowIdDataMap[i] , uData[i]));
        			}
        			reqType = type? type : "insert";
        		}
        		if(reqType === "insert"){
        			var iData = changeData[reqType];
        			for(i in iData){
        				own.call(iData , i) && data[reqType].push(iData[i]);
        			}
        			reqType = type? type : "delete";
        		}
        		if(reqType === "delete"){
        			var dData = changeData[reqType];
        			for(i in dData){
        				own.call(dData , i) && data[reqType].push(dData[i]);
        			}
        		}
        		if(type){
        			return data[type];
        		}else{
        			return data;
        		}
        	},
     
    	 	/** <span style='color:red'>(作用于行编辑插件)。</span>在指定位置动态插入一行。
	    	 * @function
	    	 * @param index 行索引，从0开始，或为"begin","end"分别表示在表格最前和最后插入行。
	    	 * @param rowData 插入的新行的初始值
	    	 * @name omGrid#insertRow
	    	 * @returns jQuery对象
	    	 * @example
	    	 * $(".selector").omGrid("insertRow" , "end" , {id:1 , name:"飞儿"});
	    	 */
        	insertRow : function(index , rowData){
        		if(!_isEditable()){
        			return ;
        		}
        		if($.isPlainObject(index)){
        			rowData = index;
        			index = 0;
        		}
        		var $trs = self._getTrs();
        		index = ("begin"==index || index==undefined)? 0 : ("end"==index? $trs.length : index);
        		
        		//处理行数据
        		var rd = {};
        		for(var i=0,len=colModel.length; i<len; i++){
        			rd[colModel[i]["name"]] = "";//默认都为空值
            	}
        		self._changeData["insert"][self._guid] = $.extend(true , rd , rowData);
        		
        		//创建新行
        		var rowValues=self._buildRowCellValues(colModel,rd,index),
        			trContent = [],
        			rowClasses=options.rowClasses;
        			isRowClassesFn= (typeof rowClasses === 'function'),
        			rowCls = isRowClassesFn? rowClasses(index,rd):rowClasses[index % rowClasses.length],
        			tdTmp = "<td align='$' abbr='$' class='grid-cell-dirty $'><div align='$' class='$' style='width:$px'>$</div></td>";//td模板
        			    			
        		trContent.push("<tr class='om-grid-row " + rowCls + "' _grid_row_id="+(self._guid++)+" _insert='true'>");
        		$(gridHeaderCols).each(function(i){
                    var axis = $(this).attr('axis'),
                    	wrap=false,
                    	html,
                    	cols,
                    	j;
                    if(axis == 'indexCol'){
                        html="<a class='om-icon'>新行</a>";
                    }else if(axis == 'checkboxCol'){
                        html = '<span class="checkbox"/>';
                    }else if(axis.substring(0,3)=='col'){
                        var colIndex=axis.substring(3);
                        html=rowValues[colIndex];
                        if(colModel[colIndex].wrap){
							wrap=true;
						} 
                    }else{
                        html='';
                    }
                    cols = [this.align , this.abbr , axis , this.align , wrap?'wrap':'', $('div',$(this)).width() , html];
                    j=0;
                    trContent.push(tdTmp.replace(/\$/g , function(){
                    	return cols[j++];
                    }));
                });
                trContent.push("</tr>");
        		
        		var $tr = $(trContent.join(" "));
        		index==0? $tr.prependTo($elem.find(">tbody")) : $trs.eq(index-1).after($tr);
        		
        		self.editRow(index);
        	},
        	
        	/** <span style='color:red'>(作用于行编辑插件)。</span>保存客户端数据。注意，此方法不会提交请求到后台，而是会认为所有的数据改变都已经成功提交到后台去了，所以它会清除所有脏数据标志。
        	 * 一般情况下，在您自己的保存方法事件回调中，调用getChanges方法获取当前所有的改变，并自己提交到后台，然后在成功回调方法中再调用本方法。
        	 * 一旦调用本方法后，cancleChanges方法是无法对调用此方法前的所有改变起作用的。
	    	 * @function
	    	 * @name omGrid#saveChanges
	    	 * @returns jQuery对象
	    	 * @example
	    	 * $(".selector").omGrid("saveChanges");
	    	 */
        	saveChanges : function(){
    			if(!_isEditable() || !_hasChange()){
    				return ;
    			}
    			var changeData = self._changeData,
    				rowsData = self.pageData.data.rows,
    				uData = changeData["update"],
    				dData = changeData["delete"],
    				$trs = self.element.find("tr.om-grid-row"),
    				newRowsData = [];
    			for(var i in uData){
    				if(own.call(uData , i)){
    					$.extend(true , self._rowIdDataMap[i] , uData[i]);
    				}
    			}
    			$trs.each(function(index , tr){
    				var $tr = $(tr);
    				if($tr.attr("_delete")){
    					$tr.remove();
    				}else{
    					newRowsData.push(_getRowData(tr));
    				}
    			});
    			self.pageData.data.rows = newRowsData;
    			self._changeData = {"update":{},"insert":{},"delete":{}};//清除缓存
    			_resetForm();//重置编辑表单，清除错误信息
    			self.refresh();//重用dataSource中的数据进行刷新
        	},
        	/**
        	 * (覆盖)获取最新的所有数据
        	 */
        	getData : function(){
        		var result = this.pageData.data,
    				$trs = self._getTrs();
    				
        		if(_isEditable() && _hasChange()){
        			result = {total:result.total};
        			result.rows = [];
    				$trs.each(function(index , tr){
	    				result.rows.push(self._getRowData(index));
    				});
    			}
    			return result;
        	},
        	/**
        	 * (覆盖)获取最新的行数据。由于可以插入新的数据行，所以此方法要进行重写。
        	 */
        	_getRowData : function(index){
        		var $tr = this._getTrs().eq(index),
        			rowId = _getRowId($tr),
        			rowData;
        		if($tr.attr("_insert")){
        			rowData = self._changeData.insert[rowId];
        		}else{
        			var origRowData = self._rowIdDataMap[rowId],
        				uData = self._changeData["update"];
        			rowData = origRowData;
        			if(uData[rowId]){
        				rowData = $.extend(true , {} , origRowData , uData[rowId]);
        			}
        		}
        		return rowData;
        	}
     	});
		
        function editRenderer(){
        	var $tr = $(this),
        	$editRow,
        	$editForm,
        	scrollLeft;
        	
        	if(!_isEditable()){
        		return ;
        	}
        		
        	//如果是insertEditMode模式，那么除非该行是新增的，否则不可编辑，直接返回
        	if(!self._allEditMode && !$tr.attr("_insert")){
        		return ;
        	}
        	
        	//当前行正处于编辑状态，直接返回
        	if(self._triggered  
        		&& self._editView.editing
        		&& _getRowId($tr) == self._editView.rowId){
				return ;        		
        	}
        	
        	_showEditView(this);
        	$editRow = self._editView.editRow;
        	$editForm = $editRow.find(">.grid-edit-form");
        	scrollLeft = $elem.parent().scrollLeft();
        	
        	$(gridHeaderCols).each(function(index){
            	var axis = $(this).attr('axis'),
					model,
					$cell = $tr.find("td:eq("+index+")"),
					name,//编辑组件input域的名字，这是校验所必需的
					compKey;//指editComps的key
            	if(axis.substring(0,3)=='col'){
                 	var colIndex=axis.substring(3);
                 	model = colModel[colIndex];
            	}else{
            		if($.isEmptyObject(self._editComps)){//保证再次编辑其它行时不会重复添加 padding-left.
            			$editRow.css("padding-left", parseInt($editRow.css("padding-left")) + $cell.outerWidth());
            		}
            		return ;
            	}
            	var editor = model.editor;
            	if(!self._triggered){
            		//如果列不可编辑，则默认type="text"
                	//列不可编辑的条件: 
                	//(1)colModel没有editor属性
                	//(2)colModel有editor属性，并且editor有editable属性，那么editable===false则不进行编辑，或者editable为函数且返回false也不进行编辑。
    				if(!editor || 
    	            	(editor && 
    	            		(editor.editable===false || 
    	                    	($.isFunction(editor.editable) && editor.editable()===false) ) ) ){
    					var renderer = editor && editor.renderer;
    	       			model.editor = editor = {};
    	       			editor.type = "text";
    	       			if(renderer){
    	       				editor.renderer = renderer;
    	       				editor.type = "custom";
    	       			}
    	       			editor.editable = false;
    	   			}else{
    	   				editor.type = editor.type || "text";
    	   				editor.editable = true;
    	   				if(editor.rules){
    	   					self._validate = true;//只有需要检验才需要进行检验
    	   				}
    	   			}
    	   			compKey = model.editor.name || model.name;
    	   			editor.options = editor.options || {};
    	   			self._editComps[compKey] = {};
            	}else{
            		compKey = model.editor.name || model.name;
            	}
            	editComp = self._editComps[compKey];
	   			lastValue = _getLastValue($tr , model) || "";
	   			
	   			//可编辑并且可校验，添加对应的出错信息显示容器
	   			if(!self._triggered && editor.editable && editor.rules){
	   				self._errorHolders[compKey] = $("<div class='errorContainer' style='display:none'></div>").appendTo($elem.parent());
	   			}
	   			var $ins = editComp.instance,
	   				$wrapper,
	   				type = editor.type;
	   			if(!$ins){
	   				$wrapper = $("<div style='position:absolute'></div>").css({left:$cell.position().left+scrollLeft,top:3}).appendTo($editForm).addClass("grid-edit-wrapper"); 
	   				$ins = editComp.instance = $("<input></input>").attr({"name":compKey,"id":compKey}).appendTo($wrapper);
	   				if("text"!=type && "custom"!=type){//实例化组件
	   					$ins[type](editor.options);
	   				}
	   				if("omCalendar"==type || "omCombo"==type){
	   					var $parent = $ins.parent();
	   					if("omCalendar"==type){
	   						$ins.val(lastValue).width($cell.outerWidth()-24);
	   					}
	   					$ins.width($cell.outerWidth(true) - ($parent.outerWidth(true) - $ins.width()));
	   				}else{
	   					if("text"==type){
	   						$ins.addClass("grid-edit-text");
	   						if(!editor.editable){
	   							$ins.attr("readonly" , "readonly").addClass("readonly-text");
	   						}
	   					}
	   					if("custom"==type){
	   						$wrapper.html(editor.renderer(lastValue));
	   					}
	   					$ins.width($cell.outerWidth(true) - ($ins.outerWidth(true) - $ins.width()));
	   				}
	   				editComp.model = model;
					editComp.type = type;
					editComp.id = model.name;
	   			}
   				switch(type){
   					case "omCalendar":
   						$ins = $ins.val(lastValue).omCalendar();
   						break;
   					case "omNumberField":
   						$ins.val(lastValue).trigger("blur");//进行错误处理
   						break;
   					case "omCombo":
   						$ins.omCombo("value" , lastValue);
   						break;
   					case "text":
   						$ins.val(lastValue);
   						break;
   					default:;
   				}
            });
            !self._triggered && self._validate && _bindValidation();
            	
            self._validator && self._validator.form();//触发校验
        	self._triggered = true;
        }
    });
    
    function _getEditBtnPosition(){
		var $elem = self.element,
			$bDiv = $elem.parent(),
			ev = self._editView,
			$editView = ev.view,
			$editBtn = ev.editBtn,
			$editRow = ev.editRow,
			pos = {};
			
		pos.top = $editRow.height();
		if($elem.width() < $bDiv.width()){
			pos.left = $editBtn.parent().width()/2 - $editBtn.width()/2;
		}else{
			pos.left = $bDiv.scrollLeft() + $bDiv.width()/2 - $editBtn.width()/2;
		}
		return pos;
    }
    
    function _onRefresh(){
    	if(_isEditable()){
    		this._changeData = {"delete":{},"insert":{},"update":{}}; //数据改变内部缓存需要重新初始化   
    		_buildRowIdDataMap(this);
    		if(self._triggered){
				_resetForm();
				self._editView.view.hide();
				self._editView.editing = false;
				self.hDiv.scrollLeft(0);
				self.element.parent().scrollLeft(0);
    		}
    	}
	}
    
    function _isEditable(){
    	return !self._allEditMode || self._globalEditable;
    }
    
	//建立rowId与原生行数据的一一映射。
	function _buildRowIdDataMap(){
		var rowsData = self.getData().rows;
    	self._rowIdDataMap = {};
    	self._getTrs().each(function(index , tr){
    		//行的索引与原生数据的映射，方便通过rowId获取原生行的数据。
    		self._rowIdDataMap[_getRowId(tr)] = rowsData[index];
    	});
	}
	
	//重置校验表单，同时清除错误信息
	function _resetForm(){
		if(self._validator){
			self._validator.resetForm();
			//清空错误信息
			$.each(self._errorHolders,function(name , errorHolder){
    			errorHolder.empty();
			});
		}
	}
	
	function _hasChange(){
		var changeData = self._changeData;
		return !($.isEmptyObject(changeData["update"]) && $.isEmptyObject(changeData["insert"]) && $.isEmptyObject(changeData["delete"]));
	} 
	
    //显示可编辑的视图
	function _showEditView(tr){
		var $elem = self.element,
			$editView = $elem.next(".grid-edit-view"),
			$editBtn,
			$editRow,
			position = $(tr).position();
		if($editView.length == 0){
			$editView = $("<div class='grid-edit-view'><div class='body-wrapper'><div class='grid-edit-row'><form class='grid-edit-form'></form></div>"
					+"<div class='gird-edit-btn'><input type='button' class='ok' value='保存'/><input type='button' class='cancle' value='取消'/></div></div></div>")
				.width($elem.outerWidth())
				.insertAfter($elem);
			$editBtn = $editView.find(".gird-edit-btn"),
			$editRow = $editBtn.prev(".grid-edit-row"),
				pos;
			self._editView = {view:$editView , editRow:$editRow , editBtn:$editBtn};//进行缓存
			pos = _getEditBtnPosition();
			$editBtn.css({"left": pos.left,"top":pos.top});
			//绑定按钮的事件
			var $okBtn = $editBtn.find("input.ok").omButton(),
				$cancleBtn = $editBtn.find("input.cancle").omButton();
			$okBtn.click(function(){
				//这里再次进行校验，主要是由于用户如果自己设置那些编辑输入域的值是不会触发校验的
				if(self._validator && !self._validator.form()){
					return ;
				}
				//由于闭包的原因，这里不可以直接使用tr,不然永远都是指向同一个tr
				 _saveEditValue($elem.find("tr[_grid_row_id='"+self._editView.rowId+"']"));
				 $editView.hide();
				 self._editView.editing = false;
				 $okBtn.blur();
			});
			$cancleBtn.click(function(){
				self.cancleEdit(this);
			});
		}
		self._editView.rowId = _getRowId(tr);//当前正在编辑的行的id
		if(self._editView.editing){//如果当前正在编辑，那么是需要进行动画的
			$editView.animate({"top":position.top}, "fast");
		}else{
			$editView.css({"top":position.top});
			self._editView.editing = true;
			$editView.show();
			if(self._colWidthResize){
				//重新计算各个编辑组件的宽度
				var scrollLeft = $elem.parent().scrollLeft();
				$editBtn = $editView.find(".gird-edit-btn");
				$editView.width($elem.outerWidth());
				self.hDiv.find("th[axis^=col]").each(function(index , th){
					var id = $(th).attr("abbr"),
						$th = $(th);
					$.each(self._editComps , function(name , comp){
						var $ins = comp.instance,
							type = comp.type;
						if(id == comp.id){
							$ins.closest("div.grid-edit-wrapper").width($th.outerWidth()).css("left" , $th.position().left + scrollLeft);
							//改变编辑输入域组件的宽度
							if("omCalendar"==type || "omCombo"==type){
								var $parent = $ins.parent();
								if("omCalendar"==type){
			   						$ins.width($th.outerWidth()-24);
			   					}
			   					$ins.width($th.outerWidth(true) - ($parent.outerWidth(true) - $ins.width()));
							}else{
								$ins.width($th.outerWidth(true) - ($ins.outerWidth(true) - $ins.width()));
							}
						}
					});
				});
				var pos = _getEditBtnPosition();
				$editBtn.css({"left":pos.left,"top":pos.top});
				self._colWidthResize = false;
			}
		}
	}
	
	function _onResizable($th , differWidth){
    	//如果不是处于编辑状态，由于编辑条是隐藏状态的，这时候计算各个编辑组件宽度很可能会是错误的，所以非编辑状态下什么也不处理。留到显示编辑条时再做处理
    	if(!_isEditable() || !this._triggered || !this._editView.editing){
    		this._colWidthResize = true;
    		return ;
    	}
    	var ev = self._editView;
    		$editView = ev.view,
    		$editBtn = ev.editBtn;
		$editView.width(self.element.outerWidth());
		
		var $ths = self.hDiv.find("th"),
			first = true;
		self.hDiv.find("th:gt("+($ths.index($th)-1)+")").each(function(index , th){
			var id = $(th).attr("abbr"),
				$th = $(th);
			$.each(self._editComps , function(name , comp){
				var $ins = comp.instance,
					type = comp.type;
				if(id == comp.id){
					if(!first){
						$ins.closest("div.grid-edit-wrapper").css("left" , "+="+differWidth);
					}
					if(first){
						//改变编辑输入域组件的宽度
						if("omCalendar"==type || "omCombo"==type){
							var $parent = $ins.parent();
							if("omCalendar"==type){
		   						$ins.width($th.outerWidth()-24);
		   					}
		   					$ins.width($th.outerWidth(true) - ($parent.outerWidth(true) - $ins.width()));
						}else{
							$ins.width($th.outerWidth(true) - ($ins.outerWidth(true) - $ins.width()));
						}
					}
					first = false;
				}
			});
		});
		var pos = _getEditBtnPosition();
		$editBtn.animate({"left":pos.left,"top":pos.top},"fast");
    }
	
	function _saveEditValue(tr){
		var $tr = $(tr),
			$editRow = self._editView.editRow,
			comps = self._editComps,
			rowId = _getRowId($tr),
			index = self._getTrs().index($tr),
			rowData = self._getRowData(index);
			
		$.each(comps , function(name , comp){
			var key = comp.model.name,
				newValue = _getCompValue($tr , comp),
				originalValue,
				html,
				updateRowData;
				
			if($tr.attr("_insert")){
				self._changeData.insert[rowId][key] = newValue;
			}else{
				originalValue = _getRowData(tr)[key];
				updateRowData = self._changeData.update[rowId];
				if(newValue == originalValue){
					_toggleDirtyFlag($tr , comp.model , false);
					updateRowData && delete updateRowData[key];
					$.isEmptyObject(updateRowData) && delete self._changeData.update[rowId];
				}else{
					_toggleDirtyFlag($tr , comp.model , true);
					updateRowData = self._changeData.update[rowId] = updateRowData || {};
					updateRowData[key] = newValue;
				}
			}
			//更新回表格
			if(comp.model.renderer){
				html = comp.model.renderer(newValue , rowData ,index);
			}else{
				html = newValue? newValue : "";
			}
			$tr.find("td[abbr='"+key+"'] >div").html(html);
		});
	}
	
	//更换更改标志样式，show=true表示显示数据已被更改样式
	function _toggleDirtyFlag($tr , model , show){
		$tr.find("td[abbr='"+model.name+"']").toggleClass("grid-cell-dirty" , show);
	}
	
	function _getRowId(tr){
		return $(tr).attr("_grid_row_id");
	}
	
	//获取编辑条中列对应的组件的值
	function _getCompValue($tr , comp){
		var value,
			rowData = _getRowData($tr);
		switch(comp.type){
		case "omCalendar":
			value = comp.instance.val();
		case "omNumberField":
			value = comp.instance.val();
			break;
		case "omCombo":
			value = comp.instance.omCombo("value");
			break;
		case "text":
			value = comp.instance.val();
			break;
		default:
			break;	
		}
		return value;
	}
	
	//获取某列最新的值，如果是新增的，从新增里边获取，如果更新过了，从更新里边获取最新值
	function _getLastValue($tr , model){
		var value,
			name = model.name;
		if($tr.attr("_insert")){
			//新增的话从insert里边拿到最新的值
			value = _getRowData($tr)[name];
		}else{
			var updateData = self._changeData.update[_getRowId($tr)];
			if(updateData && updateData[name] != null){//此数据被更新过了
				value = updateData[name];//最新值
			}else{//获取原始值
				value = _getRowData($tr)[name];
			}
		}
		return value;
	}
	
	//获取原始行数据，如果是新添加进去的，获取的是新添加进去的行数据
	function _getRowData(tr){
		var rowId = _getRowId(tr);
		return $(tr).attr("_insert")?self._changeData.insert[rowId] : self._rowIdDataMap[rowId];
	}
	
	function _bindValidation(){
		var $editForm = self._editView.editRow.find(">.grid-edit-form"),
			valiCfg = {},
			rules = valiCfg.rules = {},
			messages = valiCfg.messages = {},
			colModel = self.options.colModel;
		$.each(colModel , function(index , model){
			var customRules = model.editor.rules;
			if(customRules){
				var r = rules[model.editor.name || model.name] = {},
					msg = messages[model.editor.name || model.name] = {};
				if(customRules.length>0 && !$.isArray(customRules[0])){
					var temp = [];
					temp.push(customRules);//包装成[[],[]]这种统一形式
					customRules = temp;
				}
				for(var i=0,len=customRules.length; i<len; i++){
					var name = customRules[i][0];//检验类型
					r[name]  = customRules[i][1] == undefined? true : customRules[i][1]; //没有定义值的统一传 true
					if(customRules[i][2]){
						msg[name] = customRules[i][2];
					}
				}
			}
		});	
		
		$.extend(valiCfg , {
			onkeyup : function(element){
				this.element(element);
			},
			//必须覆盖此方法，不然会默认生成错误信息容器，而错误信息的产生已经在showErrows处理了，所以此方法什么也不做
			errorPlacement : function(error, element){
			},
			showErrors : function(errorMap, errorList){
				if(errorList && errorList.length > 0){
		        	$.each(errorList,function(index,obj){
		        		var $elem = $(obj.element),
		        			name = $elem.attr("name");
		        		var errorHolder = self._errorHolders[name];
		        		if(errorHolder){
		        			var docPos = $elem.offset(),
		        				tablePos = self.element.offset();
		        			errorHolder.css({left:docPos.left-tablePos.left+$elem.outerWidth(),top:docPos.top-tablePos.top+$elem.outerHeight()}).html(obj.message);
		        			if($elem.is(":focus")){
		        				errorHolder.show();
		        			}
		        		}
	 	            });
		    	}else{
		    		$.each(this.currentElements , function(index , elem){
		    			var errorHolder = self._errorHolders[$(elem).attr("name")];
		    			errorHolder && errorHolder.empty().hide();
		    		});
		    	}
		    	//处理"保存"按钮的状态
		    	var $okBtn = self._editView.editBtn.find("input.ok"),
		    		correct = true;
		    	$.each(self._errorHolders,function(name , errorHolder){
		    		if(!errorHolder.is(":empty")){
		    			return correct = false;
		    		}
		    	});
		    	correct ? $okBtn.omButton("enable"): $okBtn.omButton("disable");
		    	this.defaultShowErrors();
			}
		});
		self._validator = $editForm.validate(valiCfg);
		
		//绑定鼠标事件
		$.each(self._editComps , function(name , comp){
			var editor = comp.model.editor;
			if(editor.editable && editor.rules){
				var key = editor.name || comp.model.name,
					errorHolder = self._errorHolders[key];
				comp.instance.mouseover(function(){
					if(errorHolder && !errorHolder.is(":empty")){
						errorHolder.show();
					}
				})
				.mouseout(function(){
					errorHolder && errorHolder.hide();
				});
			}
		}); 
	}
})(jQuery);