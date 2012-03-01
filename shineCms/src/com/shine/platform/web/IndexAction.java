package com.shine.platform.web;

import com.shine.platform.context.ConfigFactory;

public class IndexAction {
	
	public String execute(){
		System.out.println("index....");
		return "index";
	}
	
	public String getIndexPage(){
		return ConfigFactory.getFactory().getIndexPage();
	}
	
}
