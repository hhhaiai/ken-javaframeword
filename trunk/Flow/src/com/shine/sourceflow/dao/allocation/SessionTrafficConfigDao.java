package com.shine.sourceflow.dao.allocation;

import java.util.UUID;

import com.shine.sourceflow.model.GenericDto;

public class SessionTrafficConfigDao extends ConfigGenericDao {
	private String sqlField = 
		"id, session_id, session_alias, first_ip, second_ip";
	private String tableName = "session_config";
	
	@Override
	protected String createDeleteSql(GenericDto dto) {
		String[] sessions = (String[])dto.getExtraParams("sessions");
		String sessionIn = "";
        for (int i = 0; i < sessions.length - 1; i++) {
        	sessionIn += "'" + sessions[i] + "'" + ",";
        }
        sessionIn += "'" + sessions[sessions.length - 1] + "'";
        StringBuffer sql = new StringBuffer();
        sql.append("delete from ");
        sql.append(this.tableName);
        sql.append(" where session_id in (");
        sql.append(sessionIn);
        sql.append(")");
        return sql.toString();
	}

	@Override
	protected String createInsertSql(GenericDto dto) {
		String sessionAlias = (String)dto.getExtraParams("sessionAlias");
		String firstIp = (String)dto.getExtraParams("firstIp");
		String secondIp = (String)dto.getExtraParams("secondIp");
		StringBuffer sql = new StringBuffer();
		sql.append("insert into ");
		sql.append(this.tableName);
		sql.append("(session_id, session_alias, first_ip, second_ip) values");
		sql.append("('");
		sql.append(UUID.randomUUID().toString());
		sql.append("','");
		sql.append(sessionAlias);
		sql.append("','");
		sql.append(firstIp);
		sql.append("','");
		sql.append(secondIp);
		sql.append("')");
		return sql.toString();
	}

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

	@Override
	protected String createQuerySql(GenericDto dto) {
		String sessionId = (String)dto.getExtraParams("sessionId");
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(sqlField);
		sql.append(" from ");
		sql.append(this.tableName);
		sql.append(" where session_id = '");
		sql.append(sessionId).append("'");
		return sql.toString();
	}

	@Override
	protected String createUpdateSql(GenericDto dto) {
		String sessionAlias = (String)dto.getExtraParams("sessionAlias");
		String sessionId = (String)dto.getExtraParams("sessionId");
		String firstIp = (String)dto.getExtraParams("firstIp");
		String secondIp = (String)dto.getExtraParams("secondIp");
		StringBuffer sql = new StringBuffer();
		sql.append("update ");
		sql.append(this.tableName);
		sql.append(" set session_alias='");
		sql.append(sessionAlias);
		sql.append("', first_ip='");
		sql.append(firstIp);
		sql.append("', second_ip='");
		sql.append(secondIp);
		sql.append("' where session_id='");
		sql.append(sessionId).append("'");
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
