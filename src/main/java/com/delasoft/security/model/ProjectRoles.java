package com.delasoft.security.model;

import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ProjectRoles implements GrantedAuthority {

	
	private static final long serialVersionUID = -503267206639547605L;
	@JsonIgnore
	private String role;
	 
	public ProjectRoles (String r){
		this.role = r;
	}
	public String getAuthority() {
		
		return this.role;
	}
	 
	
	public void setRole(String role) {
		this.role = role;
	}
	
}
