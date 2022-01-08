package com.delasoft.dvl.dao.impl;

import org.springframework.stereotype.Repository;

import com.delasoft.dvl.dao.AppSqlDataDao;
import com.delasoft.dvl.db.entities.Appsql;

@Repository("AppSqlDataDao")
public class AppSqlDataDaoImpl extends GenericDaoImpl<Appsql>  implements AppSqlDataDao { 
	
	public Appsql getSqlByName(String sqlname) {
		 return getEntityManager().createNamedQuery("Appsql.findbysqlName", Appsql.class)
				 .setParameter("sqlname", sqlname).getResultList()
					.stream()
					.findFirst()
					.orElse(null); 
	}

}
