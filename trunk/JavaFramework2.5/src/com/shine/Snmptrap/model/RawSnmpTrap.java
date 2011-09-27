package com.shine.Snmptrap.model;

import com.shine.framework.core.util.DateUtil;

/**
 * 原始snmp trap model
 * @author viruscodecn@gmail.com
 *
 */
public class RawSnmpTrap {
	private String id;
	private String logTime;
	private int version;
	private int generic;
	private int specify;
	private String enterpriseOid;
	private String ipAddress;
	private String alias;
	private String original;
	private String translation;
	private String mibName;
	private int tag;

	public RawSnmpTrap() {
		this.id = DateUtil.getCurrentDateTimeAsId();
		this.logTime = DateUtil.getCurrentDateTime();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLogTime() {
		return logTime;
	}

	public void setLogTime(String logTime) {
		this.logTime = logTime;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public int getGeneric() {
		return generic;
	}

	public void setGeneric(int generic) {
		this.generic = generic;
	}

	public int getSpecify() {
		return specify;
	}

	public void setSpecify(int specify) {
		this.specify = specify;
	}

	public String getEnterpriseOid() {
		return enterpriseOid;
	}

	public void setEnterpriseOid(String enterpriseOid) {
		this.enterpriseOid = enterpriseOid;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getOriginal() {
		return original;
	}

	public void setOriginal(String original) {
		this.original = original;
	}

	public String getTranslation() {
		return translation;
	}

	public void setTranslation(String translation) {
		this.translation = translation;
	}

	public String getMibName() {
		return mibName;
	}

	public void setMibName(String mibName) {
		this.mibName = mibName;
	}

	public int getTag() {
		return tag;
	}

	public void setTag(int tag) {
		this.tag = tag;
	}

}
