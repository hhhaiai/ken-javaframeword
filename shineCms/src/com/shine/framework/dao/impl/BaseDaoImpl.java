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
		Serializable s = getPkValue(entity);
		Object o = get(entity.getClass(), s);
		return (BaseEntity)o;
	}

	@Override
	public void delete(BaseEntity entity) {
		ClassMetadata cm = getClassMetadata(entity.getClass());
		String pkName = cm.getIdentifierPropertyName();
		if(entity.isVirtualDelete()){
			String sql = "UPDATE " + entity.getClass().getName() + 
				" tmp SET tmp.delflag=?,tmp.deltime=? WHERE tmp." + pkName + " = ?";
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
	public void delete(BaseEntity entity, Serializable pkValue){
		Serializable pk = pkTransform(entity.getClass(), pkValue);
		StringBuffer sql = new StringBuffer(100);
		if(entity.isVirtualDelete()){
			sql.append("UPDATE ").append(entity.getClass().getName());
			sql.append(" tmp SET tmp.delflag=?,tmp.deltime=? WHERE tmp.").append(getPkName(entity)).append(" = ?");
			executeUpdate(sql.toString(), new Object[]{1,new Date(),pk});
		}else{
			sql.append("DELETE FROM ").append(entity.getClass().getName());
			sql.append(" tmp WHERE tmp.").append(getPkName(entity)).append(" = ?");
			executeUpdate(sql.toString(), new Object[]{pk});
		}
		sql = null;
	}

	@Override
	public void delete(BaseEntity entity, Serializable[] pkValue){
		Serializable[] pk = pkTransform(entity.getClass(), pkValue);
		StringBuffer sql = new StringBuffer(100);
		if(entity.isVirtualDelete()){
			sql.append("UPDATE ").append(entity.getClass().getName());
			sql.append(" tmp SET tmp.delflag=?,tmp.deltime=? WHERE tmp.").append(getPkName(entity)).append(" IN(");
			for(int i=0;i<pkValue.length;i++){
				sql.append("?,");
			}
			sql.delete(sql.length()-1, sql.length());
			sql.append(")");
			executeUpdate(sql.toString(), ArrayUtil.mergeArray(new Object[]{1,new Date()}, pk));
		}else{
			sql.append("DELETE FROM ").append(entity.getClass().getName());
			sql.append(" tmp WHERE tmp.").append(getPkName(entity)).append(" IN(");
			for(int i=0;i<pkValue.length;i++){
				sql.append("?,");
			}
			sql.delete(sql.length()-1, sql.length());
			sql.append(")");
			executeUpdate(sql.toString(), pk);
		}
		sql = null;
	}
	
	@Override
	public boolean exist(BaseEntity entity) {
		QuerySQL qsql = entity.getExistSQL();
		if(qsql!=null){
			List list = null;
			String[] params = null;
			if((params = qsql.getParams())==null||params.length==-1){
				if(qsql.isHql())
					list = find(qsql.getSql(), qsql.getValues());
				else
					list = listBySQL(entity.getClass(), qsql.getSql(), qsql.getValues());
			}else{
				if(qsql.isHql())
					list = find(qsql.getSql(), params, qsql.getValues());
				else
					list = listBySQL(entity.getClass(), qsql.getSql(), params, qsql.getValues());
			}
			params = null;
			if(list!=null&&!list.isEmpty()){
				list = null;
				return true;
			}
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
