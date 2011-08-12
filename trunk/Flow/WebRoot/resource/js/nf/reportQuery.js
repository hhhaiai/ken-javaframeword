/**
 * @fileOverview Query control for report page.
 * @author 彭日聪
 * @version 1.0.0
 * @change
    修改者      修改时间         版本       修改描述
*/
/*
rl.provided("nf:reportQuery");
*/
rl.importJs("lib.dom.xdw_aniamtion");
rl.importJs("gui.deco");
rl.importJs("gui.form.DateSelect");
rl.importCss("nf:form");

function checkAll(){
   var mainForm = document.mainForm;
   if ( mainForm.selectedItems.length == null ){
        if( mainForm.checkall.checked )
           mainForm.checkbox.checked = true;
        else
           mainForm.checkbox.checked = false;
   }else{
        if(mainForm.checkall.checked){
             for( var i=0; i < mainForm.selectedItems.length; i++ )
                 mainForm.selectedItems[i].checked = true;
        }else{
             for( var i=0; i < mainForm.selectedItems.length; i++ )
                 mainForm.selectedItems[i].checked = false;
        }
   }
}

function checkOne(){
   var mainForm = document.mainForm;
   if(mainForm.checkall.checked)
	  mainForm.checkall.checked = false;
}

/**
 * searchBar: embed seach pane.
 */
nf.searchBarAni = new rl.fx.Animation({
    duration : 0.5,
	easingType : "Circ",
	target : "searchBarAniCtn"
});

function toggleSearch(){
	var ani = nf.searchBarAni;
	if(ani.showing){
		animDisplaySearch(false);
		ani.showing = false;
	}else{
		animDisplaySearch(true);
		ani.showing = true;
	}
}

function animDisplaySearch(show){
	var from, to, onStop,
		ani = nf.searchBarAni,
		target = rl.getDom(ani.target);
	
	if(ani.animated) ani.stop();
	
	from = rl.$(target).getStyle("height", true) || 0;
	if(show){
		target.style.display = "block";
		to = target.scrollHeight;
	}else{
		to = 0;
		onStop = function(){
			target.style.display = "none";
		};
	}
	
	ani.attributes = {height : { from : from, to : to}};
	ani.start({
		onStop : onStop
	});
}
