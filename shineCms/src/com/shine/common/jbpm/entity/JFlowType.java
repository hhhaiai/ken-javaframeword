package com.shine.common.jbpm.entity;

import java.util.HashSet;
import java.util.Set;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class JFlowType implements BaseEntity {

	private static final long serialVersionUID = 8658565373549742127L;
	
	private Integer typeId;
	private Integer pid;
	private String typeName;
	
	private Set<JFlowType> children = new HashSet<JFlowType>();
	
	@Override
	public QuerySQL getExistSQL() {
		return null;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
	}

	public Integer getTypeId() {
		return typeId;
	}
	public void setTypeId(Integer typeId) {
		this.typeId = typeId;
	}
	public Integer getPid() {
		return pid;
	}
	public void setPid(Integer pid) {
		this.pid = pid;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public Set<JFlowType> getChildren() {
		return children;
	}
	public void setChildren(Set<JFlowType> children) {
		this.children = children;
	}
}