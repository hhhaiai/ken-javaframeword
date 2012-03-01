package com.shine.plugins.CmsPage;

import java.util.List;

import com.shine.Plugin.Plugin;
import com.shine.Plugin.util.PluginTypes;
import com.shine.platform.interfaces.PageIf;
import com.shine.plugins.CmsPage.util.CmsPageUtil;

/**
 * cms页面管理
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class CmsPagePlugin extends Plugin implements PageIf {

	private String views = "www";

	public CmsPagePlugin() {
		this.initPlugin("CmsPage", "1.0", PluginTypes.CLASSPATH, "", "CmsPage");
	}

	public String getPage(String uploadName, String pageName) {
		return CmsPageUtil.makeupPagePath(views, uploadName, pageName);
	}

	public String setPage(String pageName, String pagePath) {
		// TODO Auto-generated method stub
		return null;
	}

	public Plugin getPlugin() {
		// TODO Auto-generated method stub
		return this;
	}

	public String pluginStatus() {
		// TODO Auto-generated method stub
		return this.getStatus();
	}

	@Override
	protected void pluginDestroy() {
		// TODO Auto-generated method stub
	}

	@Override
	protected void pluginSleep() {
		// TODO Auto-generated method stub
	}

	@Override
	protected void pluginStart() {
		// TODO Auto-generated method stub
	}

	public String getPageData() {
		// TODO Auto-generated method stub
		return null;
	}

	public boolean editPageContent(String uploadName, String pageName,
			String pageContent) {
		// TODO Auto-generated method stub
		return false;
	}

	public List<String> getAllUploadPageType() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getPageData(String uploadName) {
		// TODO Auto-generated method stub
		return null;
	}

	public String setPage(String uploadName, String pageName, String pagePath) {
		// TODO Auto-generated method stub
		return null;
	}

	public boolean uploadPage(String uploadName, String pageZipPath) {
		// TODO Auto-generated method stub
		return false;
	}
}
