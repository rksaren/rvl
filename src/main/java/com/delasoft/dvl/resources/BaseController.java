package com.delasoft.dvl.resources;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

//@Controller
public class BaseController {

	//@RequestMapping(method = RequestMethod.GET,path = "/")
	public String welcome() {
		return "index";
				
	}
}
