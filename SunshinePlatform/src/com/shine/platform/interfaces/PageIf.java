package com.shine.platform.interfaces;

import java.util.List;

import com.shine.platform.core.model.BaseIf;

/**
 * 页面控制接口
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public interface PageIf extends BaseIf {

	/**
	 * 上传zip的
	 * 
	 * @param uploadName
	 * @param pageZipPath
	 * @return
	 */
	public boolean uploadPage(String uploadName, String pageZipPath);

	/**
	 * 获取页面
	 * 
	 * @param uploadName
	 * @param pageName
	 * @return
	 */
	public String getPage(String uploadName, String pageName);

	/**
	 * 设置页面
	 * 
	 * @param uploadName
	 * @param pageName
	 * @param pagePath
	 * @return
	 */
	public String setPage(String uploadName, String pageName, String pagePath);

	/**
	 * 修改页面内容
	 * 
	 * @param uploadName
	 * @param pageName
	 * @param pageContent
	 * @return
	 */
	public boolean editPageContent(String uploadName, String pageName,
			String pageContent);

	/**
	 * 
	 * 获取所有上传类型
	 * 
	 * @return
	 */
	public List<String> getAllUploadPageType();

	/**
	 * 获取所有页面数据
	 * 
	 * @param uploadName
	 * @return
	 */
	public String getPageData(String uploadName);

}
