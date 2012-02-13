package test.com.shine.platform;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/platform")
public class MutilConfigControllor {
	@RequestMapping(value="/{id}",method=RequestMethod.GET)
	public String topic(@PathVariable Long id,HttpServletRequest request){
		request.setAttribute("msg", "MutilConfigControllor return:ID is"+id);
		return "test/topic";
	}
}
