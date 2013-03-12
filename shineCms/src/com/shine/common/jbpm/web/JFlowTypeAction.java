package com.shine.common.jbpm.web;

import java.util.List;

import com.shine.common.jbpm.entity.JFlowType;
import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;

public class JFlowTypeAction extends AjaxAction<BaseService> {

	private static final long serialVersionUID = -1787162863937677306L;
	
	private JFlowType e = new JFlowType();
	
	@SuppressWarnings("unchecked")
	@Override
	public String enter() {
		QueryAnalyzer analyzer = new QueryAnalyzer();
		analyzer.setEntity(getE());
		analyzer.addSortField("id");
		extor.buildQueryItem(analyzer);
		List list = service.list(analyzer);
		request.setAttribute(LIST, list);
		return ENTER;
	}

	@Override
	public String toAdd() {
		String tname = null;
		if(e.getPid()!=0){
			JFlowType type = new JFlowType();
			type.setId(e.getPid());
			type = (JFlowType)service.get(type);
			if(type!=null){
				tname = type.getTypeName();
				request.setAttribute("parent", type);
			}
		}else{
			tname = "流程分类";
		}
		request.setAttribute("tname", tname);
		return TOADD;
	}

	@Override
	public String toEdit() {
		view();
		
		String tname = null;
		if(e!=null&&e.getPid()!=0){
			JFlowType type = new JFlowType();
			type.setId(e.getPid());
			type = (JFlowType)service.get(type);
			if(type!=null){
				tname = type.getTypeName();
				request.setAttribute("parent", type);
			}
		}else{
			tname = "流程分类";
		}
		request.setAttribute("tname", tname);
		return TOEDIT;
	}

	@Override
	public void save() {
		try{
			PersistResult pr = service.save(getE());
			pr.putData("id", e.getId());
			printOutText(pr.toJson());
		}catch(Exception e){
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
			e.printStackTrace();
		}
	}

	@Override
	public BaseEntity getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (JFlowType)e;
	}
	
}
