/*
 * $Id: om-grid-rowexpander.js,v 1.5 2012/03/15 06:14:47 linxiaomin Exp $
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
 */

(function($) {
    $.omWidget.addInitListener('om.omGrid',function(){
        var self=this,
            rowDetailsProvider=self.options.rowDetailsProvider; //渲染行详情的function
        if(!rowDetailsProvider){
            return;
        }
        $('tr th:eq(0)',self.thead).before('<th align="center" axis="expenderCol" class="expenderCol"><div style="text-align: center; width: 14px;"></div></th>');
        //修正各列宽度
        var autoExpandColIndex = -1,
            cm=self.options.colModel,
            allColsWidth=0;
        for(var i=0,len=cm.length;i<len;i++){
            if(cm[i].width=='autoExpand'){
                autoExpandColIndex = i;
            }else{
                allColsWidth+=cm[i].width;
            }
        }
        if(autoExpandColIndex != -1){ //说明有某列要自动扩充
            var toBeExpandedTh = self.thead.find('th[axis="col'+autoExpandColIndex+'"]>div');
            toBeExpandedTh.width(toBeExpandedTh.width()-self.thead.find('th[axis="expenderCol"]').width());
        }else if(self.options.autoFit){
            var percent=self.thead.find('th[axis="expenderCol"]').width()/allColsWidth,
                toFixedThs=tr.find('th[axis^="col"]>div');
            toFixedThs.each(function(index){
                $(this).css('width',parseInt($(this).width()-cm[index].width*percent));
            });
        }
        var colCount=$('tr th',self.thead).size();//总共列数
        self.tbody.delegate('tr td.expenderCol>div','click',function(event){
            var _this=$(this),
                thisRow=_this.closest('tr'),
                nextTr=thisRow.next('tr');
            if(nextTr.hasClass('rowExpand-rowDetails')){ //已经构造过了，直接显示/隐藏
                nextTr.toggle();
            }else{ //没有构造过，则构造并显示
                var rowIndex=thisRow.index('tr.om-grid-row'),
                    rowData=self._getRowData(rowIndex),
                    rowDetails=rowDetailsProvider?rowDetailsProvider(rowData,rowIndex):'&#160;';
                thisRow.after('<tr class="rowExpand-rowDetails"><td colspan="'+(colCount-1)+'"><div class="rowExpand-rowDetails-content">'+rowDetails+'</div></td></tr>');
            }
            if(_this.hasClass('rowExpand-expanded')){
                _this.removeClass('rowExpand-expanded').parent().attr('rowspan',1);
            }else{
                _this.addClass('rowExpand-expanded').parent().attr('rowspan',2);
            }
            return false; //不触发onRowSelect和onRowClick事件
        });
    });
})(jQuery);