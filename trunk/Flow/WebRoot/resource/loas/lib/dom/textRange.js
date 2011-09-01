/***************************************************************
textRange.js
manage textRange
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.dom.textRange");

EL.TextRange = {
	/*
	():
		{boolean} EL.TextRange.selectionRange({HTMLElement} ele, {int} start, {int} end)
	DES:
		set Selection Range;return true if success;
	*/
  selectRange : function(ele, start, end) {
    if(!WIN.isElement(ele))return false;
		start = isNaN(start) ? 0 : start;
		end = isNaN(end) ? 0 : end;
    var re = false;
		if (ele.setSelectionRange) {
			ele.focus();
			ele.setSelectionRange(start, end);
			re = true;
    }
		else if (ele.createTextRange) {
			var range = ele.createTextRange();

			range.collapse(true);
			range.moveEnd("character", end);
			range.moveStart("character", start);
			range.select();
			
			re = true;
    }
		return re;
	}
};
WIN.extend(EL.TextRange,{
	/*
	():
		{boolean} EL.TextRange.moveCursorEnd({HTMLElement} ele, {int} end)
	DES:
		move Cursor to end of SelectionRange.
	*/
  moveCursorEnd : function(ele, end){
		return EL.TextRange.selectRange(ele, end, end);
	},
	/*
	():
		{boolean} EL.TextRange.moveCursorStart({HTMLElement} ele)
	DES:
		move Cursor to begin of SelectionRange.
	*/
  moveCursorStart : function(ele){
		return EL.TextRange.selectRange(ele, 0, 0);
	}
});
