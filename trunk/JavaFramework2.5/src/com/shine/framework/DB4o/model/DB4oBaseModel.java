package com.shine.framework.DB4o.model;


public class DB4oBaseModel {
	private String key;
	private Object o;

	public DB4oBaseModel(String key, Object o) {
		this.key = key;
		this.o = o;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Object getO() {
		return o;
	}

	public void setO(Object o) {
		this.o = o;
	}

	public boolean equals(Object rhs) {
		if (rhs == this)
			return true;

		if (!(rhs instanceof DB4oBaseModel))
			return false;

		DB4oBaseModel other = (DB4oBaseModel) rhs;
		return (this.key.equals(other.key));
	}

}
