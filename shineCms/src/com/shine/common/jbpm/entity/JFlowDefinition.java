package com.shine.common.jbpm.entity;

import java.util.Date;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class JFlowDefinition implements BaseEntity {

	private static final long serialVersionUID = 510554740779353414L;
	
	private Integer defId;
	private Integer typeId;
	private String name;
	private String description;
	private Date createTime;
	private Integer deployId;
	private String defXml;

	@Override
	public QuerySQL getExistSQL() {
		return null;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
	}

	public Integer getDefId() {
		return defId;
	}

	public void setDefId(Integer defId) {
		this.defId = defId;
	}

	public Integer getTypeId() {
		return typeId;
	}

	public void setTypeId(Integer typeId) {
		this.typeId = typeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Integer getDeployId() {
		return deployId;
	}

	public void setDeployId(Integer deployId) {
		this.deployId = deployId;
	}

	public String getDefXml() {
		return defXml;
	}

	public void setDefXml(String defXml) {
		this.defXml = defXml;
	}
}
