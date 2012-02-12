package com.shine.test;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/topic")
public class RestConrtoller {
	
	@RequestMapping(value="",method=RequestMethod.GET)
	public String topic(HttpServletRequest request,TestUser user){
		request.setAttribute("msg", "welcome to topic");
		System.out.println(user.getId());
		return "test/topic";
	}
	
	@RequestMapping(value="/{id}",method=RequestMethod.GET)
	public String topic(@PathVariable Long id,HttpServletRequest request){
		request.setAttribute("msg", "ID is"+id);
		return "test/topic";
	}

}
