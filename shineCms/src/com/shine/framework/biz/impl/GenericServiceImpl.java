package com.shine.framework.biz.impl;

import com.shine.framework.dao.BaseDao;

/**
 * 基本业务类
 * @author JiangKunpeng 2011.09.01
 * @version 2011.09.01
 * @param <DAO> 数据操作类
 */
public class GenericServiceImpl<DAO extends BaseDao> {
	
	protected DAO dao;

	public void setDao(DAO dao) {
		this.dao = dao;
	}
}
