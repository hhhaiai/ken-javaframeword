package com.shine.platform.interfaces;

import com.shine.platform.core.model.BaseIf;

public interface LoggerIf extends BaseIf {
	public void initLoggerFilePath();

	public String log(Exception e);

	public String log(String err);
}
