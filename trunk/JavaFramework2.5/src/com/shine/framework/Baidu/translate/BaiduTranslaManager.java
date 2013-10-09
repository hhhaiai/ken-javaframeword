package com.shine.framework.Baidu.translate;

import java.net.URLEncoder;

import org.apache.http.client.methods.HttpGet;

import com.google.gson.Gson;
import com.shine.framework.Baidu.translate.model.TranslateMode;

public class BaiduTranslaManager {
	private static BaiduTranslaManager manager = null;

	public static BaiduTranslaManager getManager() {
		if (manager == null)
			manager = new BaiduTranslaManager();
		return manager;
	}

}
