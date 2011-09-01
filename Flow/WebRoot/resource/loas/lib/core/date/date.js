/***************************************************************
date.js
useful fns for debug
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.date.date");

/*
NAMESPACE:
  Date
DES:
  decription
FUNCTION:
*/
WIN.extend(Date,{
	/*
	():
		{array} Date.diff({date} dateStart, {date} dateEnd)
	DES:
		return the time info bt dateEnd and dateStart: (dateEnd - dateStart)
	ARG:
		{date} dateStart
			start time
		{date} dateEnd
			end time
	RTN:
		return a array contains these items :[passDay , passHour, passMinute, passSecond];
	*/
	diff : function(dateStart, dateEnd){
		if(!dateStart || !dateEnd)return [];
		var passSecond = (dateEnd.getTime() - dateStart.getTime())/1000;
		
		var passMinute = parseInt((passSecond/60) % 60);
		var passHour = parseInt((passSecond/(60*60)) % 24);
		var passDay = parseInt(passSecond/(24*60*60));
		passSecond = parseInt(passSecond % 60);
	
		return [passDay , passHour, passMinute, passSecond];
	},
	/*
	():
		{array} Date.parseDateString({string} str)
	DES:
		get date info by parsing the date string.
	ARG:
		{string} str
			date string, only the following date string type can be accepted:
				"2007-02-19 18:20:00" or "2007/02/19 18:20:00";
	RTN:
		return a array contains these items :[time, year, month, day, hour, minute, second], if the date string is not valid return null;;
	*/
	parseDateString : function(str){ 
		return str.match(/^(\d{0,4})[-|\/](\d{0,2})[-|\/](\d{0,2}) (\d{0,2}):(\d{0,2}):(\d{0,2})$/);
	},
	/*
	():
		{date} Date.string2Date({string} str)
	DES:
		parse a date string to be a date object;
	ARG:
		{string} str
			see Date.parseDateString arg;
	*/
	string2Date : function(str){
		var a = Date.parseDateString(str);
		if (!a || a[2]>=13 || a[3]>=32 || a[4]>=24 || a[5]>=60 || a[6]>=60){
			alert("ÈÕÆÚ´íÎó£¡"); 
			return null;
		}
		//m/d/y h:m:s
		return new Date(a[2] + "-" + a[3] + "-" + a[1] + " " + a[4] + ":" + a[5] + ":" + a[6]);
	},
	unknown: null
});
