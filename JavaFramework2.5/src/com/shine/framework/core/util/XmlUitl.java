package com.shine.framework.core.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.net.ftp.FTPFile;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.DOMReader;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import com.shine.Ftp.util.FtpHelper;

/**
 * XmlUitl
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2010-12-03
 */
public class XmlUitl {

	protected Document document = null;

	// 递归用的遍历结果列表
	private List<Element> elementList = null;

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

	public List<Element> getElementList() {
		return elementList;
	}

	public void setElementList(List<Element> elementList) {
		this.elementList = elementList;
	}

	public XmlUitl() {
		elementList = new ArrayList<Element>();
	}

	/**
	 * 递归遍历方法
	 * 
	 * @param element
	 */
	@SuppressWarnings("unused")
	private void getElementList(Element element, boolean leaf) {
		List<?> elements = element.elements();
		if (elements.size() == 0) {
			elementList.add(element);
		} else {
			if (!leaf)
				elementList.add(element);
			for (Iterator<?> it = elements.iterator(); it.hasNext();) {
				Element elem = (Element) it.next();
				getElementList(elem, leaf);
			}
		}
	}

	/**
	 * 递归遍历方法
	 * 
	 * @param element
	 */
	private void getElementList(Element element, String tag, boolean leaf) {
		List<?> elements = element.elements();
		if (elements.size() == 0 && element.getName().equals(tag)) {
			elementList.add(element);
		} else {
			if (!leaf && element.getName().equals(tag))
				elementList.add(element);
			for (Iterator<?> it = elements.iterator(); it.hasNext();) {
				Element elem = (Element) it.next();
				getElementList(elem, tag, leaf);
			}
		}
	}

	/**
	 * 判断字符类型 主要判断字符串是否是xml
	 * 
	 * @param String
	 * @return String
	 */
	public static String getStringType(String str) {
		try {
			@SuppressWarnings("unused")
			Document document = DocumentHelper.parseText(str);
			return "XML";
		} catch (Exception e) {
			return "String";
		}
	}

