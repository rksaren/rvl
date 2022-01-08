package com.delasoft.security;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.delasoft.security.model.CookieAuthValue;
import com.delasoft.security.model.CookieAuthentication;
import com.fasterxml.jackson.databind.ObjectMapper;

public class CookiePreAuth implements Filter{
	
	 
	private  TokenHandler tokenHandler;
	
	public CookiePreAuth(ObjectMapper mapper,TokenHandler tokenHandler){
		this.mapper = mapper;
		this.tokenHandler = tokenHandler;

	}
	@Value(value = "${application.cookiename}")
	private String principalEnvironmentVariable;
	 
	private ObjectMapper mapper;
	 
	protected String getPreAuthenticatedPrincipal(HttpServletRequest request) {
		String principal = request.getHeader(principalEnvironmentVariable);
		System.out.println("Secret header token "+principal);
		if(principal != null) return principal;
		
		Cookie authCookie = null;
		Cookie [] cookies = request.getCookies();
		if(cookies == null) return null;
		for(Cookie c : cookies)
		{
			if(c.getName().equals(principalEnvironmentVariable)){
				authCookie =c;
			}
		}
		
		if (authCookie == null  ) {
			return null;
		}
		
		return authCookie.getValue() ;
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException
	{
		Authentication preauth= SecurityContextHolder.getContext().getAuthentication();
		if(preauth == null || !preauth.isAuthenticated())
		{
			HttpServletRequest req = (HttpServletRequest) request;
			String authtoken = getPreAuthenticatedPrincipal(req);
			
			if(authtoken != null)
			{
				String auth = tokenHandler.parseUserFromToken(authtoken);
				if(auth != null)
				{
					CookieAuthValue c = mapper.readValue(auth, CookieAuthValue.class);
					CookieAuthentication cval = new CookieAuthentication(c);
					cval.setSecret(authtoken);
					SecurityContextHolder.getContext().setAuthentication(cval);
				}
			}
		}
		chain.doFilter(request, response);
		 
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	 

}
