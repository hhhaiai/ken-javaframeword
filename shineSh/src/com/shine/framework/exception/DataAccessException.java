package com.shine.framework.exception;

/**
 * 数据异常
 * @author JiangKunpeng	2010-10-11
 * @version 2011-05-04
 *
 */
public class DataAccessException extends RuntimeException{

	private static final long serialVersionUID = 9221172833420885631L;
	
	public DataAccessException(Throwable e){
		super(e);
	}

	public DataAccessException(){
		super();
	}

	public DataAccessException(String message) {
		super(message);
	}

	public DataAccessException(String message,Throwable e){
		super(message,e);
	}
	
}
