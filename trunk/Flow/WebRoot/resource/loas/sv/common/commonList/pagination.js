/* pagination.js
defined data table list Pagination
*/
require.provide("sv.common.commonList.pagination");

var curpage=1;
var totalpages = 1;
var listAction = "list.jsp";

function setPage()
{
	if(curpage==1)
	{
		 mainForm.fp.disabled = true;
		 mainForm.pp.disabled = true;
	}
	if(curpage==totalpages)
	{
		 mainForm.np.disabled = true;
		 mainForm.lp.disabled = true;
	}
}

function firstPage()
{
	var a = curpage;
	if(a == 1)
		return;

	mainForm.reset();
	mainForm.jp.value = 1;
	mainForm.action = listAction;
	mainForm.submit();
}

function precedePage()
{
	var a = curpage;
	a = a - 1;
	if(a < 1)
		return;

	mainForm.reset();
	mainForm.jp.value = a;
	mainForm.action = listAction;
	mainForm.submit();
}

function nextPage()
{
	var a = curpage;
	var b = totalpages;
	a = a + 1;
	if(a > b)
		return;

	mainForm.reset();
	mainForm.jp.value = a;
	mainForm.action = listAction;
	mainForm.submit();
}

function lastPage()
{
	var a = curpage;
	var b = totalpages;

	if(a >= b)
		return;
		
	mainForm.reset();
	mainForm.jp.value = b;
	mainForm.action = listAction;
	mainForm.submit();
}

function goto_page(){
	if ( mainForm.jp.value == "" )
		 return;
	if ( isNaN(mainForm.jp.value) )
	{
		 mainForm.jp.value = ""
		 return;
	}

	var a = totalpages;
	var b = mainForm.jp.value;
	mainForm.reset();
	if( b == "" || b < 1 || b > a )
	{
		mainForm.jp.value = "";
		mainForm.jp.focus();
		return;
	}
	else
	{
		mainForm.jp.value = b;
		mainForm.action = listAction;
		mainForm.submit();
	}
}
function onPressEnter(evt){
	evt = (evt || window.event);
  var keyCode = evt.keyCode || evt.which || 0;
	if(keyCode == 13)goto_page();	
}
function onLimitChange(evt){
    var selIndex = mainForm.perPage.selectedIndex;
    mainForm.reset();
    mainForm.perPage.selectedIndex = selIndex;
	mainForm.action = listAction;
	mainForm.submit();
}
