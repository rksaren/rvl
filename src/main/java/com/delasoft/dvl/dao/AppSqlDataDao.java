package com.delasoft.dvl.dao;

import com.delasoft.dvl.db.entities.Appsql;

public interface AppSqlDataDao extends GenericDao<Appsql> 
{
	public Appsql getSqlByName(String sqlname); 
}
