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
package net.sf.ooweb.util;

import java.net.InetAddress;
import java.util.Calendar;



/**
 * StringUtils
 * 
 * @author R. Rawson-Tetley
 * @author Darren Davison
 * @since Jul 23, 2005
 */
public final class StringUtils {

    private StringUtils() {
        // no instances needed
    }

    /**
     * Type 1 (time-based) Pure-Java UUID Generator
     *
     * This has the advantage of not using SecureRandom (being
     * time-based) and is therefore fast. Note that it uses the
     * hostname and a some random entropy to construct a node 
     * rather than the ethernet MAC address (to keep it pure java).
     * Despite this limitation, it should still produce very good,
     * unique UUIDs since the mix of hostname/randomness and UTC
     * since the epoch down to the millisecond should be good enough
     * for most applications.
     *
     * The output format is a UUID URN according to the IETF draft, which
     * you can find here:
     *
     * http://www.ietf.org/internet-drafts/draft-mealling-uuid-urn-03.txt
     * 
     */
    public static String generateUUID() {
    
        byte[] data = new byte[16];
            
        Calendar cal = Calendar.getInstance();
        
        data[0] = (byte) cal.get(Calendar.MILLISECOND);
        data[1] = (byte) cal.get(Calendar.SECOND);
        data[2] = (byte) cal.get(Calendar.MINUTE);
        data[3] = (byte) cal.get(Calendar.HOUR_OF_DAY);       // ^ time_low
        data[4] = (byte) cal.get(Calendar.DAY_OF_MONTH);  
        data[5] = (byte) cal.get(Calendar.MONTH);                  // ^ time_mid
        data[6] = (byte) cal.get(Calendar.YEAR);
        data[7] = (byte) (( Math.random() *  8) + 16) ; // ^ time_high and version (0001 in most significant 4 bits for version 1)
        data[8] = (byte) ( Math.random() *  255); // clock_seq
        data[9] = (byte) ( Math.random() *  255); // clock_seq_low
        
        // Get the first 6 bytes of the hostname
        String hostname = "NOHOST";
        try {
            InetAddress addr =  InetAddress.getLocalHost();
            hostname = addr.getHostName();
            // If the hostname is shorter than 6 chars, bulk it out
            if (hostname.length() < 6)
                hostname += "bFrGlP".substring(0, 6 - hostname.length());
        }
        catch (Exception e) {}
        byte[] hostbyte = hostname.getBytes();
        
        data[10] = hostbyte[0];
        data[11] = hostbyte[1];
        data[12] = hostbyte[2];
        data[13] = hostbyte[3];
        data[14] = hostbyte[4];
        data[15] = hostbyte[5]; 
        
        String chars = "0123456789abcdefABCDEF";
        StringBuffer buf = new StringBuffer(36);
        for (int i = 0; i < 16; i++) {
            if (i==4 || i==6 || i==8 || i==10) buf.append('-');
            int val = data[i] & 0xFF;
            buf.append(chars.charAt(val >> 4));
            buf.append(chars.charAt(val & 0x0f));
        }
        return "uuid:" + buf.toString();
    
    }

    /**
     * Splits a string by a particular char and returns an array of 
     * strings. If there are no occurrences of the split char, the
     * original string is returned in an array of 1 item.
     * @param splitstring The string to be split
     * @param splitchar The char to split on
     * @return An array of strings
     */
    public static String[] split(String splitstring, String splitchar) {
    
        splitstring = splitstring.trim();
        
        // If there is only one element, just return that
        if (splitstring.indexOf(splitchar) == -1) {
            String[] rets = new String[1];
            rets[0] = splitstring;
            return rets;
        }
        
        // Find how many there are
        int tot = 0;
        int lpos = splitstring.indexOf(splitchar);
        while (lpos != -1) {
            tot++;
            lpos = splitstring.indexOf(splitchar, lpos + 1);
        }
        tot++;
        
        // Create our new array
        String[] rets = new String[tot];
        tot = 0;
        lpos = 0;
        int spos = splitstring.indexOf(splitchar);
        while (spos != -1) {
            // Add into the array
            rets[tot] = splitstring.substring(lpos, spos);
            tot++;
            lpos = spos + 1;
            spos = splitstring.indexOf(splitchar, lpos);
        }
        
        // Include last word
        rets[tot] = splitstring.substring(lpos, splitstring.length());
        
        // Return it
        return rets;
    }

    /**
     * Replace all occurences of a substring within a string with
     * another string.
     * @param inString String to examine
     * @param oldPattern String to replace
     * @param newPattern String to insert
     * @return a String with the replacements
     */
    public static String replace(String inString, String oldPattern, String newPattern) {
        if (inString == null) {
            return null;
        }
        if (oldPattern == null || newPattern == null) {
            return inString;
        }

        StringBuffer sbuf = new StringBuffer();
        // output StringBuffer we'll build up
        int pos = 0; // our position in the old string
        int index = inString.indexOf(oldPattern);
        // the index of an occurrence we've found, or -1
        int patLen = oldPattern.length();
        while (index >= 0) {
            sbuf.append(inString.substring(pos, index));
            sbuf.append(newPattern);
            pos = index + patLen;
            index = inString.indexOf(oldPattern, pos);
        }
        sbuf.append(inString.substring(pos));

        // remember to append any characters to the right of a match
        return sbuf.toString();
    }

    /**
     * Takes a URL-encoded string and decodes it.
     * @param s A URL encoded string
     * @return The decoded string
     */
    public static String decodeURLEncoding(String s) {
        
        final String hex = "0123456789ABCDEF";
        
        StringBuffer b = new StringBuffer(s);
        for (int i = 0; i < b.length(); i++) {
            
            // Switch + symbols for spaces
            if (b.substring(i, i+1).equals("+"))
                b.replace(i, i+1, " ");
            
            // If we see a percentage symbol, look
            // up it's real char
            if (b.substring(i, i+1).equals("%")) {
                String h = b.substring(i+1, i+3).toUpperCase();
                int ascii = (hex.indexOf(h.substring(0, 1)) * 16) + hex.indexOf(h.substring(1));
                h = null;
                b.replace(i, i+3, new String(new char[] { (char) ascii }));
            }
        }
        
        return b.toString();
    }
    
    /**
     * Performs URL encoding of a string
     * @param s
     * @return The encoded string
     */
    public static String encodeURL(String s) {
    	// TODO: Probably needs fleshing out a bit to cover
    	// =/
    	s = s.replace(' ', '+');
    	return s;
    }
    
}
