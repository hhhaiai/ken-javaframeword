package com.shine.util.xml;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

final public class JDomUtil {
	private JDomUtil() {
	}

	/**
	 * 将文件加载到Document
	 * 
	 * @param filePath
	 *            文件路径
	 * @return
	 */
	public static Document file2Doc(final String filePath) {
		return file2Doc(filePath, false);
	}

	/**
	 * 将文件加载到Document
	 * 
	 * @param filePath
	 *            文件路径
	 * @param validate
	 *            是否验证
	 * @return
	 */
	public static Document file2Doc(final String filePath, boolean validate) {
		SAXBuilder builder = new SAXBuilder(validate);
		Document doc = null;
		try {
			doc = builder.build(new File(filePath));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return doc;
	}

	/**
	 * Stream加载成Document
	 * @param stream
	 * @param validate
	 * @return
	 */
	public static Document stream2Doc(InputStream stream, boolean validate) {
		SAXBuilder builder = new SAXBuilder(validate);
		Document doc = null;
		try {
			doc = builder.build(stream);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return doc;
	}

	/**
	 * Stream加载成Document
	 * @param stream
	 * @return
	 */
	public static Document stream2Doc(InputStream stream) {
		return stream2Doc(stream, false);
	}

	/**
	 * Document转成String
	 * 
	 * @param doc
	 * @return
	 */
	public static String doc2String(final Document doc) {
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			PrintWriter pw = new PrintWriter(baos);
			Format format = Format.getCompactFormat();
			format.setEncoding("UTF-8");
			XMLOutputter xmlop = new XMLOutputter();
			xmlop.setFormat(format);
			xmlop.output(doc, pw);

			return baos.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * String转成Document
	 * 
	 * @param xml
	 * @return
	 */
	public static Document string2Doc(final String xml) {
		Document doc = null;
		try {
			StringReader sr = new StringReader(xml);
			InputSource is = new InputSource(sr);
			doc = (new SAXBuilder()).build(is);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return doc;
	}

	/**
	 * 通过xpath查询单个节点
	 * 
	 * @param root
	 * @param path
	 * @return
	 */
	public static Element getElement(Element root, String path) {
		try {
			return (Element) XPath.selectSingleNode(root, path);
		} catch (JDOMException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 通过xpath查询多个节点
	 * 
	 * @param root
	 * @param path
	 * @return
	 */
	public static List getElements(Element root, String path) {
		try {
			return XPath.selectNodes(root, path);
		} catch (JDOMException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 更新xml文件
	 * 
	 * @param xmlPath
	 *            xml文件路径
	 * @param doc
	 */
	public static void updateXML(String xmlPath, Document doc) {
		FileOutputStream fos = null;
		try {
			xmlPath = xmlPath.replace("%20", " ");
			Format format = Format.getCompactFormat();
			format.setEncoding("utf-8");
			format.setIndent("	");
			XMLOutputter serializer = new XMLOutputter(format);
			fos = new FileOutputStream(xmlPath);
			serializer.output(doc, fos);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (fos != null)
					fos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
