/*
 * OOWeb
 *    
 * Copyright(c)2005, OOWeb developers (see the accompanying "AUTHORS" file)
 *
 * This software is licensed under the 
 * GNU LESSER GENERAL PUBLIC LICENSE, Version 2.1
 *    
 * For more information on distributing and using this program, please
 * see the accompanying "COPYING" file.
 */
package com.shine.framework.OOWeb;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;
import java.util.Map;

import net.sf.ooweb.http.FormEncodedFile;
import net.sf.ooweb.http.RequestState;
import net.sf.ooweb.http.ResponseState;
import net.sf.ooweb.objectmapping.Cacheable;
import net.sf.ooweb.objectmapping.Controller;
import net.sf.ooweb.objectmapping.Exclude;
import net.sf.ooweb.objectmapping.Secure;



/**
 * HelloWorld.  An example controller showing most of the basic OOWeb
 * interaction available to you.
 */
@Controller({"/", "/otherpath"})
public class HelloWorld {
    
    /**
     * Like the index.html/cgi/php page of a normal
     * webserver, the index method is called when 
     * a URL appears without a page
     */
	@Cacheable(0)
    public String index() {
        return "<html><body>" +
            "<p>A simple demo of the flexibility and power of OOWeb</p>" +
            "<ul>" +
            "<li><a href='hello'>Hello World!</a></li>" +
            "<li><a href='cachedHello'>Hello World with a 30 second cache allowance</a></li>" +
            "<li><a href='formget?arg1=test&arg2=maps'>GET test with request params</a></li>" +
            "<li><a href='form'>POST test</a></li>" +
            "<li><a href='upload'>File upload test</a></li>" +
            "<li><a href='session1'>Session test</a></li>" +
            "<li><a href='cookie1'>Cookie test</a></li>" +
            "<li><a href='throwException'>Error test</a></li>" +
            "<li><a href='streamFile'>Stream test</a></li>" +
            "<li><a href='mixStringAndStreams'>Mixing String and Stream test</a></li>" +
            "<li><a href='redirect'>Redirect test</a></li>" +
            "<li><a href='notWebEnabled'>Excluded method (should give a 404)</a></li>" +
            "<li><a href='xmlTest'>XML test (mime type should be overridden to text/xml)</a></li>" +
            "<li><a href='securePage'>Secure Page (manager role needed: login as manager:secret)</a></li>" +
            "</ul></body><" +
            "/html>";
    }

    /**
     * localhost:8080/hello
     */
    public String hello() {
        return "<html><body>Hello World @ " + new Date().toString() + "</body></html>";
    }

    /**
     * localhost:8080/hello - this time it will only update every 30s when the
     * previous response times out
     */
	@Cacheable(30)
    public String cachedHello() {
        return "<html><body>Hello World @ " + new Date().toString() + "</body></html>";
    }
    
    /**
     * accept all query string params as a Map of name/value pairs
     */
    public String formget(RequestState state) {
        StringBuffer sb = new StringBuffer();
    	sb.append("Found the following data in the request:<br><ul>");
    	for (Map.Entry<String, Object> me : state.getRequestArgs().entrySet())
    		sb.append("<li>")
    			.append(me.toString())
    			.append("</li>");
    	
    	sb.append("</ul><br><br>Try changing the request params in the address bar.");
    	return sb.toString();
    }
    
    /**
     * localhost:8080/form
     * are you getting the idea yet?
     */
    @Cacheable(0)
    public String form() {
        return "<html><body><p>Enter some values and hit submit.</p>" +
               "<form name='f1' method='post' action='formpost'>" +
               "<input type='text' name='t1'/>" +
               "<textarea name='t2'></textarea>" +
               "<input type='submit' value='submit'/>" +
               "</form></body></html>";
    }
    
    /**
     * that's right! localhost:8080/formpost and the action
     * referenced by the form() method above.
     */
    public String formpost(RequestState state) {
        Map m = state.getRequestArgs();
        return "You posted me: " + m.get("t1") + " and " + m.get("t2");
    }
    
    /**
     * because this method has the @Exclude annotation,
     * then it won't be accessible as a web method.  Even 
     * though it has a valid signature.
     */
    @Exclude
    public String notWebEnabled() {
        return "you ain't seen me, right?";
    }

    public ResponseState redirect() {
        ResponseState resp = new ResponseState();
        resp.sendRedirect("http://www.bbc.co.uk");
        return resp;
    }
    
    /**
     * uses an InputStream instead of a String to handle the response 
     * body
     * @throws IOException 
     */
    public ResponseState streamFile() throws IOException {
    	File tmp = new File(System.getProperty("java.io.tmpdir"));
    	File target = new File(tmp, "ooweb.test");
    	if (!target.exists()) {
    		FileWriter fw = new FileWriter(target);
    		fw.write("This file was created and streamed by Ooweb!");
    		fw.close();
    	}
    	ResponseState resp = new ResponseState();
    	resp.setBody(target);
    	return resp;
    }
    
