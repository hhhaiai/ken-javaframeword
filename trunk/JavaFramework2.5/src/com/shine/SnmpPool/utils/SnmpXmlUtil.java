package com.shine.SnmpPool.utils;

import java.util.Iterator;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;

import com.shine.framework.core.util.XmlUitl;

public class SnmpXmlUtil {
	/**
	 * 创建节点(SNMP采集)
	 * 
	 */
	public static void createSubElement(String xmlPath, String ip, int port,
			String vstr, int version) throws Exception {
		Document document = XmlUitl.getFileDocument(xmlPath);
		Element rootElement = document.getRootElement();
		rootElement.addElement("snmpv").addAttribute("ip", ip).addAttribute(
				"port", "" + port).addAttribute("vstr", vstr).addAttribute(
				"version", "" + version);
		XmlUitl.saveAndFormatXML(document, xmlPath);
	}

	/**
	 * 
	 * 修改节点(SNMP采集)
	 * 
	 * @param ip
	 * @param xmlPath
	 * @return
	 */
	public static void modifyXml(String xmlPath, String[] data)
			throws Exception {
		String ip = data[0];
		Document document = XmlUitl.getFileDocument(xmlPath);
		Element rootElement = document.getRootElement();
		Element element = (Element) rootElement
				.selectSingleNode("//snmpvs/snmpv[@ip='" + ip + "']");
		if (element != null) {
			int flag = 0;
			for (Iterator<Element> i = element.attributeIterator(); i.hasNext();) {
				Attribute attribute = (Attribute) i.next();
				// 修改属性值
				attribute.setValue(data[flag]);
				flag++;
			}
		}
		// 保存修改
		XmlUitl.saveAndFormatXML(document, xmlPath);
	}
}
