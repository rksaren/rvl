/**
 *
 * @author Anand Kirti
 * @category DAO
 * @version 1.0.0
 * @since 02/18/2016
 * @Build
 *
 */
package com.delasoft.dvl.dao.impl;

import java.io.Serializable;
import java.util.List;

import javax.persistence.EntityManager;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.GenericTypeResolver;
import org.springframework.stereotype.Repository;

import com.delasoft.dvl.dao.GenericDao;

@Repository("GenericDao")
public  class GenericDaoImpl<T> implements GenericDao<T> {

	private Logger logger = LoggerFactory.getLogger(getClass());
	 
	private Class<?> clz;
	public GenericDaoImpl(){
		this.clz = (Class<T>) GenericTypeResolver.resolveTypeArgument(getClass(),GenericDao.class );
		
		
	}
	
	@Autowired
    private EntityManager entityManager;
	
	private Session getCurrentSession() {
		return entityManager.unwrap(Session.class);
	}

	 
	@SuppressWarnings("unchecked")
	public T get(Serializable id) { 
		return (T) getCurrentSession().get( this.clz,id);
	}

	@Override
	public void update(T entity) {  
		 getCurrentSession().saveOrUpdate(entity);
	}


	@Override
	public void updateall(List<T> entities) { 
		 Session session = getCurrentSession();
		 Transaction tx = session.beginTransaction();
		 for (int i = 0; i < entities.size(); i++) {
			 T entity =entities.get(i);  
			 session.saveOrUpdate(entity);
		     if ( i % 20 == 0 ) {  
		         session.flush();
		         session.clear();
		     }
		 } 
		 tx.commit();
		 session.close(); 
	}

	@Override
	public Serializable add(T entity) {
		// TODO Auto-generated method stub
		return  getCurrentSession().save(entity);
		
	}
	
	public EntityManager getEntityManager() {
		return entityManager;
	}

 

	 
	public void delete(T entity) {
		
		 getCurrentSession().delete(entity);
	}

    public Boolean checkValue(Object field, Object [] values)
    {
    	Boolean result = false;
    	if(field == null) return result;
    	
    	for(Object o : values)
    	{
    		if(field.equals(o)) {
    			result=true;
    			break;
    		}
    	}
    	
    	return result;
    }

	 
	public T merge(T entity) {
		return (T)  getCurrentSession().merge(entity);
		
	}

	

}
