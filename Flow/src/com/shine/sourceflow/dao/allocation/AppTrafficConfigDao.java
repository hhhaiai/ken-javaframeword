package com.shine.sourceflow.dao.allocation;

import java.util.UUID;

import com.shine.sourceflow.model.GenericDto;

public class AppTrafficConfigDao extends ConfigGenericDao {
	private String sqlField = 
		"id, app_id, app_alias, ip_port, ip_address";
	private String tableName = "app_config";
	
	@Override
	protected String createQuerySql() {
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
	@Override
	protected String createQuerySql(GenericDto dto) {
		String appId = (String)dto.getExtraParams("appId");
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(sqlField);
		sql.append(" from ");
		sql.append(this.tableName);
		sql.append(" where app_id = '");
		sql.append(appId).append("'");
		return sql.toString();
	}
	
	/**
	 * 创建SQL插入语句
	 * 
	 * @param dto
	 * @return
	 */
	@Override
	protected String createInsertSql(GenericDto dto) {
		String appAlias = (String)dto.getExtraParams("appAlias");
		String ipPort = (String)dto.getExtraParams("ipPort");
		String ipAddress = (String)dto.getExtraParams("ipAddress");
		StringBuffer sql = new StringBuffer();
		sql.append("insert into ");
		sql.append(this.tableName);
		sql.append("(app_id, app_alias, ip_port, ip_address) values");
		sql.append("('");
		sql.append(UUID.randomUUID().toString());
		sql.append("','");
		sql.append(appAlias);
		sql.append("',");
		sql.append(ipPort);
		sql.append(",'");
		sql.append(ipAddress);
		sql.append("')");
		return sql.toString();
	}
	
	/**
	 * 创建更新语句 
	 * 
	 * @param dto
	 * @return
	 */
	@Override
	protected String createUpdateSql(GenericDto dto) {
		String appAlias = (String)dto.getExtraParams("appAlias");
		String appId = (String)dto.getExtraParams("appId");
		String ipPort = (String)dto.getExtraParams("ipPort");
		String ipAddress = (String)dto.getExtraParams("ipAddress");
		StringBuffer sql = new StringBuffer();
		sql.append("update ");
		sql.append(this.tableName);
		sql.append(" set app_alias='");
		sql.append(appAlias);
		sql.append("', ip_port='");
		sql.append(ipPort);
		sql.append("', ip_address='");
		sql.append(ipAddress);
		sql.append("' where app_id='");
		sql.append(appId).append("'");
		return sql.toString();
	}
	
	/**
	 * 创建删除语句
	 * 
	 * @param dto
	 * @return
	 */
	@Override
	protected String createDeleteSql(GenericDto dto) {
		String[] appIds = (String[])dto.getExtraParams("appIds");
		String appIdIn = "";
        for (int i = 0; i < appIds.length - 1; i++) {
        	appIdIn += "'" + appIds[i] + "'" + ",";
        }
        appIdIn += "'" + appIds[appIds.length - 1] + "'";
        StringBuffer sql = new StringBuffer();
        sql.append("delete from ");
        sql.append(this.tableName);
        sql.append(" where app_id in (");
        sql.append(appIdIn);
        sql.append(")");
        return sql.toString();
	}

	@Override
	public String getField() {
		return this.sqlField;
	}

	@Override
	public String getTableName() {
		return this.tableName;
	}
}
