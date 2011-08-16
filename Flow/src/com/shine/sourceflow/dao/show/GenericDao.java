package com.shine.sourceflow.dao.show;

import com.shine.DBUtil.DBUtil;
import com.shine.sourceflow.model.show.GenericDTO;

/**
 * 通用DAO
 */
public abstract class GenericDao {
	private static final String JNDI = "jdbc/flow";
	
	public void query(GenericDTO dto) {
		String sql = this.createQuerySQL(dto);
		if (sql != null && !sql.isEmpty()) {
			DBUtil.getInstance().executeCacheQuery(JNDI, sql);
		}
	}
	
	/**
	 * 创建SQL查询语句
	 * 
	 * @param dto
	 * @return
	 */
	public abstract String createQuerySQL(GenericDTO dto);
}
