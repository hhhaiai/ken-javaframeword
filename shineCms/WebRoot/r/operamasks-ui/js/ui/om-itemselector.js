/*
 * $Id: om-itemselector.js,v 1.8 2012/03/15 06:14:47 linxiaomin Exp $
 * operamasks-ui omCombo 1.1
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or LGPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-core.js
 *  om-mouse.js
 *  om-sortable.js
 */
;(function($) {
    /**
     * @name omItemSelector
     * @class 左移右移组件。两个多选列表框，可以从左边将一些item移到右边，也可以从右边将一些item移到左边。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用本地数据源，也可以使用远程数据源</li>
     *      <li>支持鼠标拖动排序操作</li>
     *      <li>包含常用的【左移】【右移】【全部左移】【全部右移】【上移】【下移】【置顶】【置底】操作</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#itemselector').omItemSelector({
     *         dataSource:[
     *                  {text:'Java',value:'1'},
     *                  {text:'JavaScript',value:'2'},
     *                  {text:'C',value:'3'},
     *                  {text:'PHP',value:'4'},
     *                  {text:'ASP',value:'5'}
     *         ],
     *         width:250,
     *         height:200
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;div id="itemselector"/>
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.omWidget('om.omItemSelector', {
        options: /** @lends omItemSelector#*/{
             /**
              * 组件宽度。
              * @type String
              * @default '250px'
              * @example
              * width : '300px'
              */
             width : '250px',
             /**
              * 组件高度。
              * @type String
              * @default '200px'
              * @example
              * height : '300px'
              */
            height : '200px',
            /**
              * 数据源属性，可以设置为“后台获取数据的URL”或者“JSON数据”
              * @type Array[JSON],URL
              * @default []
              * @example
              * dataSource : '/data/items.json' 
              * 或者
              * dataSource : [{"value":"001","text":"张三"},{"value":"002","text":"李四"}]
              * 或者下面这种(这种非标准的itemData一定要配合clientFormatter使用)
              * dataSource : [{"value":"001","name":"张三"},{"value":"002","name":"李四"}]
              */
            dataSource : [],
            /**
              * 初始值。如dataSource:[{text:'abc',value:1},{text:'def',value:2},{text:'xyz',value:3}]且value:[2]，则左边显示1、3两条，右边显示第2条。
              * @type Array[JSON]
              * @default []
              * @example
              * value : [1,3]
              */
            value : [],
            /**
              * 每个dataSource中每个item如何显示到列表中。默认仅显示item数据的text属性值。
              * @type Function
              * @default 无
              * @example
              * //对于{text:'中国',value:'zh_CN'}将显示成'中国(zh_CN)'这样
              * clientFormatter  : function(itemData,index){
              *     return itemData.text+'('+itemData.value)+')';//返回一段html代码
              * }
              * 
              * //对于{name:'张三',role:'经理',value:'PM'}将显示成红色的'张三(经理)'这样
              * //对于{name:'李四',role:'普通员工',value:'EMP'}将显示成黑色的'李四'这样
              * clientFormatter  : function(itemData,index){
              *     if(itemData.role=='经理'){
              *         return '&lt;font color="red">'+itemData.name+'('+itemData.value)+')&lt;/font>';
              *     }else{
              *         return itemData.name;
              *     }
              * }
              */
            clientFormatter : false,
            /**
              * 左边可选项的标题。
              * @name omItemSelector#availableTitle
              * @type String
              * @default '可选项'
              * @example
              * availableTitle : '可加入的用户组'
              */
            //availableTitle : $.om.lang.omItemSelector.availableTitle,
            /**
              * 右边已选项的标题。
              * @name omItemSelector#selectedTitle
              * @type String
              * @default '已选项'
              * @example
              * selectedTitle : '已加入的用户组'
              */
            //selectedTitle : $.om.lang.omItemSelector.selectedTitle,
            /**
              * 是否自动排序。设为true后每次将item左移或右移时将会对item进行排序（按照dataSource中数据源的顺序）。<b>注意：启用此功能后将无法使用拖动排序功能，也不会显示【上移】【下移】【置顶】【置底】这几个按钮。</b>
              * @type Boolean
              * @default false
              * @example
              * autoSort : true
              */
            autoSort : false,
            /**
              * 给Ajax返回的原始数据的进行预处理的函数。其中参数data是服务器返回的数据。
              * @type Function
              * @field
              * @default 无
              * @example
              * preProcess  : function(data){
              *     return data;//这里返回处理后的数据
              * }
              */
            preProcess : function(data){
                return data;
            },
            /**
              * 工具栏显示哪些功能图标。各图标的序号分别是：<ul>
              *     <li>0：留下空白区域</li>
              *     <li>1：“全部右移”图标</li>
              *     <li>2：“右移”图标</li>
              *     <li>3：“左移”图标</li>
              *     <li>4：“全部左移”图标</li>
              *     <li>5：“置顶”图标</li>
              *     <li>6：“上移”图标</li>
              *     <li>7：“下移”图标</li>
              *     <li>8：“置底”图标</li>
              * </ul>。比如：<br/><ul>
              *     <li>[2,3]表示仅显示“右移”图标和“左移”图标，且“右移”图标在前“左移”图标在后。</li>
              *     <li>[3,2]表示仅显示“右移”图标和“左移”图标，且“左移”图标在前“右移”图标在后。</li>
              *     <li>[1,2,3,4,5,6,7,8]表示显示所有图标，且按上面序号标示的顺序。</li>
              *     <li>[1,2,3,4,0,5,6,7,8]表示显示所有图标，且按上面序号标示的顺序，其中“全部左移”和“置顶”之间有个空白区域。</li>
              *     <li>[1,0,2,0,3,0,4]表示显示“全部右移”、“右移”、“左移”、“全部左移”4个图标，且任意两个之间都有个空白区域。</li>
              * </ul>
              * @type Arrat[Number]
              * @default [1,2,3,4]
              * @example
              * toolbarIcons : [1,2,0,3,5,6,7,8]
              */
            toolbarIcons : false,
            /**
             * 以Ajax方式加载数据出错时的回调函数。可以在这里进行一些处理，比如以人性化的方式提示用户。
             * @event
             * @param xmlHttpRequest XMLHttpRequest对象
             * @param textStatus  错误类型
             * @param errorThrown  捕获的异常对象
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onError:function(xmlHttpRequest, textStatus, errorThrown,event){ 
             *      alert('取数出错');
             *  } 
             */
            onError : jQuery.noop,
            /**
             * 以Ajax方式加载数据成功时的回调函数。此方法在渲染可选项item之前执行。
             * @event
             * @param data Ajax请求返回的数据
             * @param textStatus 响应的状态
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onSuccess:function(data, textStatus, event){
             *     if(data.length==0){
             *          alert('没有数据！');
             *     } 
             * }
             */
            onSuccess : jQuery.noop,
            /**
             * 从左边将item移到右边之前执行的动作。如果返回false，则item不会进行移动。用户可以在这个事件中进行一些其它有用的处理，比如监听此方法然后return selectedItems.length &lt; 3就能实现“最多只能选择3个item”的功能
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onBeforeItemSelect:function(itemDatas,event){
             *     alert('即将加入到:'+itemDatas.length+'个群中');
             * }
             */
            onBeforeItemSelect : jQuery.noop,
            /**
             * 从右边将item移到左边之前执行的动作。如果返回false，则item不会进行移动。用户可以在这个事件中进行一些其它有用的处理，比如能实现“员工是基本角色，不可以退出该角色”的功能
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onBeforeItemDeselect:function(itemDatas,event){
             *     $.each(itemDatas,function(index,data){
             *         if(data.text=='员工'){
             *             alert('员工是基本角色，不可以退出该角色！');
             *             return false;
             *         } 
             *     });
             * }
             */
            onBeforeItemDeselect : jQuery.noop,
            /**
             * 从左边将item移到右边之后执行的动作。
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onItemSelect:function(itemDatas,event){
             *      alert('你刚刚选择了'+itemDatas.length+'个条目');
             * }
             */
            onItemSelect : jQuery.noop,
            /**
             * 从右边将item移到左边之后执行的动作。
             * @event
             * @param itemDatas 正在移动的item对应的数据组成的数组，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemDatas是[{text:'A',value:0}]；移动B时itemDatas是[{text:'B',value:1}]，同时移动A、B时itemDatas是[{text:'A',value:0},{text:'B',value:1}]
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onItemDeselect :function(itemDatas,event){
             *      alert('你刚刚去掉了'+itemDatas.length+'个条目');
             * }
             */
            onItemDeselect  : jQuery.noop,
            /**
             * 改变排序之后执行的动作。
             * @event
             * @param itemData 正在移动的item对应的数据，比如dataSource是[{text:'A',value:0},{text:'B',value:1}]，则移动A时itemData是{text:'A',value:0}；移动B时itemData是{text:'B',value:1}
             * @param oldIndex 原来的序号（从0开始）
             * @param newIndex 新的序号（从0开始）
             * @param event jQuery.Event对象
             * @type Function
             * @example
             * onSort :function(itemData,oldIndex,newIndex,event){
             *      alert('你刚刚将：'+itemData.text+'从第'+(oldIndex+1)+'行移到了第'+(newIndex+1)+'行');
             * }
             */
            onSort  : jQuery.noop
        },
        _create:function(){
            this.element.addClass('om-itemselector om-widget').html('<table style="height:100%;width:100%" cellpadding="0" cellspacing="0"><tr><td class="om-itemselector-leftpanel"></td><td class="om-itemselector-toolbar"></td><td class="om-itemselector-rightpanel"></td></tr></table>');
            var tds=$('td',this.element);
            this.leftPanel=$('<fieldset><legend class="om-itemselector-title"><span></span></legend><div class="om-itemselector-items"><dl></dl></div></fieldset>').appendTo(tds.eq(0));
            this.toolbar=$('<div></div>').appendTo(tds.eq(1));
            this.rightPanel=this.leftPanel.clone().appendTo(tds.eq(2));
        },
        _init:function(){
            var op=this.options,
                dataSource=op.dataSource;
            $('>legend>span',this.leftPanel).html($.om.lang._get(op,"omItemSelector","availableTitle"));
            $('>legend>span',this.rightPanel).html($.om.lang._get(op,"omItemSelector","selectedTitle"));
            this.element.css({width:op.width,height:op.height});
            this._buildToolbar();
            this._resizeFieldSet(); //调整左右fieldset大小
            this._bindEvents();
            if(typeof dataSource ==='string'){
                var self=this;
                $.ajax({
                    url: dataSource,
                    method: 'GET',
                    dataType: 'json',
                    success: function(data, textStatus){
                        if (self._trigger("onSuccess",null,data,textStatus) === false) {
                            return;
                        }
                        data=op.preProcess(data);
                        op.dataSource=data;
                        self._buildList();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                    	self._trigger("onError",null,XMLHttpRequest, textStatus, errorThrown);
                    }
                });
            }else{
                this._buildList();
            }
        },
        _buildToolbar:function(){
            var op=this.options,
                toolbarIcons=op.toolbarIcons,
                autoSort=op.autoSort,
                html='',
                ALL_ICONS=['space','addAll','add','remove','removeAll','moveTop','moveUp','moveDown','moveBottom'];
            if(!jQuery.isArray(toolbarIcons)){
                toolbarIcons=[1,2,3,4];
            }
            $.each(toolbarIcons,function(index,data){
                var icon=ALL_ICONS[data],title;
                if(!icon || (autoSort&&data>3) ){
                    //toolbar序号不对不显示图标，autoSort=true时不显示排序图标
                }else{
                    html+='<div class="om-icon om-itemselector-tbar-'+icon+'"'+' title="'+($.om.lang._get({},"omItemSelector",icon+'IconTip') || '')+'"></div>';
                }
            });
            this.toolbar.html(html);
        },
        _resizeFieldSet:function(){
            var lp=this.leftPanel,
                rp=this.rightPanel,
                leftItemsContainer=$('.om-itemselector-items',lp),
                rightItemsContainer=$('.om-itemselector-items',rp),
                H=lp.parent().innerHeight()-leftItemsContainer.offset().top+lp.offset().top,
                W=($('tr',this.element).innerWidth()-this.toolbar.outerWidth())/2,
                innerW=lp.outerWidth(W).innerWidth();
            leftItemsContainer.outerHeight(H).width(innerW);
            rightItemsContainer.outerHeight(H).width(innerW);
        },
        _buildList:function(){
            var op=this.options;
                dataSource = op.dataSource,
                value = op.value,
                fmt=op.clientFormatter,
                leftHtml='',
                rightHtml='',
                // {text:'abc',value:2}的value是否在value:[0,2,4]这样的数组中
                inArray=function(data,valueArr){
                    for(var i=0,len=valueArr.length;i<len;i++){
                        if(data.value===valueArr[i]){
                            return true;
                        }
                    }
                    return false;
                },
                buildHtml=fmt?function(index,data){
                    return '<dt _index="'+index+'">'+fmt(data,index)+'</dt>';
                }:function(index,data){
                    return '<dt _index="'+index+'">'+data.text+'</dt>';
                };
            if($.isArray(dataSource) && jQuery.isArray(value)){
                $.each(dataSource,function(index,data){
                    if(inArray(data,value)){//在value中，要放到右边
                        rightHtml+=buildHtml(index,data);
                    }else{//不在value中,放到左边
                        leftHtml+=buildHtml(index,data);
                    }
                });
            }
            $('.om-itemselector-items>dl',this.leftPanel).html(leftHtml);
            $('.om-itemselector-items>dl',this.rightPanel).html(rightHtml);
            this._makeDraggable();
        },
        _makeDraggable:function(){
            var self=this,
                autoSort=this.options.autoSort,
                allItems=$('.om-itemselector-items>dl',this.element);
            allItems.attr('onselectstart',"javascript:return false;");//禁止选择鼠标拖动文字
            if(!autoSort){
                allItems.sortable({
                    placeholder:'om-itemselector-placeholder',
                    start:function(ui,event){
                        $('.om-itemselector-items>dl>dt',self.element).removeClass('om-state-highlight');
                        ui.item.addClass('om-state-highlight');
                        ui.item.oldIndex = ui.item.index(); 
                    },
                    stop:function(ui,event){
                    	self._trigger("onSort",null,self.options.dataSource[ui.item.attr('_index')],ui.item.oldIndex,ui.item.index());
                    }
                }).disableSelection();
            }
        },
        _bindEvents:function(){
            var self=this,
                toolbar=this.toolbar,
                op=this.options;
            this.leftPanel.delegate('.om-itemselector-items>dl>dt','click.omItemSelector',function(){
                $('.om-itemselector-items>dl>dt',self.element).removeClass('om-state-highlight');
                $(this).addClass('om-state-highlight');
            });
            this.rightPanel.delegate('.om-itemselector-items>dl>dt','click',function(){
                $('.om-itemselector-items>dl>dt',self.element).removeClass('om-state-highlight');
                $(this).addClass('om-state-highlight');
            });
            //双击
            this.leftPanel.delegate('.om-itemselector-items>dl>dt','dblclick',function(){
                self._moveItemsToTarget('.om-state-highlight',true);
            });
            this.rightPanel.delegate('.om-itemselector-items>dl>dt','dblclick',function(){
                self._moveItemsToTarget('.om-state-highlight',false);
            });
            //右移
            $('.om-itemselector-tbar-add',toolbar).click(function(){
                self._moveItemsToTarget('.om-state-highlight',true);
            });
            //左移
            $('.om-itemselector-tbar-remove',toolbar).click(function(){
                self._moveItemsToTarget('.om-state-highlight',false);
            });
            //全部右移
            $('.om-itemselector-tbar-addAll',toolbar).click(function(){
                self._moveItemsToTarget('',true);
            });
            //全部左移
            $('.om-itemselector-tbar-removeAll',toolbar).click(function(){
                self._moveItemsToTarget('',false);
            });
            //autoSort=false时才可以排序
            if(!op.autoSort){
                var selector='.om-itemselector-items>dl>dt.om-state-highlight:first';
                //置顶
                $('.om-itemselector-tbar-moveTop',toolbar).click(function(){
                    var panel=self.rightPanel,
                        selectedItems=$(selector,panel);
                    if(selectedItems.size()==0){
                        panel=self.leftPanel;
                        selectedItems=$(selector,panel);
                    }
                    var oldIndex=selectedItems.index();
                    if(selectedItems.size()==0 || oldIndex==0)
                        return;
                    selectedItems.prependTo($('.om-itemselector-items>dl',panel));
                    self._trigger("onSort",null,op.dataSource[selectedItems.attr('_index')],oldIndex,0);
                });
                //置底
                $('.om-itemselector-tbar-moveBottom',toolbar).click(function(){
                    var panel=self.rightPanel,
                        selectedItems=$(selector,panel);
                    if(selectedItems.size()==0){
                        panel=self.leftPanel;
                        selectedItems=$(selector,panel);
                    }
                    var oldIndex=selectedItems.index(),
                        newIndex=selectedItems.siblings().size();
                    if(selectedItems.size()==0 || oldIndex==newIndex)
                        return;
                    selectedItems.appendTo($('.om-itemselector-items>dl',panel));
                    self._trigger("onSort",null,op.dataSource[selectedItems.attr('_index')],oldIndex,newIndex);
                });
                //上移
                $('.om-itemselector-tbar-moveUp',toolbar).click(function(){
                    var panel=self.rightPanel,
                        selectedItems=$(selector,panel);
                    if(selectedItems.size()==0){
                        panel=self.leftPanel;
                        selectedItems=$(selector,panel);
                    }
                    var oldIndex=selectedItems.index();
                    if(selectedItems.size()==0 || oldIndex==0)
                        return;
                    selectedItems.insertBefore(selectedItems.prev());
                    self._trigger("onSort",null,op.dataSource[selectedItems.attr('_index')],oldIndex,oldIndex-1);
                });
                //下移
                $('.om-itemselector-tbar-moveDown',toolbar).click(function(){
                    var panel=self.rightPanel,
                        selectedItems=$(selector,panel);
                    if(selectedItems.size()==0){
                        panel=self.leftPanel;
                        selectedItems=$(selector,panel);
                    }
                    var oldIndex=selectedItems.index();
                    if(selectedItems.size()==0 || oldIndex==selectedItems.siblings().size())
                        return;
                    selectedItems.insertAfter(selectedItems.next());
                    self._trigger("onSort",null,op.dataSource[selectedItems.attr('_index')],oldIndex,oldIndex+1);
                });
            }
        },
        _moveItemsToTarget:function(selector,isLeftToRight){
            var formPanel=isLeftToRight?this.leftPanel:this.rightPanel,
                selectedItems=$('.om-itemselector-items>dl>dt'+selector,formPanel);
            if(selectedItems.size()==0)
                return;
            var toPanel=isLeftToRight?this.rightPanel:this.leftPanel,
                op=this.options,
                itemData=[];
            selectedItems.each(function(){
                itemData.push(op.dataSource[$(this).attr('_index')]);
            });
            //先触发onBeforeItemSelect或onBeforeItemDeselect事件，然后移动并触发onItemSelect或onItemDeselect事件
            if(isLeftToRight){
                if(this._trigger("onBeforeItemSelect",null,itemData)===false){
                    return;
                }
                selectedItems.appendTo($('.om-itemselector-items>dl',toPanel));
                this._trigger("onItemSelect",null,itemData);
            }else{
                if(this._trigger("onBeforeItemDeselect",null,itemData)===false){
                    return;
                }
                selectedItems.appendTo($('.om-itemselector-items>dl',toPanel));
                this._trigger("onItemDeselect",null,itemData);
            }
            //如果设了autoSort=true则自动排序
            if(op.autoSort){
                var result=$('.om-itemselector-items>dl>dt',toPanel).sort(function(a,b){
                    return $(a).attr('_index')-$(b).attr('_index');
                });
                selectedItems.parent().append(result);
            }
        },
        
        /**
         * 得到或设置组件的value值。
         * @function
         * @name omItemSelector#value
         * @param v 设置的值，不设置表示获取值
         * @returns 如果没有参数时表示getValue()返回combo的value值，比如dataSource:[{text:'abc',value:true},{text:'def',value:2},{text:'xyz',value:'x'}]选择了第2条和第三条，则getValue返回[2,'x']。如果有参数时表示setValue(newValue)返回jQuery对象。
         * 
         */
        value:function(newValue){
            if(arguments.length==0){ //getValue
                var op=this.options,
                    selectedItems=$('.om-itemselector-items>dl>dt',this.rightPanel),
                    returnValue=[];
                selectedItems.each(function(){
                    returnValue.push(op.dataSource[$(this).attr('_index')].value);
                });
                return returnValue;
            }else{ //setValue
                if($.isArray(newValue)){
                    this.options.value=newValue;
                    this._buildList();
                }
            }
        }
    });
})(jQuery);