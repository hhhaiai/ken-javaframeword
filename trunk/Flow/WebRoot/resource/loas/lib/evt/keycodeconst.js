/***************************************************************
keycodeconst.js
set all keycode const
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.evt.keycodeconst");
//require resource
require("lib.evt.engin");

(function(){
	var standardKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	var keypad = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '+', '-', '/'];
	var functionKeys 	= ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'];		
	var key = {
		KEYPAD_0   : 96,
		KEYPAD_1   : 97,
		KEYPAD_2   : 98,
		KEYPAD_3   : 99,
		KEYPAD_4   : 100,
		KEYPAD_5   : 101,
		KEYPAD_6   : 102,
		KEYPAD_7   : 103,
		KEYPAD_8   : 104,
		KEYPAD_9   : 105,
	};
})();


			 case "106":return("*");
			 case "107":return("+");
			 case "109":return("-");
			 case "110":return(".");
			 case "111":return("/");
			 
keyChar				:	function(evt){		
			var e = (evt) ? evt : ((window.event) ? window.event : null);
			switch(e.keyCode.toString()){
			 case "96":return("0");
			 case "97":return("1");
			 case "98":return("2");
			 case "99":return("3");
			 case "100":return("4");
			 case "101":return("5");
			 case "102":return("6");
			 case "103":return("7");
			 case "104":return("8");
			 case "105":return("9");
			 case "111":return("/");
			 case "110":return(".");
			 case "106":return("*");
			 case "109":return("-");
			 case "107":return("+");
			 case "144":return("numlock");
			 case "192":return("`");
			 case "49":return("1");
			 case "50":return("2");
			 case "51":return("3");
			 case "52":return("4");
			 case "53":return("5");
			 case "54":return("6");
			 case "55":return("7");
			 case "56":return("8");
			 case "57":return("9");
			 case "48":return("0");
			 case "189":return("-");
			 case "187":return("=");
			 case "8":return("backspace");
			 case "9":return("tab");
			 case "81":return("q");
			 case "87":return("w");
			 case "69":return("e");
			 case "82":return("r");
			 case "84":return("t");
			 case "89":return("y");
			 case "85":return("u");
			 case "73":return("i");
			 case "79":return("o");
			 case "80":return("p");
			 case "219":return("[");
			 case "221":return("]");
			 case "220":return("\\");
			 case "20":return("caplock");
			 case "65":return("a");
			 case "83":return("s");
			 case "68":return("d");
			 case "70":return("f");
			 case "71":return("g");
			 case "72":return("h");
			 case "74":return("j");
			 case "75":return("k");
			 case "76":return("l");
			 case "186":return(";");
			 case "222":return("'");
			 case "16":return("shift");
			 case "90":return("z");
			 case "88":return("x");
			 case "67":return("c");
			 case "86":return("v");
			 case "66":return("b");
			 case "78":return("n");
			 case "77":return("m");
			 case "188":return(",");
			 case "190":return(".");
			 case "191":return("/");
			 case "17":return("ctrl");
			 case "91":return("win");
			 case "92":return("win");
			 case "18":return("alt");
			 case "32":return("space");
			 case "93":return("menu");
			 case "38":return("up");
			 case "40":return("down");
			 case "37":return("left");
			 case "39":return("right");
			 case "45":return("insert");
			 case "46":return("delete");
			 case "36":return("home");
			 case "35":return("end");
			 case "33":return("pageup");
			 case "34":return("pagedown");
			 case "34":return("printcreen");
			 case "145":return("scrolllock");
			 case "19":return("pause");
			 case "27":return("esc");
			 case "12":return("middle");
			 case "13":return("return");
			 case "112":return("f1");
			 case "113":return("f2");
			 case "114":return("f3");
			 case "115":return("f4");
			 case "116":return("f5");
			 case "117":return("f6");
			 case "118":return("f7");
			 case "119":return("f8");
			 case "120":return("f9");
			 case "121":return("f10");
			 case "122":return("f11");
			 case "123":return("f12");
			 default:return("unknown");
			}		
		},
