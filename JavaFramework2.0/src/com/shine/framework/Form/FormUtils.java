package com.shine.framework.Form;

import java.util.List;

public class FormUtils {
	/**
	 * 加入表单
	 * @param actionUrl
	 * @param formMethod
	 * @param input
	 * @return
	 */
	public String createForm(String actionUrl, String formMethod,
			List<String> input) {
		
		return null;
	}

	/**
	 * 构造input
	 * 
	 * @param name
	 * @param type
	 * @param value
	 * @return
	 */
	public String createInput(String name, String type, String value) {
		StringBuffer input = new StringBuffer();
		input.append("<input type=\"");
		input.append(type);
		input.append("\" name=\"");
		input.append(name);
		input.append("\" value=\"");
		input.append(value);
		input.append("\" />");
		return input.toString();
	}

	/**
	 * 建立提交按钮
	 * 
	 * @param value
	 * @return
	 */
	public String createSubmit(String value) {
		StringBuffer input = new StringBuffer();
		input.append("<input type=\"submit\" value=\"");
		input.append(value);
		input.append("\" />");
		return input.toString();
	}

	/**
	 * 建立重置按钮
	 * 
	 * @param value
	 * @return
	 */
	public String createReset(String value) {
		StringBuffer input = new StringBuffer();
		input.append("<input type=\"reset\" value=\"");
		input.append(value);
		input.append("\" />");
		return input.toString();
	}
}
