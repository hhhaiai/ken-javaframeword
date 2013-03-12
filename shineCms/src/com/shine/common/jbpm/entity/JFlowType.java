package com.shine.common.jbpm.entity;

import java.util.HashSet;
import java.util.Set;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.AutoIntIdEntity;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.TreeEntity;

public class JFlowType implements BaseEntity,AutoIntIdEntity,TreeEntity {

	private static final long serialVersionUID = 8658565373549742127L;
	
	private Integer id;
	private Integer pid;
	private String typeName;
	private String treeCode;
	
	private Set<JFlowType> children = new HashSet<JFlowType>();
	
	public Object clone() {
		Object o = null;
		try{
			o = super.clone();
		}catch(CloneNotSupportedException e){
			throw new RuntimeException("树形结构实体clone异常", e);
		}
		return o;
	}

	@Override
	public QuerySQL getExistSQL() {
		return null;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
	}

	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
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
	public String getTreeCode() {
		return treeCode;
	}
	public void setTreeCode(String treeCode) {
		this.treeCode = treeCode;
	}
}