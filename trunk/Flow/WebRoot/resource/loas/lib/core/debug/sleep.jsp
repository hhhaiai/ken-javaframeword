<%@ page language="java" contentType="text/html; charset=gb2312"%>
<%
  try {   
  String time=request.getParameter("t");
  Thread.currentThread().sleep(Integer.parseInt(time)*1000); 
		out.print(true);
	}catch(InterruptedException e){
		out.print(false);
	}   
%>