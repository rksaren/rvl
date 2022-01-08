package com.delasoft;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

 
class CorsFilter implements Filter {

	 private String principalEnvironmentVariable;
	 public CorsFilter(String principalEnvironmentVariable){
		this.principalEnvironmentVariable = principalEnvironmentVariable; 
	 }
	 
	
	  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
	    HttpServletResponse response = (HttpServletResponse) res;
	    HttpServletRequest request = (HttpServletRequest) req;
	   
	    StringBuilder sb = new StringBuilder();
	    sb.append(principalEnvironmentVariable).append(",").append("Content-Type");
	    
	    response.setHeader("Access-Control-Allow-Origin",  request.getHeader("origin"));
	    response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
	     
	    response.setHeader("Access-Control-Allow-Headers",sb.toString() );
	    response.setHeader("Access-Control-Allow-Credentials", "true");
	   
	   // response.setHeader("Access-Control-Max-Age", "3600");
	    
	    response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT");

	    // Set standard HTTP/1.1 no-cache headers.
	    response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

	    // Set IE extended HTTP/1.1 no-cache headers (use addHeader).
	    response.addHeader("Cache-Control", "post-check=0, pre-check=0");

	    // Set standard HTTP/1.0 no-cache header.
	    response.setHeader("Pragma", "no-cache");
	    if (!request.getMethod().equals("OPTIONS")) {
	      chain.doFilter(req, res);
	    } else {
	    }
	  }

	  public void init(FilterConfig filterConfig) {}

	  public void destroy() {}

	}
