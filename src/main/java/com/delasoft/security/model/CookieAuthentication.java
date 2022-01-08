package com.delasoft.security.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CookieAuthentication extends SecretTokenAuth implements Authentication{

	/**
	 * 
	 */
	private static final long serialVersionUID = -6194243222909549338L;
	public CookieAuthentication(CookieAuthValue value){
		this.value=value;
		authroles = new ArrayList<ProjectRoles>();
		for(String r : this.value.getRoles()) {
			ProjectRoles z = new ProjectRoles(r);
			authroles.add(z);
		}
		 
	}
	@JsonIgnore
	private CookieAuthValue value; 
	@JsonIgnore
	private List<ProjectRoles> authroles;
	public String getName() {
		return value.getName();
	}
 
	 
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		 
		return authroles;
	}
	@JsonIgnore
	public Object getCredentials() {
		// TODO Auto-generated method stub
		return null;
	}
	@JsonIgnore
	public Object getDetails() {
		// TODO Auto-generated method stub
		return null;
	}
	@JsonIgnore
	public Object getPrincipal() {
		// TODO Auto-generated method stub
		return this.value.getName();
	}
	 
	public boolean isAuthenticated() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
		// TODO Auto-generated method stub
		
	}
	 
	
	
}
