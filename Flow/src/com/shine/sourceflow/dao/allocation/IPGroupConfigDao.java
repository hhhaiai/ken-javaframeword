package com.shine.sourceflow.dao.allocation;

import java.util.UUID;

import com.shine.sourceflow.model.GenericDto;

public class IPGroupConfigDao extends ConfigGenericDao {
	private String sqlField = 
		"id, group_id, ip_alias, ip_start_address, ip_end_address";
	private String tableName = "ip_group_config";
	
	/**
	 * 创建SQL插入语句
	 * 
	 * @param dto
	 * @return
	 */
	@Override
	protected String createInsertSql(GenericDto dto) {
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
	
	@Override
	protected String createUpdateSql(GenericDto dto) {
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
	
	@Override
	protected String createDeleteSql(GenericDto dto) {
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

	@Override
	public String getField() {
		return this.sqlField;
	}

	@Override
	public String getTableName() {
		return this.tableName;
	}
}
