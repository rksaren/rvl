package com.delasoft.dvl.models;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Roads {

	private String rdway_id;
	
	private String roadno;

	private BigDecimal begmp;
	
	private BigDecimal endmp;
	
	public BigDecimal getBegmp() {
		return begmp;
	}

	public void setBegmp(BigDecimal begmp) {
		this.begmp = begmp;
	}

	public BigDecimal getEndmp() {
		return endmp;
	}

	public void setEndmp(BigDecimal endmp) {
		this.endmp = endmp;
	}

	public String getRdway_id() {
		return rdway_id;
	}

	public void setRdway_id(String rdway_id) {
		this.rdway_id = rdway_id;
	}

	public String getRoadno() {
		return roadno;
	}

	public void setRoadno(String roadno) {
		this.roadno = roadno;
	}
	
	
}
