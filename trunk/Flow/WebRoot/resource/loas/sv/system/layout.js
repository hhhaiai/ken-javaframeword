namespace("LOAS_LAYOUT");
WIN.extend(LOAS_LAYOUT,{
  config  :{
		top:{
			height  : 100
		},
		foot:{
			height  : 25
		},
		main:{
			
		},
		mainLeft  :{
			width   : 200
		},
		mainRight :{
		
		},
		mainSpacer:{
			width   : 10
		},
		tabBar    :{
			height  : 30
		},
		content   :{
		
		}	
	},
	ele     :{},
	update  :{
		resetMainHeight:function(){
			LOAS_LAYOUT.ele.main.style.height = DOC.getClientHeight() - LOAS_LAYOUT.config.top.height - LOAS_LAYOUT.config.foot.height + "px";
		},
		resetMainRightWidth:function(){
			//firefox on window size diminish, window scrollbar will occur, so DOC.getClientWidth() is 20px less than normal --- add css overflow:hidden to body to hide scrollbar;
			LOAS_LAYOUT.ele.mainRight.style.width = DOC.getClientWidth() - LOAS_LAYOUT.config.mainLeft.width  - LOAS_LAYOUT.config.mainSpacer.width + "px";
		},
		resetContentHeight:function(){
			LOAS_LAYOUT.ele.content.style.height = LOAS_LAYOUT.ele.mainRight.scrollHeight - LOAS_LAYOUT.config.tabBar.height + "px";
		}
	},
	initView: function(){
		WIN.extend(LOAS_LAYOUT.ele,{
			top       : $("top"),
			foot      : $("foot"),
			main      : $("main"),
			mainLeft  : $("main_left"),
			mainRight : $("main_right"),
			mainSpacer: $("main_spacer"),
			tabBar    : $("tab_bar"),
			content   : $("content")	
		});
		var ele = LOAS_LAYOUT.ele, config = LOAS_LAYOUT.config, update = LOAS_LAYOUT.update;
		ele.top.style.height = config.top.height + "px";
		ele.foot.style.height = config.foot.height + "px";
		ele.mainLeft.style.width = config.mainLeft.width + "px";
		ele.mainSpacer.style.width = config.mainSpacer.width + "px";
		ele.tabBar.style.height = config.tabBar.height + "px";
		
		ele.main.style.top = config.top.height + "px";
		ele.mainSpacer.style.left = config.mainLeft.width + "px";
		ele.mainRight.style.left = config.mainLeft.width + config.mainSpacer.width + "px";
		ele.content.style.top = config.tabBar.height + "px";
		
		update.resetMainHeight();
		update.resetMainRightWidth();
		update.resetContentHeight();
		EVT.observe(window, "resize", update.resetMainHeight);
		EVT.observe(window, "resize", update.resetMainRightWidth);
		EVT.observe(window, "resize", update.resetContentHeight);
	}
});
EVT.domLoadedObserver.add(LOAS_LAYOUT.initView);
