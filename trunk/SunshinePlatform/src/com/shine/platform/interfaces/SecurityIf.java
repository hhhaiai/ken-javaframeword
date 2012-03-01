package com.shine.platform.interfaces;

import com.shine.platform.core.model.BaseIf;

public interface SecurityIf extends BaseIf {
	public String security(String date);

	public String unSecurity(String date);
}
