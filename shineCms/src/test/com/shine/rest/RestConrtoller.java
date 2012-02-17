package test.com.shine.rest;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

@Controller
@RequestMapping("/topic")
public class RestConrtoller {
	
	@RequestMapping(value="",method=RequestMethod.GET)
	public String topic(HttpServletRequest request){
		WebApplicationContext wac = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
		System.out.println(wac.getBean("sessionFactory"));
		request.setAttribute("msg", "welcome to topic");
		return "test/topic";
	}
	
	@RequestMapping(value="/{id}",method=RequestMethod.GET)
	public String topic(@PathVariable Long id,HttpServletRequest request){
		request.setAttribute("msg", "ID is"+id);
		return "test/topic";
	}

}
