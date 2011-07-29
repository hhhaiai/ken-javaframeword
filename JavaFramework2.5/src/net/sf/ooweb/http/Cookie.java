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

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;



/**
 * Cookie represents an HTTP cookie and specifies all of the mandatory and 
 * optional values that a cookie may have,
 * 
 * @author Darren Davison
 * @since 0.5
 */
public class Cookie {
    
    private String name;
    
    private String value;
    
    private Date expires;
    
    private String domain;

    private String path;
    
    private boolean secure;
    
    // cookies must use GMT.  It's the law!
    private static final String RFC822_DATE_FORMAT = "E, d-MMM-yyyy HH:mm:ss 'GMT'";

    /**
     * Create a cookie using the minimum required information of name and
     * value.  Values for expires, domain, path and secure are not used which
     * will make this cookie a session cookie (expires at the end of the session).
     * 
     * @param name the name of the cookie
     * @param value the value of the cookie
     */
    public Cookie(String name, String value) {
        this(name, value, null, null, null, false);
    }

    /**
     * Create a cookie supplying all of the required and optional information
     * needed.  A cookie can be deleted on the client by specifying a value for
     * the expiry date which is in the past.
     * 
     * @param name the name of the cookie
     * @param value the value of the cookie
     * @param expires the date after which the cookie should no longer be sent 
     * to the server by the client
     * @param domain the domain for which this cookie is valid.  User agents
     * should not transmit a cookie to any other domain than that specified.
     * @param path the optional path within the domain that a cookie should be
     * transmitted for,
     * @param secure if true, instructs the user agent to only send the cookie if
     * it believes the link to be secure.  In practice, this means over HTTPS.
     */
    public Cookie(String name, String value, Date expires, String domain, String path, boolean secure) {
        if (name == null || value == null || name.length() == 0 || value.length() == 0)
            throw new IllegalArgumentException("Name and Value must be specified");
        
        if (domain != null && domain.indexOf('.') == domain.lastIndexOf('.'))
            throw new IllegalArgumentException("Domain must contain at least 2 separators (.)");

    	// Not stated in RFCs, but Firefox and Konqueror seem to use the current
    	// URL path if you don't explicitly put the root when sending the cookie.
    	if (path == null)
    	    path = "/";
        
        this.name = name;
        this.value = value;
        this.expires = expires;
        this.domain = domain;
        this.path = path;
        this.secure = secure;
    }
    
    /**
     * @return the domain that the cookie belongs to.
     */
    public String getDomain() {
        return domain;
    }
    
    /**
     * @return the expiry date of the cookie.
     */
    public Date getExpires() {
        return expires;
    }
    
    /**
     * @return the cookie name.
     */
    public String getName() {
        return name;
    }
    
    /**
     * @return the path the cookie should be associated with.
     */
    public String getPath() {
        return path;
    }
    
    /**
     * @return true if the cookie should only be transmitted over
     * a secure link (HTTPS).
     */
    public boolean isSecure() {
        return secure;
    }
    
    /**
     * @return the value.
     */
    public String getValue() {
        return value;
    }
    
    /**
     * @return the header payload - ie a valid string that can be added as 
     * an HTTP header to a response if prefixed with "Set-Cookie: "
     */
    public String getHeaderValue() {
        StringBuffer sb = new StringBuffer(80);
        sb.append(name).append("=").append(value).append("; ");
        
        if (expires != null)
        	sb.append("expires=").append(
        		new SimpleDateFormat(RFC822_DATE_FORMAT, Locale.UK).format(expires)
        	).append("; ");
        
        if (domain != null)
            sb.append("domain=").append(domain).append("; ");
        
        if (path != null)
            sb.append("path=").append(path).append("; ");
        
        if (secure)
            sb.append("secure");
        
        return sb.toString();
    }

    /**
     * Can be used to write the actual lcookie into an HTTP response
     * stream.
     * 
     * @see java.lang.Object#toString()
     */
    public String toString() {
        return "Set-Cookie: " + getHeaderValue();
    }

}
