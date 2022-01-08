package com.delasoft.dvl.db.entities;

import java.io.Serializable;
import javax.persistence.*;

import org.hibernate.annotations.CacheModeType;
import org.hibernate.annotations.NamedQueries;
import org.hibernate.annotations.NamedQuery;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Cacheable
@Table(name = "RV$APPSQL")
@JsonIgnoreProperties(ignoreUnknown = true) 
@NamedQueries(value = {
		@NamedQuery(name = "Appsql.findbysqlName", query = "from Appsql a where upper(a.sqlname)=upper(:sqlname)",cacheable=true, cacheMode=CacheModeType.NORMAL)		
 })

public class Appsql implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="DBNAME")
	private String dbname;

	@Column(name="SQLNAME")
	@Id
	private String sqlname;

	@Column(name="SQLSTMT")
	private String sqlstmt;

	public Appsql() {
	}

	public String getDbname() {
		return this.dbname;
	}

	public void setDbname(String dbname) {
		this.dbname = dbname;
	}

	public String getSqlname() {
		return this.sqlname;
	}

	public void setSqlname(String sqlname) {
		this.sqlname = sqlname;
	}

	public String getSqlstmt() {
		return this.sqlstmt;
	}

	public void setSqlstmt(String sqlstmt) {
		this.sqlstmt = sqlstmt;
	}

}