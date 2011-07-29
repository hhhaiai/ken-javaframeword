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
package net.sf.ooweb.http;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Represents a file received via a multipart/form-data POST
 * 
 * @author Robin Rawson-Tetley
 */
public class FormEncodedFile {

	private String filename = "";
	private String mimeType = "";
	private String name = "";
	private byte[] data = null;
	
	/**
	 * @param name
	 * @param filename
	 * @param mimeType
	 * @param data
	 */
	public FormEncodedFile(String name, String filename, String mimeType, byte[] data) {
		this.filename = filename;
		this.mimeType = mimeType;
		this.name = name;
		this.data = data;
	}
	
	/**
	 * @return the field name
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * @return the filename used in the file upload
	 */
	public String getFilename() {
		return filename;
	}
	
	/**
	 * @return the mime type of the file
	 */
	public String getMimeType() {
		return mimeType;
	}

	/**
	 * @return the raw data of the file as a byte[]
	 */
	public byte[] getData() {
		return data;
	}
	
	/**
	 * Saves the file to disk
	 * 
	 * @param f the File to save
	 * @throws IOException if the file save fails
	 */
	public void saveToFile(File f) throws IOException {
		FileOutputStream o = new FileOutputStream(f);
		o.write(data);
		o.flush();
		o.close();
	}
	
	/**
	 * returns a simple representation of the file type
	 * 
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return "[FormEncodedFile, name=" + name + ", filename=" + filename +
			", mimeType=" + mimeType + ", data=" + data.length + "bytes]";
	}
	
}
