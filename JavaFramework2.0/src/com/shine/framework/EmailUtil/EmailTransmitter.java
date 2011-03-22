package com.shine.framework.EmailUtil;

import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

/**
 * 邮件发送器
 * @author JiangKunpeng
 *
 */
public class EmailTransmitter {
	private String smtpServer;	//SMTP服务器
	private String username;	//用户名
	private String password;	//密码
	private String fromEmail;	//发件邮箱
	private String sender;		//发件人
	private boolean isAuth;		//是否要用户验证
	
	private Properties props = null;
	private SmtpAuth smtpAuth = null;
	
	/**
	 * 构建邮件发送器
	 * @param smtpServer	smtp服务  如：smtp.gmail.com
	 * @param username		用户名,不是邮箱 如：softjiang
	 * @param password		密码
	 * @param sender		发件人
	 * @param fromEmail		发件人邮箱,完整的邮箱地址
	 */
	public EmailTransmitter(String smtpServer,String username,String password,String sender,String fromEmail){
		this.smtpServer = smtpServer;
		this.username = username;
		this.password = password;
		this.sender = sender;
		this.fromEmail = fromEmail;
		this.isAuth = true;
		
		props = System.getProperties();
		initProps();
	}
	
	/**
	 * 构建邮件发送器(没用户验证)
	 * @param smtpServer
	 * @param sender
	 * @param fromEmail
	 */
	public EmailTransmitter(String smtpServer,String sender,String fromEmail){
		this.smtpServer = smtpServer;
		this.sender = sender;
		this.fromEmail = fromEmail;
		this.isAuth = false;
		
		props = System.getProperties();
		initProps();
	}
	
	private void initProps(){
		props.put("mail.smtp.host", smtpServer);
		if(isAuth){
			props.put("mail.smtp.auth", "true");
			smtpAuth = new SmtpAuth(username, password);
		}else{
			props.put("mail.smtp.auth", "false");
		}
		
		//专门处理gmail服务  端口：465
		if(this.smtpServer.indexOf("smtp.gmail.com")>=0)
        {
			props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory"); 
			props.setProperty("mail.smtp.socketFactory.fallback", "false"); 
			props.setProperty("mail.smtp.port", "465"); 
			props.setProperty("mail.smtp.socketFactory.port", "465"); 
        }
	}
	
	/**
	 * 发送邮件
	 * @param subject	主题
	 * @param content	内容
	 * @param to		接受邮件的邮箱地址
	 * @param attach	附件
	 */
	public void send(String subject,String content,String[] to,String[] attach){
		Session session = null;
		Transport trans = null;
		InternetAddress[] sendTo = null;
		try{
			session = Session.getInstance(props, smtpAuth);
			session.setDebug(false);
			
			Message msg = new MimeMessage(session);
			Address fromAddress = new InternetAddress(fromEmail,sender);
			msg.setFrom(fromAddress);

			sendTo = new InternetAddress[to.length];
			
			for(int i=0;i<to.length;i++){
				sendTo[i] = new InternetAddress(to[i]);
			}
			
			msg.setRecipients(Message.RecipientType.TO, sendTo);
			msg.setSubject(subject);
			
			Multipart mp = new MimeMultipart();
			MimeBodyPart mbp = new MimeBodyPart();
			mbp.setContent(content, "text/html;charset=gb2312");
			mp.addBodyPart(mbp);
			
			//附件处理
			if(attach!=null&&attach.length>0){
				for (String atta : attach) {
					MimeBodyPart mbp2 = new MimeBodyPart();
					FileDataSource fds = new FileDataSource(atta);	//数据源
					mbp2.setDataHandler(new DataHandler(fds)); 		// 得到附件本身并至入BodyPart
					mbp2.setFileName(MimeUtility.encodeText(fds.getName())); 	// 得到文件名同样至入BodyPart,乱码处理
					mp.addBodyPart(mbp2);
				}
			}
		    
			msg.setContent(mp); // Multipart加入到信件
			msg.setSentDate(new Date()); // 设置信件头的发送日期
			// 发送信件
			msg.saveChanges();
			trans = session.getTransport("smtp");
			trans.connect(smtpServer, username, password);
			trans.sendMessage(msg, msg.getAllRecipients());
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				if(trans!=null){
					trans.close();
					trans = null;
				}
			} catch (MessagingException e) {
				e.printStackTrace();
			}
			sendTo = null;
		}
	}
	
}
