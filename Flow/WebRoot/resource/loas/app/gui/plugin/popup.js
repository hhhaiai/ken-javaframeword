//ensure that we has provided this resource so it wont be downloaded again.
require.provide("app.gui.plugin.popup");
// JavaScript Document
/***************************************************
//
// 说明：Popup管理
// 日期：2005-1-5
// 作者：dotey(宝玉)
// 版权：CnForums.Net，请保留此版权信息
// 
// update:11:10 2008-1-21
// NewlineReplace(NewlineReplace(msg)) -> NewlineReplace((msg)) ;
// xml 文件标签已转义。
***************************************************/
// 队列
function Queue()
{   
    var items = new Array();

    var first = 0;
    var count = 0;

	// 队列大小
	// 
    this.Count = function()
    {
        return count;
    } ;

	// 取队列头/尾
	//
    this.Peek = function(last)
    {
        var result = null;

        if (count > 0)
        {
            if (null != last && true == last)
                result = items[first + (count - 1)];
            else
                result = items[first];
        }

        return result;
    };

	// 入列
	// 
    this.Enqueue = function(x)
    {
        items[first + count] = x;

        count++;
        return x;
    };

	// 出列
	//
    this.Dequeue = function()
    {
        var result = null;

        if (count > 0)
        {
            result = items[first];

            delete items[first];
            first++;
            count--;
        }

        return result;
    };
}


var newlineRegExp = new RegExp("(\r\n|\n|\r)", "g");

function NewlineReplace(str)
{
    result = "";

    if (str != null)
        result = str.replace(newlineRegExp, "<br>");

    return result;
}

var entityList = new Array();
entityList["<"] = "&lt;";
entityList["\uff1c"] = "&lt;";
entityList[">"] = "&gt;";
entityList["\uff1e"] = "&gt;";
entityList["&"] = "&amp;";
entityList["\uff06"] = "&amp;";
entityList["\""] = "&quot;";
entityList["\uff02"] = "&quot;";

function EntityReplace(str)
{
    var result = "";

    if (str != null)
    {
        var len = str.length;

        var i = 0;

        while (i < len)
        {
            var j = i;

            var e = entityList[str.charAt(j)];

            while (j < len && null == e)
            {
                j++;

                e = entityList[str.charAt(j)];
            }

            result += str.substr(i, j - i);

            if (e != null)
            {
                result += e;

                j++;
            }

            i = j;
        }
    }

    return result;
}

function GetPopupCssText()
{
	var styles = document.styleSheets;
	var csstext = "";
	for(var i=0; i<styles.length; i++)
	{
		if (styles[i].id == "popupmanager")
			csstext += styles[i].cssText;
	}
	return csstext;
}

function PopupWin(winID)
{
	this.Win = document.getElementById(winID);
	this.Menu = document.getElementById(winID + "_Menu");
	this.Icon = document.getElementById(winID + "_Icon");
	this.MenuButton = document.getElementById(winID + "_MenuButton");
	this.CloseButton = document.getElementById(winID + "_CloseButton");
	this.Caption = document.getElementById(winID + "_Caption");
	this.CaptionText = document.getElementById(winID + "_CaptionText");
	this.Body = document.getElementById(winID + "_Body");
	this.BodyText = document.getElementById(winID + "_BodyText");
}

function Popup(winID, message, icon, title, func)
{
	this.PostID;
	this.URL;
	this.Type = "Mail";	// Mail,Thread,Post,Message
	this.win = new PopupWin(winID);
	this.popup = null;
	this.popupMenu = null;
	this.PopupManager = null;
	this.showTime = null;
	this.func = func;
	this.isMouseOver = false;
	this.CreateBody = Popup_CreateBody;
	this.Close = Popup_Close;
	this.Hide = Popup_Hide;
	this.Show = Popup_Show;
	this.ShowTime = Popup_ShowTime;
	this.aspxl = this.CreateBody(message, icon, title);
}

function Popup_Close()
{
	if (this.popup != null)
		this.popup.document.onmouseover = null;
	else
		this.win.Win.onmouseover = null;

	this.isMouseOver = false;
	this.ShowTime = function()
	{
		return 7;
	}

	this.Hide();
}

function Popup_Hide()
{
	if (this.popup != null && this.popup.isOpen)
	{
		this.popup.hide();
	}

	this.popup = null;
}

function Popup_ShowTime()
{
	var result = null;

	if (this.showTime != null)
	{
		var now = new Date();

		result = (now - this.showTime)/1000;
	}

	return result;
}

// 
function OnClickClose_Popup()
{
	var p = this.getAttribute("popup");
	p.Close();
}

