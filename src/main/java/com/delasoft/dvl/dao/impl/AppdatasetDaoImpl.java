package com.delasoft.dvl.dao.impl;

import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.delasoft.dvl.dao.AppdatasetDao;
import com.delasoft.dvl.db.entities.Appdataset;

@Repository("AppdatasetDao")
public class AppdatasetDaoImpl  extends GenericDaoImpl<Appdataset>  implements AppdatasetDao { 
	
	public List<Appdataset> getAppDataSet() { 
		 TypedQuery<Appdataset> query = getEntityManager().createNamedQuery("Appdataset.FindAll", Appdataset.class);  
			return query.getResultList();
	}
 

}
