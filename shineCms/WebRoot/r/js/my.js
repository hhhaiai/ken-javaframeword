/**
 * 自定义JS方法
 * @encode UTF-8
 * @author JiangKunpeng
 * 修改者      修改时间         版本       修改描述
 * 
 */

/** 
 * 所有自定义方法写该类里面,使名称不会冲突 
 */
function JkpClass(){
	/**
	 * 在列表页中执行Ajax增、删、改后的回调函数
	 * @param data	后台返回的数据
	 * @param grid	要刷新的grid
	 * @param dialog	要关掉的窗口
	 */
	this.persistBack = function(data,grid,dialog){
		var rs = eval("("+data+")");
    	if(rs.code == 1){	//成功
    		$.omMessageTip.show({title: "操作提示", content: "<font color='blue'>"+rs.msg+"</font>", type:"success", timeout: 2000});
    		if(grid)
    			grid.omGrid('reload');	//刷新列表数据
    		if(dialog)
            	dialog.omDialog("close"); //关闭dialog
    	}else if(rs.code == 2){	//失败
    		$.omMessageTip.show({title: "操作提示", content: "<font color='scarlet'>"+rs.msg+"</font>", type:"warning", timeout: 2000});
    	}else{	//后台异常
    		$.omMessageTip.show({title: "操作提示", content: "<font color='red'>"+rs.msg+"</font>", type:"error", timeout: 2000});
    	}
	}
}

var jkp = new JkpClass();