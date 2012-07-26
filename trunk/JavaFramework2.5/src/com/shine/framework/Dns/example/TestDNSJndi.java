package com.shine.framework.Dns.example;

import java.util.Properties; 

import javax.naming.Context;
import javax.naming.NameClassPair;
import javax.naming.NamingEnumeration;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.BasicAttribute;
import javax.naming.directory.BasicAttributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;

/** 
 * Description: 
 *  
 * @author shizy 
 * @version 1.0 date:2005-11-17 
 */ 
public class TestDNSJndi { 
    public static void main(String[] args) throws Exception { 
        Properties env = new Properties(); 
        env.put(Context.INITIAL_CONTEXT_FACTORY, 
                "com.sun.jndi.dns.DnsContextFactory"); 
        //此IP一定要为要访问的DNS服务器的IP,可通过网络设置查看 
        env.put(Context.PROVIDER_URL, "dns://8.8.8.8"); 
        DirContext ctx = new InitialDirContext(env); 
        System.out.println("a:" + ctx); 
        DirContext ctx1 = (DirContext) ctx.lookup("www.sina.com"); 
        System.out.println("b:" + ctx1); 
        printAttributes("c:", ctx1.getAttributes("www.hao123.com")); 
        //从ctx.getAttributes("www.sina.com")与ctx1.getAttributes("")结果一样 
        printAttributes("d:", ctx.getAttributes("www.sina.com")); 
        Attributes attrs1 = ctx.getAttributes("www.sina.com", 
                new String[] { "a" }); 
        Attributes attrs2 = ctx.getAttributes("www.163.com", 
                new String[] { "a" }); 
        Attributes attrs3 = ctx1.getAttributes("", new String[] { "a" }); 
        Attributes attrs4 = ctx.getAttributes("www.baidu.com", 
                new String[] { "a" }); 
        printAttributes("e:", attrs1); 
        printAttributes("f:", attrs2); 
        printAttributes("g:", attrs3); 
        printAttributes("attrs4:", attrs4); 
         
        System.out.println("nameParse:"+ctx1.getNameInNamespace()); 
        //list,此方法会导致程序lock 
        //listEnumation("list:",ctx.list("")); 
        //----------------------search 
        Attributes matchAttrs = new BasicAttributes(true); 
        matchAttrs.put(new BasicAttribute("a", "61.172.201.13")); 
        NamingEnumeration answer = ctx1.search("www.sina.com", matchAttrs); 
        printNamingEnumeration("search :", answer); 
    } 

    public static void printAttributes(String tag, Attributes attres) 
            throws Exception { 
        for (NamingEnumeration ae = attres.getAll(); ae.hasMore();) { 
            Attribute attr = (Attribute) ae.next(); 
            System.out 
                    .println(tag 
                            + "-----------------------------------------------\nattribute: " 
                            + attr.getID()); 
            /* Print each value */ 
            for (NamingEnumeration e = attr.getAll(); e.hasMore(); System.out 
                    .println("value: " + e.next())) 
                ; 
        } 
    } 

    public static void listEnumation(String tag, NamingEnumeration name) 
            throws Exception { 
        for (; name.hasMore();) { 
            NameClassPair nameClass = (NameClassPair) name.next(); 
            System.out 
                    .println(tag 
                            + "-----------------------------------------------\nattribute: " 
                            + nameClass.getName() + ":" 
                            + nameClass.getClassName()); 
        } 
    } 

    public static void printNamingEnumeration(String tag, NamingEnumeration e) 
            throws Exception { 
        for (; e.hasMore();) { 
            Attribute attr = (Attribute) e.next(); 
            System.out 
                    .println(tag 
                            + "-----------------------------------------------\nattribute: " 
                            + attr.getID()); 
            /* Print each value */ 
            for (NamingEnumeration ve = attr.getAll(); ve.hasMore(); System.out 
                    .println("value: " + ve.next())) 
                ; 
        } 
    } 
}