    /**
     * uses an InputStream instead of a String to handle the response 
     * body
     * @throws IOException 
     */
    public ResponseState mixStringAndStreams() throws IOException {
    	File tmp = new File(System.getProperty("java.io.tmpdir"));
    	File target = new File(tmp, "ooweb.test");
    	if (!target.exists()) {
    		FileWriter fw = new FileWriter(target);
    		fw.write("This file was created and streamed by Ooweb!");
    		fw.close();
    	}
    	ResponseState resp = new ResponseState();
    	resp.setBody("<h1>This is a String header</h1>");
    	resp.setBody(new FileInputStream(target));
    	resp.setBody("<hr/>And this is a String footer!");
    	return resp;
    }
    
    @SuppressWarnings("unchecked")
    public String session1(RequestState state) {
        state.getSession().put("test1", "58");
        return "<html><body>" +
               "<p>I just added the value pair test1=58 to your session. " +
               "Go <a href='session2'>here</a> to read it back.</p>" +
               "</body></html>";
    }
    
    public String session2(RequestState state) {
        return "<html><body>" +
               "<p>For the key 'test1' in your session, I " +
               "got the value '" + state.getSession().get("test1") + "' back.</p>" +
               "<p>Try <a href='session3'>invalidating the session</a> if you like</p>" + 
               "</body></html>";
    }
    
    public ResponseState session3() {
        ResponseState resp = new ResponseState();
        resp.invalidateSession();
        resp.setBody("<html><body>" +
               "<p>Session invalidated.  Try <a href='session2'>reading</a> " + 
               "the previous value in the session</p>" + 
               "</body></html>");
        return resp;
    }
    
    public ResponseState cookie1() {
        ResponseState resp = new ResponseState();
        resp.addCookie("test2", "53");
        resp.setBody("<html><body>" +
               "<p>I just set the cookie 'test2' with a  value of '53' in " +
               "this response. Go <a href='cookie2'>here</a> to read it back.</p>" +
               "</body></html>");
        return resp;
    }
    
    public String cookie2(RequestState state) {
        Map<String, String> cookies = state.getCookies();
        return "<html><body>" +
               "<p>For the cookie 'test2', I get a value of '" + 
               cookies.get("test2") + "'.</p>" +
               "</body></html>";
    }
    
    public ResponseState xmlTest() {
        ResponseState state = new ResponseState();
        state.setMimeType("text/xml");
        state.setBody("<hello><world>this</world><world>is</world><world>xml</world></hello>");
        return state;
    }
    
    /**
     * you can throw anything you like from your web methods.  They will either
     * be handled internally, or handled by your own code if you implement
     * ErrorHandler in one of your controllers (see below)
     * 
     * @return
     * @throws Exception
     */
    public String throwException() throws Exception {
        throw new Exception("Something went wrong in this method");
    }    

    /**
     * the next 2 methods are secure.  You must have one of the roles specified
     * to be able to access the method.  You can also use this tag on a class
     * definition and make all of its methods secure
     */
    @Secure("manager")
    public String securePage() {
        return "<html><body><h1>Congrats!</h1>You're a manager</body></html>";
    }
    

    @Secure({"manager", "admin"})
    public String secureMethod() {
        return "<html><body><h1>Congrats!</h1>You're a manager or an admin.</body></html>";
    }
     
    /** 
     *  Presents a form allowing the user to upload a file.
     *  Then tells the user some info about it. 
     */
    public String upload() {
    	return "<html><body><form name=\"upload\" enctype=\"multipart/form-data\" action=\"uploadFile\" method=\"post\">" +
    		"<p>Pick a file to upload.</p><p><input type=\"file\" name=\"somefile\"/></p>" +
    		"<p><input type=\"hidden\" value=\"nothing\" name=\"other\">" +
    		"<input type=\"submit\" value=\"submit\"/></p>" +
    		"</form></body></html>";
    }
    
    /**
     * Gives the user info about the file they uploaded. This
     * version specifies the FormEncodedFile in the method.
     * Also demonstrates that multipart works by sending a second
     * textual value in a hidden control.
     * @param m
     * @return
     */
    public String uploadFile(RequestState state) {
    	FormEncodedFile f = (FormEncodedFile) state.getRequestArgs().get("somefile");
    	return "<html><body><p>Info about the file you uploaded:</p>" +
    		"<p>Filename: " + f.getFilename() + "<br/>" +
    		"Size: " + f.getData().length + " bytes<br/>" +
    		"MIMEType: " + f.getMimeType() + "</p>" +
    		"<p><a href=\"/\">Back</a></p></body></html>";
    }
    
}