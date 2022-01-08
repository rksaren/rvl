/**
 *
 * @author Anand Kirti
 * @category DAO
 * @version 1.0.0
 * @since 02/18/2016
 * @Build
 *
 */
package com.delasoft.dvl.dao;
 
import java.io.Serializable;
import java.util.List;
 
 

public interface GenericDao<T> {

	T get(Serializable id);
	
	void update(T entity);

	void updateall(List<T> entities);
	
	Serializable add(T entity);
	
	void delete(T entity); 
	
	T merge(T entity);
	
} 