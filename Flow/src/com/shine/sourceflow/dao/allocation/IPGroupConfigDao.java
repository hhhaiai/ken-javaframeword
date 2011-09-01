package com.shine.sourceflow.dao.allocation;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.utils.Pagination;
import com.shine.sourceflow.web.GenericAction;

public class IPGroupConfigDao extends GenericDao {
	private String sqlField = 
		"id, group_id, ip_alias, ip_start_address, ip_end_address";
	private String tableName = "ip_group_config";
	
	/**
	 * 查询IP分组配置信息
	 */
	@Override
	public Map<String, DBModel> list(GenericDto dto) {
		// 初始化分页
		String perPage = (String)dto.getExtraParams("perPage");
		String curPage = (String)dto.getExtraParams("curPage");
		this.pagination = new Pagination(Integer.parseInt(perPage), 
				Integer.parseInt(curPage), this.count(dto));
		
		// 查询数据
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		String sql = this.createQuerySql();
		DBModel dbModel = DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sql);
		try {
			dbModel.next();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		dbModel.close();
		dbModels.put(GenericAction.DATA_DEFAULT, dbModel);
		return dbModels;
	}
	
	/**
	 * 根据ID进行查询
	 * 
	 * @param dto
	 * @return
	 */
	@Override
	public Map<String, DBModel> listById(GenericDto dto) {
		String sql = this.createQuerySql(dto);
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		DBModel dbModel = DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sql);
		try {
			dbModel.next();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		dbModel.close();
		dbModels.put(GenericAction.DATA_DEFAULT, dbModel);
		return dbModels;
	}
	
	/**
	 * 添加IP分组
	 * 
	 * @param dto
	 */
	@Override
	public void add(GenericDto dto) {
		String sql = this.createInsertSql(dto);
		DBUtil.getInstance().executeClusterUpdate(JNDI_CLUSTER, sql);
	}
	
	/**
	 * 更新IP分组配置
	 */
	@Override
	public void edit(GenericDto dto) {
		String sql = this.createUpdateSql(dto);
		DBUtil.getInstance().executeClusterUpdate(JNDI_CLUSTER, sql);
	}
	
	/**
	 * 删除IP分组
	 */
	@Override
	public void delete(GenericDto dto) {
		String sql = createDeleteSql(dto);
		DBUtil.getInstance().executeClusterUpdate(JNDI_CLUSTER, sql);
	}
	
	/**
	 * 获取IP分组总记录数
	 */
	public int count(GenericDto dto) {
		String sql = "select count(1) as total from " + this.tableName;
		DBModel dbModel = DBUtil.getInstance().executeQuery(JNDI_MONETDB, sql);
		try {
			dbModel.next();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return Integer.parseInt(dbModel.get(0).get("total"));
	}
	
	/**
	 * 创建SQL插入语句
	 * 
	 * @param dto
	 * @return
	 */
	private String createInsertSql(GenericDto dto) {
		String ipAlias = (String)dto.getExtraParams("ipAlias");
		String ipStartAddress = (String)dto.getExtraParams("ipStartAddress");
		String ipEndAddress = (String)dto.getExtraParams("ipEndAddress");
		StringBuffer sql = new StringBuffer();
		sql.append("insert into ");
		sql.append(this.tableName);
		sql.append("(group_id, ip_alias, ip_start_address, ip_end_address, flag) values");
		sql.append("('");
		sql.append(UUID.randomUUID().toString());
		sql.append("','");
		sql.append(ipAlias);
		sql.append("','");
		sql.append(ipStartAddress);
		sql.append("','");
		sql.append(ipEndAddress);
		sql.append("', 1)");
		return sql.toString();
	}
	
	/**
	 * 创建查询语句
	 * 
	 * @return
	 */
	private String createQuerySql() {
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(sqlField);
		sql.append(" from ");
		sql.append(this.tableName);
		sql.append(" limit ");
		sql.append(this.pagination.getPerPage());
		sql.append(" offset ");
		sql.append(this.pagination.getCurrentPage() - 1);
		return sql.toString();
	}
	
	/**
	 * 创建条件查询语句
	 * 
	 * @return
	 */
	private String createQuerySql(GenericDto dto) {
		String groupId = (String)dto.getExtraParams("groupId");
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(sqlField);
		sql.append(" from ");
		sql.append(this.tableName);
		sql.append(" where group_id = '");
		sql.append(groupId).append("'");
		return sql.toString();
	}
	
	private String createUpdateSql(GenericDto dto) {
		String ipAlias = (String)dto.getExtraParams("ipAlias");
		String groupId = (String)dto.getExtraParams("groupId");
		String ipStartAddress = (String)dto.getExtraParams("ipStartAddress");
		String ipEndAddress = (String)dto.getExtraParams("ipEndAddress");
		StringBuffer sql = new StringBuffer();
		sql.append("update ");
		sql.append(this.tableName);
		sql.append(" set ip_alias='");
		sql.append(ipAlias);
		sql.append("', ip_start_address='");
		sql.append(ipStartAddress);
		sql.append("', ip_end_address='");
		sql.append(ipEndAddress);
		sql.append("' where group_id='");
		sql.append(groupId).append("'");
		return sql.toString();
	}
	
	private String createDeleteSql(GenericDto dto) {
		String[] ipGroups = (String[])dto.getExtraParams("groupIds");
		String ipGroupIn = "";
        for (int i = 0; i < ipGroups.length - 1; i++) {
        	ipGroupIn += "'" + ipGroups[i] + "'" + ",";
        }
        ipGroupIn += "'" + ipGroups[ipGroups.length - 1] + "'";
        StringBuffer sql = new StringBuffer();
        sql.append("delete from ");
        sql.append(this.tableName);
        sql.append(" where group_id in (");
        sql.append(ipGroupIn);
        sql.append(")");
        return sql.toString();
	}
}
