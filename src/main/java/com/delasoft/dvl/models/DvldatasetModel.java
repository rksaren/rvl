package com.delasoft.dvl.models;

import java.io.Serializable;
import java.util.List;

import com.delasoft.dvl.db.entities.Appdataset;
import com.delasoft.dvl.db.entities.Dvldataset;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class DvldatasetModel implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Appdataset dataSettings;
	private List<Dvldataset> data;
	public Appdataset getDataSettings() {
		return dataSettings;
	}
	public void setDataSettings(Appdataset dataSettings) {
		this.dataSettings = dataSettings;
	}
	public List<Dvldataset> getData() {
		return data;
	}
	public void setData(List<Dvldataset> data) {
		this.data = data;
	}
	
	
}
