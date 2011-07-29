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
package net.sf.ooweb.objectmapping;


/**
 * ObjectAndMethod is a simple value object holding the name of 
 * the mapped object and the required method to call on that
 * object.
 * 
 * @author Darren Davison
 * @since 0.5
 */
public class ObjectAndMethod {

    private String object = "";
    
    private String method = "";
    
    private String fullPath = "";
    
    private int hashCode;
    
    /**
     * simply determines if the hashCodes are the same
     * 
     * @return true if hashCodes are equal, false if not
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object arg0) {
        return (arg0 instanceof ObjectAndMethod && arg0.hashCode() == hashCode);
    }

    /**
     * support the equals() method
     * 
     * @return the hashCode
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        return hashCode;
    }

    /**
     * creates an ObjectAndMethod representation from a string path by
     * sanitising the string and splitting it into its component
     * parts.  Will create index methods for paths ending with '/'
     * 
     * @param fullPath
     */
    public ObjectAndMethod(String fullPath) {  
        if (fullPath == null) fullPath = "/";
        if (!fullPath.startsWith("/")) fullPath = "/" + fullPath;
        this.fullPath = fullPath;
        
        if (!fullPath.endsWith("/")) {
            int lastSplit = fullPath.lastIndexOf("/");
            method = fullPath.substring(lastSplit + 1);
            object = fullPath.substring(0, lastSplit + 1);
        }
        else {
            object = fullPath;
            method = "index";
        }
        
        hashCode = (object + method).hashCode();
    }
        
    /**
     * @return the method for this OaM
     */
    public String getMethod() {
        return method;
    }
    
    /**
     * @return the object for this OaM
     */
    public String getObject() {
        return object;
    }
    
    /**
     * @return the full path that this OaM was created from
     */
    public String getFullPath() {
        return fullPath;
    }
    
    /**
     * @return the full path of this OaM
     * @see java.lang.Object#toString()
     */
    public String toString() {
        return fullPath;
    }

}
