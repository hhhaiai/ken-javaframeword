package com.shine.framework.entity;

import java.io.Serializable;

/**
 * 持久化结果,保存执行结果
 * @author JiangKunpeng	2012.12.25
 * @version 2012.12.25
 */
public class PersistResult implements Serializable{

	private static final long serialVersionUID = -7558596910549437886L;
	
	private int code;		//结果编码
	private String msg;		//提示信息
	
	public static final int SUCCESS = 1;
	public static final int FAILURE = 2;
	public static final int ERROR = 3;
	public static final String MSG_SUCCESS = "操作成功";
	public static final String MSG_FAILURE = "操作失败";
	public static final String MSG_ERROR = "后台程序异常";
	public static final String MSG_EXIST = "存在相同的记录";
	
	public PersistResult(){
	}
	
	public PersistResult(int code,String msg){
		this.code = code;
		this.msg = msg;
	}
	
	/**
	 * 转成JSON字符串
	 * @return
	 */
	public String toJson(){
		String json = "{'code':'"+code+"','msg':'"+msg+"'}";
		return json;
	}
	
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
}
