package com.shine.common.sysmgr.entity;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;
import com.shine.platform.security.auth.Function;

public class SysFunctionUrl implements BaseEntity, com.shine.platform.security.auth.FunctionUrl {

	private static final long serialVersionUID = 4494817061536609637L;
	
	private Integer urlId;
	private SysFunction func;
	private String uurl;
	private Integer isLog;

	@Override
	public QuerySQL getExistSQL() {
		return null;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
	}
	
	@Override
	public boolean isLog() {
		return "1".equals(isLog);
	}

	@Override
	public Function getFunction() {
		return func;
	}

	public Integer getUrlId() {
		return urlId;
	}

	public void setUrlId(Integer urlId) {
		this.urlId = urlId;
	}
	
	public String getUurl() {
		return uurl;
	}

	public void setUurl(String uurl) {
		this.uurl = uurl;
	}

	public Integer getIsLog() {
		return isLog;
	}

	public void setIsLog(Integer isLog) {
		this.isLog = isLog;
	}

	public SysFunction getFunc() {
		return func;
	}

	public void setFunc(SysFunction func) {
		this.func = func;
	}

}
