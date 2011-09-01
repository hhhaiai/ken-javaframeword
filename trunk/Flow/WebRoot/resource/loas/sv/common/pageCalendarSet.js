/***************************************************************
pageCalendarSet.js
set page date calendar
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("sv.common.pageCalendarSet");
//require resource
require("app.gui.plugin.calendarCn");

EVT.domLoadedObserver.add(function(){
	function setup(inputField, btnImg, ifFormat){
		if(!String.notEmpty(ifFormat))ifFormat = "%Y-%m-%d";
		try{Calendar.setup({
			inputField     :    inputField,
			ifFormat       :    ifFormat,
			showsTime      :    true,
			button         :    btnImg,
			cache          :    true,
			singleClick    :    false,
			step           :    1
		});}catch(e){}
	}
	/*calendars
	the ID of inputs field to store the date, the imgIcon should be ID + "_img";
	*/
	var calendars = ["day", "startTime", "endTime","queryDay"];
	Array.each(function(i){
	  if(WIN.isElement($(i))){
			if(/time/i.test(i))setup(i, i + "_img", "%Y-%m-%d %H:%M");
			else setup(i, i + "_img");
		}
	}, calendars);
});
