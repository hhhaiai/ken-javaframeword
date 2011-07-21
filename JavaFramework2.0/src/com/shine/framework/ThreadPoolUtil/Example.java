package com.shine.framework.ThreadPoolUtil;

import com.shine.framework.ThreadPoolUtil.model.PrintThreadModel;

public class Example {
    public static void main(String args[]){
    	PrintThreadModel threadModel=new PrintThreadModel();
//    	threadModel.setThreadName("print");
    	threadModel.setTimeOut(1000);
//    	threadModel.setDescription("print test");
//    	threadModel.setState(true);
    	
    	ThreadPoolManager.getManager().addThread(threadModel);
    	ThreadPoolManager.getManager().startThreadPool();
    }
}