	/**
	 * String to dom4j xml document
	 * 
	 * @param str
	 * @return
	 */
	public static Document string2Document(String str) {
		try {
			// return DocumentHelper.parseText(str);
			SAXReader saxReader = new SAXReader();

			return saxReader.read(new ByteArrayInputStream(str.getBytes()));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * w3c Document to dom4j Document
	 * 
	 * @param doc
	 * @return
	 */
	public static Document getW3CDocument(org.w3c.dom.Document doc) {
		DOMReader reader = new DOMReader();
		return reader.read(doc);
	}

	/**
	 * xml document to string
	 * 
	 * @param document
	 * @return
	 */
	public static String doc2String(Document document) {
		String s = "";
		try {
			// 使用输出流来进行转化
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			// 使用UTF-8编码
			OutputFormat format = new OutputFormat("   ", true, "UTF-8");
			XMLWriter writer = new XMLWriter(out, format);
			writer.write(document);
			s = out.toString("UTF-8");
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return s;
	}

	/**
	 * 获取document
	 * 
	 * @param path
	 * @return
	 * @throws DocumentException
	 */
	public static Document getFileDocument(String path)
			throws DocumentException {
		SAXReader reader = new SAXReader();
		File file = new File(path);
		if (file.exists()) {
			return reader.read(file);
		} else {
			System.err.println(XmlUitl.class.toString() + "Exception_"
					+ "no exists File:" + path);
			return null;
		}
	}

	/**
	 * 获取某节点的所有子节点,通过path
	 * 
	 * @param xmlPath
	 * @param elementName
	 * @return
	 * @throws DocumentException
	 */
	public static List<Element> getAllElementByPath(String xmlPath,
			String elementName) throws DocumentException {
		return getAllElement(getFileDocument(xmlPath).getRootElement(),
				elementName);
	}

	/**
	 * 获取某节点的所有子节点
	 * 
	 * @param document
	 * @param elementName
	 * @return
	 */
	public static List<Element> getAllElement(Element element,
			String elementName) {
		List<Element> list = new ArrayList<Element>();
		List<?> nodes = element.elements(elementName);
		for (Iterator<?> it = nodes.iterator(); it.hasNext();) {
			Element elm = (Element) it.next();
			list.add(elm);
		}
		return list;
	}

	/**
	 * 获取某节点的所有子节点
	 * 
	 * @param element
	 * @return
	 */
	public static List<Element> getAllElement(Element element) {
		List<Element> list = new ArrayList<Element>();
		List<?> nodes = element.elements();
		for (Iterator<?> it = nodes.iterator(); it.hasNext();) {
			Element elm = (Element) it.next();
			list.add(elm);
		}
		return list;
	}

	/**
	 * 获取某个节点的所有属性
	 * 
	 * @param element
	 * @return
	 */
	public static Map<String, String> getAllAttribute(Element element) {
		Map<String, String> map = new HashMap<String, String>();
		for (Iterator<?> it = element.attributeIterator(); it.hasNext();) {
			Attribute attribute = (Attribute) it.next();
			map.put(attribute.getName(), attribute.getValue());
		}
		return map;
	}

	/**
	 * 批量修改结点的属性
	 * 
	 * @param element
	 * @param map
	 * @return
	 */
	public static Element addorEditAttribute(Element element,
			Map<String, String> map) {
		String[][] data = DataUtil.getArrayFromMap(map);
		map = null;
		return addorEditAttribute(element, data);
	}

	/**
	 * 批量修改结点的属性
	 * 
	 * @param element
	 * @param data
	 * @return
	 */
	public static Element addorEditAttribute(Element element, String[][] data) {
		for (int i = 0; i < data[0].length; i++) {
			element.addAttribute(data[0][i], data[1][i]);
		}
		data = null;
		return element;
	}

	/**
	 * 获取所有的标签
	 * 
	 * @param doc
	 * @param tag
	 * @return
	 */
	public static List<Element> getAllTag(Document doc, String tag) {
		return getAllTag(doc, tag, true);
	}

	/**
	 * 获取所有的标签
	 * 
	 * @param doc
	 * @param tag
	 * @param leaf
	 * @return
	 */
	public static List<Element> getAllTag(Document doc, String tag, boolean leaf) {
		XmlUitl util = new XmlUitl();
		util.getElementList(doc.getRootElement(), tag, leaf);
		return util.getElementList();
	}

	/**
	 * 保存xml file
	 * 
	 * @param xmlContent
	 * @param xmlPath
	 * @return
	 */
	public static boolean saveXmlFile(String xmlContent, String xmlPath) {
		if (FileUtil.checkFile(xmlPath))
			FileUtil.writeFile(xmlPath, xmlContent);
		else
			FileUtil.createFile(xmlPath, xmlContent);
		return true;
	}

	/**
	 * 保存xml file
	 * 
	 * @param element
	 * @param xmlPath
	 * @return
	 */
	public static boolean saveXmlFile(Element element, String xmlPath) {
		FileUtil.createFile(xmlPath, doc2String(element.getDocument()));
		return true;
	}

	/**
	 * 保存xml file
	 * 
	 * @param doc
	 * @param xmlPath
	 * @return
	 */
	public static boolean saveXmlFile(Document doc, String xmlPath) {
		FileUtil.createFile(xmlPath, doc2String(doc));
		return true;
	}

	public static byte[] compressXml(String xml) {
		return null;
	}

	/**
	 * 删除根节点下的所有子节点
	 */
	public static void deleteAllSubElement(String xmlPath) throws Exception {
		Element rootElement = getRootElement(xmlPath);
		List<Element> list = getAllElement(rootElement);
		for (int i = 0; i < list.size(); i++) {
			rootElement.remove(list.get(i));
		}
		saveXmlFile(rootElement, xmlPath);
	}

	/**
	 * 
	 * 获取根节点
	 * 
	 * @param xmlPath
	 * @return
	 * @throws Exception
	 */
	public static Element getRootElement(String xmlPath) throws Exception {
		return getFileDocument(xmlPath).getRootElement();
	}

	/**
	 * 格式化XML输出，并保存
	 * 
	 * @param document
	 * @throws Exception
	 */
	public static void saveAndFormatXML(Document document, String xmlPath)
			throws Exception {
		XMLWriter output = new XMLWriter();
		// 输出格式化
		OutputFormat format = OutputFormat.createPrettyPrint();
		output = new XMLWriter(new FileWriter(xmlPath), format);
		output.write(document);
		output.close();
	}

	/**
	 * 是否存在预设值
	 * 
	 * @return
	 */
	public static Boolean isExistRecord(String xmlPath, String ip)
			throws Exception {
		Element rootElement = getRootElement(xmlPath);
		Element element = (Element) rootElement
				.selectSingleNode("//snmpvs/snmpv[@ip='" + ip + "']");
		if (element != null) {
			return true;
		}
		return false;
	}

	/**
	 * 创建XML文件
	 * 
	 * @return
	 */
	public static Document createDocument() {

		return DocumentHelper.createDocument();
	}

	/**
	 * 【创建根节点】
	 * 
	 * @param document
	 * @param rootName
	 * @param data
	 *            (属性)
	 * @return
	 */
	public static Element createRootElement(Document document, String rootName,
			String data[][]) {

		return addorEditAttribute(document.addElement(rootName), data);
	}

	/**
	 * 【添加节点】并初始化属性,文本值
	 * 
	 * @param element
	 *            (父节点)
	 * @param elementName
	 * @param data
	 *            (属性)
	 * @param text
	 * @return
	 */
	public static Element addElement(Element element, String elementName,
			String[][] data, String text) {

		Element newElement = addorEditAttribute(
				element.addElement(elementName), data);
		if (text != null)
			newElement.setText(text);
		return newElement;
	}

	/**
	 * 创建XML文档，并初始化根节点
	 * 
	 * @param rootName
	 * @param data
	 *            (属性)
	 * @return
	 */
	public Element getRootElement(String rootName, String data[][]) {
		document = XmlUitl.createDocument();
		return XmlUitl.createRootElement(document, rootName, data);
	}

	/**
	 * XML转String
	 * 
	 * @param xmlPath
	 *            (XML路径)
	 * @return
	 */
	public static String doc2String(String xmlPath) {
		String s = "";
		try {
			Document document = getFileDocument(xmlPath);
			// 使用输出流来进行转化
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			// 使用UTF-8编码
			OutputFormat format = new OutputFormat("   ", true, "UTF-8");
			XMLWriter writer = new XMLWriter(out, format);
			writer.write(document);
			s = out.toString("UTF-8");
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return s;
	}

	public static void main(String args[]) {
		try {
			String[] str = { "192.168.1.1", "162",
					"com.shine.framework.core.util.SnmpHelper", "100" };
			//XmlUitl.modifyXml("src/com/shine/SnmpPool/config/snmpv.xml", str);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
