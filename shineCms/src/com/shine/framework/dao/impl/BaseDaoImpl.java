package com.shine.framework.dao.impl;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.hibernate.metadata.ClassMetadata;

import com.shine.framework.dao.BaseDao;
import com.shine.framework.dao.util.ArrayUtil;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class BaseDaoImpl extends GenericDaoImpl implements BaseDao{

	/**
	 * 获取实体主键属性名
	 * @param entity
	 * @return
	 */
	protected String getPkName(BaseEntity entity){
		return getClassMetadata(entity.getClass()).getIdentifierPropertyName();
	}
	
	@Override
	public BaseEntity get(BaseEntity entity) {
		ClassMetadata cm = getClassMetadata(entity.getClass());
		String pkName = cm.getIdentifierPropertyName();
		Object v = getEntityPropertityValue(entity, pkName);
		String t = cm.getIdentifierType().getName();
		Serializable s = null;
		if("string".equals(t))
			s = v.toString();
		else if(t.startsWith("int"))
			s = Integer.parseInt(v.toString());
		else if("long".equals(t))
			s = Long.parseLong(v.toString());
		else 
			s = v.toString();
		Object o = get(entity.getClass(), s);
		return (BaseEntity)o;
	}

	@Override
	public void delete(BaseEntity entity) {
		ClassMetadata cm = getClassMetadata(entity.getClass());
		String pkName = cm.getIdentifierPropertyName();
		if(entity.isVirtualDelete()){
			String sql = "update " + entity.getClass().getName() + 
				" tmp set tmp.delFlag=?,tmp.delTime=? where tmp." + pkName + " = ?";
			executeSQL(sql, new Object[]{1, new Date(), getEntityPropertityValue(entity, pkName)});
		}else{
			Object v = getEntityPropertityValue(entity, pkName);
			String t = cm.getIdentifierType().getName();
			Serializable s = null;
			if("string".equals(t))
				s = v.toString();
			else if(t.startsWith("int"))
				s = Integer.parseInt(v.toString());
			else if("long".equals(t))
				s = Long.parseLong(v.toString());
			else 
				s = v.toString();
			Object o = get(entity.getClass(), s);
			if(o!=null)
				delete(o);
		}
	}

	@Override
	public void delete(BaseEntity entity, Serializable[] pkValue) {
		Serializable[] pk = pkTransform(entity, pkValue);
		if(entity.isVirtualDelete()){
			StringBuffer sql = new StringBuffer("100");
			sql.append("update ").append(entity.getClass().getName());
			sql.append(" tmp set tmp.delFlag=?,tmp.delTime=? where tmp.").append(getPkName(entity)).append(" in(");
			for(int i=0;i<pkValue.length;i++){
				sql.append("?,");
			}
			sql.delete(sql.length()-1, sql.length());
			sql.append(")");
			executeSQL(sql.toString(), ArrayUtil.mergeArray(new Object[]{1,new Date()}, pk));
		}else{
			StringBuffer sql = new StringBuffer("100");
			sql.append("delete from ").append(entity.getClass().getName());
			sql.append(" tmp where ").append(getPkName(entity)).append(" in(");
			for(int i=0;i<pkValue.length;i++){
				sql.append("?,");
			}
			sql.delete(sql.length()-1, sql.length());
			sql.append(")");
			executeSQL(sql.toString(), pk);
		}
	}
	
	@Override
	public boolean exist(BaseEntity entity) {
		QuerySQL qsql = entity.getExistSQL();
		if(qsql!=null){
			List list = null;
			if(qsql.getParams()==null||qsql.getParams().length==-1)
				list = find(qsql.getSql(), qsql.getValues());
			else
				list = find(qsql.getSql(), qsql.getParams(), qsql.getValues());
			if(list!=null&&!list.isEmpty())
				return true;
		}
		return false;
	}

	@Override
	public List list(QueryAnalyzer queryFilter) {
		QuerySQL querySql = queryFilter.buildQuerySQL();
		Pagination page = queryFilter.getPage();
		String hql = querySql.getSql();
		String[] params = querySql.getParams();
		Object[] values = querySql.getValues();
		if(page==null){
			if(values==null||values.length<1)
				return this.find(hql);
			else if(params!=null&&params.length>0)
				return this.find(hql, params, values);
			else
				return this.find(hql, values);
		}else{
			return this.list(hql, params, values, page);
		}
	}

	
}
