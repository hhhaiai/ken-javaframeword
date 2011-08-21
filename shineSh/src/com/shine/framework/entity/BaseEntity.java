package com.shine.framework.entity;

import java.io.Serializable;

import com.shine.framework.dao.util.QuerySQL;

/**
 * 实体接口
 * @author JiangKunpeng	2011.05.04
 * @version 2011.08.21
 */
public interface BaseEntity extends Serializable{
	public boolean isVirtualDelete();		//是否虚拟删除,虚拟删除:改变删除标识,可以恢复
	public QuerySQL getExistSQL();			//获取实体是否存在的SQL
}
