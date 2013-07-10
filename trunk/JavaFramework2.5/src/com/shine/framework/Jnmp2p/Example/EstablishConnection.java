package com.shine.framework.Jnmp2p.Example;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.net.Msg.*;
import org.net.Msg.Msg;
import org.net.p2p.*;

public class EstablishConnection  {
	
	public static void main(String[] args) throws Exception{
        EstablishConnection e=new EstablishConnection();
        Protocol prot=new Protocol(e);
        prot.addMsgHandler("hello","say_hello"); 
        jnmp2p jnm=new jnmp2p(prot,12000); //random port number
        //reading the ip address to connect to
        BufferedReader in=new BufferedReader(new InputStreamReader(System.in));
        String ip=in.readLine();
        Connection conn=jnm.connect(ip); //ip address to connect to
        String msgHeader="hello"; //the header corresponding to the handler function
        String msgBody="Subodh"; //msg content
        Msg m=conn.createMsg(msgHeader,msgBody);
        conn.sendMsg(m);
        
 }

 public void say_hello(Connection conn,Msg msg){
        System.out.println("hello "+msg.getContent());
 }
}
