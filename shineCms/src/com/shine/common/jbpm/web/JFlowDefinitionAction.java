package com.shine.common.jbpm.web;

import com.shine.common.jbpm.entity.JFlowDefinition;
import com.shine.framework.biz.BaseService;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.web.AjaxAction;

public class JFlowDefinitionAction extends AjaxAction<BaseService> {

	private static final long serialVersionUID = -5209278802689994357L;
	
	private JFlowDefinition e = new JFlowDefinition();
	
	private Integer typeId;
	
	private void initData(){
		
	}
	
	@Override
	public String enter() {
		return ENTER;
	}

	@Override
	public String toAdd() {
		// TODO Auto-generated method stub
		return super.toAdd();
	}

	@Override
	public String toEdit() {
		// TODO Auto-generated method stub
		return super.toEdit();
	}

	@Override
	public void list() {
		// TODO Auto-generated method stub
		super.list();
	}

	@Override
	public void save() {
		// TODO Auto-generated method stub
		super.save();
	}

	@Override
	public void update() {
		// TODO Auto-generated method stub
		super.update();
	}

	@Override
	public BaseEntity getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (JFlowDefinition)e;
	}

	public Integer getTypeId() {
		return typeId;
	}

	public void setTypeId(Integer typeId) {
		this.typeId = typeId;
	}
	
}
