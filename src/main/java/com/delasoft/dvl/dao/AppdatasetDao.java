package com.delasoft.dvl.dao;

import java.util.List;

import com.delasoft.dvl.db.entities.Appdataset;

public interface AppdatasetDao extends GenericDao<Appdataset> 
{ 
	public List<Appdataset> getAppDataSet(); 
}
