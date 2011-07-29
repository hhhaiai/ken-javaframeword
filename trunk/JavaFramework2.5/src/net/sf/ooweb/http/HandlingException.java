/*
 * ooweb
 *    
 * Copyright(c)2005, ooweb developers (see the accompanying "AUTHORS" file)
 *
 * This software is licensed under the 
 * APACHE LICENSE, Version 2.0
 *    
 * For more information on distributing and using this program, please
 * see the accompanying "COPYING" file.
 */
package net.sf.ooweb.http;




/**
 * HandlingException
 * 
 * @author Darren Davison
 * @since 0.7
 */
@SuppressWarnings("serial")
public class HandlingException extends Exception {
	
	private ResponseState responseState;

    /**
     * 
     */
    public HandlingException() {
        super();
    }

    /**
     * @param arg0
     */
    public HandlingException(String arg0) {
        super(arg0);
    }

    /**
     * @param arg0
     * @param arg1
     */
    public HandlingException(String arg0, Throwable arg1) {
        super(arg0, arg1);
    }

    /**
     * @param arg0
     */
    public HandlingException(Throwable arg0) {
        super(arg0);
    }

	/**
	 * @param responseState
	 */
	public HandlingException(ResponseState responseState) {
		this.responseState = responseState;
	}

	/**
	 * @return the embedded ResponseState, if any, or null
	 */
	public ResponseState getResponseState() {
		return responseState;
	}

}
