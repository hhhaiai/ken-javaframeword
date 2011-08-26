package com.shine.sourceflow.dao.show;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.show.GenericDTO;
import com.shine.sourceflow.web.show.GenericAction;

/**
 * 通用DAO
 */
public abstract class GenericDao {
	public static final String JNDI = "jdbc/MonetDB";
	
	public Map<String, DBModel> query(GenericDTO dto) {
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		String[] sql = this.createQuerySQL(dto);
		DBModel dbModel = null;
		if (sql.length > 0 && sql[0] != null) {
			dbModel = DBUtil.getInstance().executeQuery(JNDI, sql[0]);
			try {
				dbModel.next();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			dbModel.close();
			dbModels.put(GenericAction.DATA_DEFAULT, dbModel);
		}
		return dbModels;
	}
	
	/**
	 * 创建SQL查询语句
	 * 
	 * @param dto
	 * @return
	 */
	public abstract String[] createQuerySQL(GenericDTO dto);
}
