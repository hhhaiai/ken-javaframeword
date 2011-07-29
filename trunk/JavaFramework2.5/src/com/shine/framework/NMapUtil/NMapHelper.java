package com.shine.framework.NMapUtil;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import org.dom4j.DocumentException;
import org.dom4j.Element;

import com.shine.framework.NMapUtil.utils.NmapResultList;
import com.shine.framework.core.util.CmdUtil;
import com.shine.framework.core.util.FileUtil;
import com.shine.framework.core.util.XmlUitl;

public class NMapHelper {
	private String commond = " -sP -PT -PT ";

	public String getCreateXmlCommond(String ip, String filePath,
			String nmapPath) {
		StringBuffer xmlCommond = new StringBuffer();
		xmlCommond.append(nmapPath);
		xmlCommond.append(commond);
		xmlCommond.append(ip);
		xmlCommond.append(" -oX ");
		xmlCommond.append(filePath);
		return xmlCommond.toString();
	}

	public String getCreateTextCommond(String ip, String filePath,
			String nmapPath) {
		StringBuffer xmlCommond = new StringBuffer();
		xmlCommond.append(nmapPath);
		xmlCommond.append(commond);
		xmlCommond.append(ip);
		xmlCommond.append(" -oN ");
		xmlCommond.append(filePath);
		return xmlCommond.toString();
	}

	public NmapResultList executeXmlFile(String filePath)
			throws DocumentException {
		String fileContent = FileUtil.readFile(filePath);
		if (fileContent.indexOf("nmaprun") != -1) {
			if (!fileContent.endsWith("</nmaprun>")) {
				FileUtil.appandFile(filePath, "</nmaprun>");
			}
		}
		System.out.println(FileUtil.readFile(filePath));
		List<Element> list = XmlUitl.getAllTag(XmlUitl
				.getFileDocument(filePath), "address");
		for (Element e : list) {
			System.out.println(e.toString());
		}
		return null;
	}

	public void executeLinuxCommond(String commond) {
		try {
			CmdUtil.exeuteBatCmd(commond);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public NmapResultList getNmapResultFromXml(String ip, String filePath,
			String nmapPath) throws DocumentException {
		executeLinuxCommond(getCreateXmlCommond(ip, filePath, nmapPath));
		return executeXmlFile(filePath);
	}

	public NmapResultList getNmapResult(String ip, String filePath,
			String nmapPath) {

		return null;
	}
}