function OnClickMenu_Popup()
{
	var p = this.getAttribute("popup");
	if (p.popupMenu == null)
	{
		p.popupMenu = p.popup.document.parentWindow.createPopup(); 
		var d = p.popupMenu.document;
		var s = d.createStyleSheet();
		s.cssText = GetPopupCssText();
		var b = d.body;
		b.rightmargin = 0;
		b.leftmargin = 0;
		b.topmargin = 0;
		b.bottommargin = 0;
		b.innerHTML = p.win.Menu.outerHTML;
		b.style.cursor = "default";
		b.oncontextmenu = OnContextMenu_Popup;
		b.onmouseover = OnMouseOver_PopupMenu;
		b.onmouseout = OnMouseOut_PopupMenu;
		b.setAttribute("popup", p);
		var menuDisable = d.getElementById(p.win.Win.id + "_Menu_Disable");
		menuDisable.onclick = OnClickDisable_PopupMenu;
		menuDisable.setAttribute("popup", p);
		var menuSetting = d.getElementById(p.win.Win.id + "_Menu_Setting");
		menuSetting.onclick = OnClickSetting_PopupMenu;
		menuSetting.setAttribute("popup", p);
	}
	var toastWidth = p.win.Menu.offsetWidth - 4;
	var toastHeight = p.win.Menu.offsetHeight - 4;
	var toastVerticalMargin = 20;
	var toastHorizontalMargin = 0;
	p.popupMenu.show(toastHorizontalMargin, toastHeight - toastVerticalMargin + 4 , toastWidth, toastHeight, p.win.MenuButton);
}

function OnClick_Popup()
{
	var p = this.getAttribute("popup");

	if (p != null && p.func != null &&  p.func != "" )
	{
		p.func(p);
	}
}

function OnClickDisable_PopupMenu()
{
	var cmd = this.getAttribute("cmd");
	var p = this.getAttribute("popup");
	try{
		eval(cmd);
		if (p != null)
		{
			p.PopupManager.Disabled = true;
			p.Close();
		}
	}catch(e){alert(e);}

}

function OnClickSetting_PopupMenu()
{
	var cmd = this.getAttribute("cmd");
	var p = this.getAttribute("popup");
	try{
		eval(cmd);
		if (p != null) p.Close();
	}catch(e){}
/*
	var url = this.getAttribute("URL");
	var p = this.getAttribute("popup");

	if (url != null)
	{
		window.open(url,"mainFrame");
		if (p != null)
		{
			p.Close();
		}
	}
*/
}

function OnContextMenu_Popup()
{
	var p = this.getAttribute("popup");
	p.Close();
}

function OnMouseOver_Popup()
{
	var p = this.getAttribute("popup");
	p.isMouseOver = true;
}

function OnMouseOut_Popup()
{
	var p = this.getAttribute("popup");
	p.isMouseOver = false;
}

function OnMouseOver_PopupMenu()
{
	var p = this.getAttribute("popup");
	p.isMouseOver = true;
}

function OnMouseOut_PopupMenu()
{
	var p = this.getAttribute("popup");
	p.isMouseOver = false;
}

function Popup_Show()
{
	this.showTime = new Date();
	this.popup = window.createPopup();
	var d = this.popup.document;

	//	d.createStyleSheet("CSS/style.css");
	var s=d.createStyleSheet();
	s.cssText = GetPopupCssText();
	var b = d.body;
	b.rightmargin = 0;
	b.leftmargin = 0;
	b.topmargin = 0;
	b.bottommargin = 0;
	b.innerHTML = this.aspxl;
	b.style.cursor = "default";
	b.oncontextmenu = OnContextMenu_Popup;
	b.onmouseover = OnMouseOver_Popup;
	b.onmouseout = OnMouseOut_Popup;
	b.setAttribute("popup", this);
	var closeButton = d.getElementById(this.win.Win.id + "_CloseButton");
	closeButton.onclick = OnClickClose_Popup;
	closeButton.setAttribute("popup", this);

	var menuButton = d.getElementById(this.win.Win.id + "_MenuButton");
	menuButton.onclick = OnClickMenu_Popup;
	menuButton.setAttribute("popup", this);

	var popupMessage = d.getElementById(this.win.Win.id + "_BodyText");
	popupMessage.onclick = OnClick_Popup;
	popupMessage.setAttribute("popup", this);
	var toastWidth = this.win.Win.offsetWidth;
	var toastHeight = this.win.Win.offsetHeight;
	var toastVerticalMargin = 28;
	var toastHorizontalMargin = 16;
	var screenWidth = window.screen.width;
	var screenHeight = window.screen.height;
	this.popup.show(screenWidth - toastWidth - toastHorizontalMargin, screenHeight - toastHeight - toastVerticalMargin,toastWidth,toastHeight);

}

function Popup_CreateBody(msg, icon, title)
{
	if (icon != null && icon != "")
		this.win.Icon.src = icon;
	this.win.BodyText.innerHTML = NewlineReplace((msg));;
	this.win.CaptionText.innerHTML = title;
	var win = this.win.Win.cloneNode(true);
	win.style.display = "";
	return win.outerHTML;
}


function PopupManager()
{
	var queue = new Queue();
	this.Disabled = false;

	var canShow = (window.createPopup != null);
	this.Heartbeat = function()
	{
		if (queue.Count() > 0)
		{
			var p = queue.Peek();

			var delta = p.ShowTime();

			if (delta == null)
			{
				if (!this.Disabled)
					p.Show();
			}
			else if ((p.popup == null) || (!p.popup.isOpen) || (!p.isMouseOver && delta >= 7))
			{
				p.Hide();

				queue.Dequeue();
			}
		}
	}

	this.AddPopup = function(winid, message, icon, title, func)
	{
		var result = null;
		do
		{
			if (canShow)
			{
				result = new Popup(winid, message, icon, title, func);
				result.PopupManager = this;

				queue.Enqueue(result);
				this.Heartbeat();
			}
		}
		while (false);

		return result;
	}
}
