package com.delasoft.dvl.dao;

import java.math.BigDecimal;
import java.util.List;

import com.delasoft.dvl.db.entities.Dvldataset;
import com.delasoft.dvl.models.Location;
import com.delasoft.dvl.models.Roads;

public interface DvlDataSetDao  extends GenericDao<Dvldataset> 
{
	public List<Dvldataset> getDvldatasetById(String querystr, String roadwayid); 
	List<Roads> getRoads(String querystr);
	List<Roads> getRoads(String querystr,Location loc);
	Roads getRoad(String sqlquery,BigDecimal mile, Integer rdway_id);
}
