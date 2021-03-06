package com.delasoft.dvl.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.delasoft.dvl.dao.DvlDataSetDao;
import com.delasoft.dvl.db.entities.Dvldataset;
import com.delasoft.dvl.models.Location;
import com.delasoft.dvl.models.Roads;

@Repository("DvlDataSetDao")
public class DvlDataSetDaoImpl  extends GenericDaoImpl<Dvldataset>  implements DvlDataSetDao {
 
	public List<Dvldataset> getDvldatasetById(String querystr,String roadwayid) {
		System.out.println("querystr------------->"+querystr);
		Query query=getEntityManager().createNativeQuery(querystr,Dvldataset.class);
		query.setParameter(1, roadwayid);
		
		@SuppressWarnings("unchecked")
		List<Dvldataset> dataset = query.getResultList();  
		return dataset;
	}
	public List<Roads> getRoads(String querystr)
	{
		System.out.println("querystr------------->"+querystr);
		Query query=getEntityManager().createNativeQuery(querystr);
		List<Object[]> results = query.getResultList();
		List<Roads> dataset = new ArrayList<Roads>();
		results.stream().forEach((record) -> {
	        
	        String rdway_id = (String) record[1];
	        String roadno = (String) record[0];
	       
	        Roads r = new Roads();
	        r.setRdway_id(rdway_id);
	        r.setRoadno(roadno);
	        
	        dataset.add(r);
	   });
		
		  
		return dataset;
	}
	@Override
	public List<Roads> getRoads(String querystr,Location loc) {
		Query query=getEntityManager().createNativeQuery(querystr);
		query.setParameter(1, loc.getLng());
		query.setParameter(2, loc.getLat());
		List<Object[]> results = query.getResultList();
		List<Roads> dataset = new ArrayList<Roads>();
		results.stream().forEach((record) -> {
	        
	        String rdway_id = (String) record[0];
	        String roadno = (String) record[2];
	        BigDecimal begMp = (BigDecimal) record[1];
	        Roads r = new Roads();
	        r.setRdway_id(rdway_id);
	        r.setRoadno(roadno);
	        r.setBegmp(begMp);
	        dataset.add(r);
	   });
		
		  
		return dataset;
	}
	@Override
	public Roads getRoad(String sqlquery, BigDecimal mile, Integer rdway_id) {
		Query query=getEntityManager().createNativeQuery(sqlquery);
		query.setParameter(1, rdway_id);
		query.setParameter(2, mile);
		query.setParameter(3, mile);
		List<Object[]> results = query.getResultList();
		
		List<Roads> dataset = new ArrayList<Roads>();
		results.stream().forEach((record) -> {
	        
			
	        String roadno = (String) record[0];
	        BigDecimal begmp = (BigDecimal) record[1];
	       
	        //System.out.println(roadno);
	        //System.out.println(begmp);
	        
	        Roads r = new Roads();
	        r.setRdway_id(rdway_id.toString());
	        r.setRoadno(roadno);
	        r.setBegmp(begmp);
	        dataset.add(r);
	   });
		
		return dataset.size() == 0 ? null : dataset.get(0);
	}
}
