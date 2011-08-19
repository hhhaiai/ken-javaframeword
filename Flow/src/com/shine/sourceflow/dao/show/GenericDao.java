package com.shine.sourceflow.dao.show;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.show.GenericDTO;

/**
 * 通用DAO
 */
public abstract class GenericDao {
	private static final String JNDI = "jdbc/flow";
	
	public DBModel query(GenericDTO dto) {
		String sql = this.createQuerySQL(dto);
		DBModel dbModel = null;
		if (sql != null && !sql.isEmpty()) {
			dbModel = DBUtil.getInstance().executeCacheQuery(JNDI, sql);
			dbModel.close();
		}
		return dbModel;
	}
	
	/**
	 * 创建SQL查询语句
	 * 
	 * @param dto
	 * @return
	 */
	public abstract String createQuerySQL(GenericDTO dto);
}
