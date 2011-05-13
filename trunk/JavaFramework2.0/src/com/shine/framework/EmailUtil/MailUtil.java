package com.shine.framework.EmailUtil;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.mail.internet.MimeUtility;

import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;
import org.apache.commons.mail.SimpleEmail;

import com.shine.framework.LogUtil.Logger;
import com.shine.framework.core.util.DataUtil;
import com.shine.framework.core.util.XmlConverUtil;

@SuppressWarnings("unchecked")
public class MailUtil {

	/**
	 * 发送简单邮件（不含附件）
	 * 
	 * @param xml
	 *            (注：格式形如
	 *            <email><host>smtp.163.com</host><fromEmail>hejielun2009
	 * @163.com</fromEmail>...</email>）
	 */
	public static boolean sendSimpleMail(String xml) {
		if (DataUtil.isNull(xml))
			return false;

		Map<String, String> map = XmlConverUtil.xmltoMap(xml);

		SimpleEmail email = new SimpleEmail();
		email.setHostName(map.get("host"));
		email.setAuthentication(map.get("fromEmail"), map.get("password"));
		email.setSubject(map.get("subject"));
		try {
			email.addTo(map.get("fromEmail"), map.get("fromName"));
			email.setFrom(map.get("toEmail"), map.get("toName"));
			email.setMsg(map.get("msg"));
			email.send();
		} catch (EmailException e) {
			e.printStackTrace();
			return false;
		}

		return true;
	}

	/**
	 * 发送简单email
	 * 
	 * @param smtpHost
	 * @param smtpPort
	 * @param fromEmail
	 * @param fromName
	 * @param fromPassword
	 * @param targetEmail
	 * @param targetName
	 * @param subject
	 * @param emailContent
	 * @return
	 */
	public static boolean sendSimpleMail(String smtpHost, String smtpPort,
			String fromEmail, String fromName, String fromPassword,
			String targetEmail, String targetName, String subject,
			String emailContent) {
		try {
			SimpleEmail email = new SimpleEmail();
			email.setHostName(smtpHost);
			email.setAuthentication(fromEmail, fromPassword);
			email.setSubject(subject);
			email.addTo(fromEmail, fromName);
			email.setFrom(targetEmail, targetName);
			email.setMsg(emailContent);
			email.send();
			return true;
		} catch (Exception e) {
			Logger.getInstance().log(e.getMessage());
			return false;
		}
	}

	/**
	 * 发送邮件（含附件） 注：(可以添加多个附件，可以群发）
	 * 
	 * @param xml
	 *            (注：格式形如
	 *            <email><host>smtp.163.com</host><fromEmail>hejielun2009
	 * @163.com </fromEmail>...<path>d://a.ico,d://b.ico</path></email>）
	 * @throws UnsupportedEncodingException
	 */
	public static boolean sendAttachmentMail(String xml) {
		if (DataUtil.isNull(xml))
			return false;

		Map<String, String> map = XmlConverUtil.xmltoMap(xml);

		MultiPartEmail email = new MultiPartEmail();

		email.setHostName(map.get("host"));
		try {
			email.addTo(map.get("fromEmail"), map.get("fromName"));
			email.setMsg(map.get("msg"));
		} catch (EmailException e) {
			e.printStackTrace();
			return false;
		}
		email.setAuthentication(map.get("fromEmail"), map.get("password"));
		email.setSubject(map.get("subject"));

		// 添加附件（多个附件）
		EmailAttachment emailattachment = new EmailAttachment();
		emailattachment.setDisposition(EmailAttachment.ATTACHMENT);
		// emailattachment.setDescription("This is Smile picture");
		String[] paths = map.get("path").split(",");
		for (String path : paths) {
			emailattachment.setPath(path);
			try {
				emailattachment.setName(MimeUtility.encodeText(DataUtil
						.getFileName(path)));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
				return false;
			}
			try {
				email.attach(emailattachment);
			} catch (EmailException e) {
				e.printStackTrace();
				return false;
			}
		}

		// 接收人信息(多人群发）
		String[] toEmails = map.get("toEmail").split(",");
		String[] toNames = map.get("toName").split(",");
		for (int i = 0; i < toEmails.length; i++) {
			try {
				email.setFrom(toEmails[i], toNames[i]);
				// 发送邮件
				email.send();
			} catch (EmailException e) {
				e.printStackTrace();
				return false;
			}
		}
		return true;
	}
	
	
	
}
