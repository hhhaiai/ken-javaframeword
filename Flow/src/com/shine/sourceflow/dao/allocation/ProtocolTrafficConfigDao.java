package com.shine.sourceflow.dao.allocation;

import java.util.UUID;

import com.shine.sourceflow.model.GenericDto;

public class ProtocolTrafficConfigDao extends ConfigGenericDao {
	private String sqlField = 
		"id, protocol_id, protocol_alias, ip_port";
	private String tableName = "protocol_config";
	
	@Override
	protected String createDeleteSql(GenericDto dto) {
		String[] protocols = (String[])dto.getExtraParams("protocols");
		String protocolIn = "";
        for (int i = 0; i < protocols.length - 1; i++) {
        	protocolIn += "'" + protocols[i] + "'" + ",";
        }
        protocolIn += "'" + protocols[protocols.length - 1] + "'";
        StringBuffer sql = new StringBuffer();
        sql.append("delete from ");
        sql.append(this.tableName);
        sql.append(" where protocol_id in (");
        sql.append(protocolIn);
        sql.append(")");
        return sql.toString();
	}

	@Override
	protected String createInsertSql(GenericDto dto) {
		String protocolAlias = (String)dto.getExtraParams("protocolAlias");
		String ipPort = (String)dto.getExtraParams("ipPort");
		StringBuffer sql = new StringBuffer();
		sql.append("insert into ");
		sql.append(this.tableName);
		sql.append("(protocol_id, protocol_alias, ip_port) values");
		sql.append("('");
		sql.append(UUID.randomUUID().toString());
		sql.append("','");
		sql.append(protocolAlias);
		sql.append("',");
		sql.append(ipPort);
		sql.append(")");
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
		String protocolId = (String)dto.getExtraParams("protocolId");
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(sqlField);
		sql.append(" from ");
		sql.append(this.tableName);
		sql.append(" where protocol_id = '");
		sql.append(protocolId).append("'");
		return sql.toString();
	}

	@Override
	protected String createUpdateSql(GenericDto dto) {
		String protocolAlias = (String)dto.getExtraParams("protocolAlias");
		String protocolId = (String)dto.getExtraParams("protocolId");
		String ipPort = (String)dto.getExtraParams("ipPort");
		StringBuffer sql = new StringBuffer();
		sql.append("update ");
		sql.append(this.tableName);
		sql.append(" set protocol_alias='");
		sql.append(protocolAlias);
		sql.append("', ip_port=");
		sql.append(ipPort);
		sql.append(" where protocol_id='");
		sql.append(protocolId).append("'");
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
