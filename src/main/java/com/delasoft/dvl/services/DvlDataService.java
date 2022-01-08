package com.delasoft.dvl.services;

import java.util.List;
import java.util.Map;

import com.delasoft.dvl.db.entities.Appdataset;
import com.delasoft.dvl.db.entities.Appsql;
import com.delasoft.dvl.models.DvldatasetModel;
import com.delasoft.dvl.models.Roads;

public interface DvlDataService {
	public DvldatasetModel getDvldatasetById(String sqlnmae,String year,String roadwayid);
	public Appsql getSqlByName(String sqlname); 
	public Map<String,Appdataset> getAppDataSet();
	List<Roads> getRoads(String search);
}
