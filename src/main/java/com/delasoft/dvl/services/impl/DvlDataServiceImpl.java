package com.delasoft.dvl.services.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.delasoft.dvl.dao.AppSqlDataDao;
import com.delasoft.dvl.dao.AppdatasetDao;
import com.delasoft.dvl.dao.DvlDataSetDao;
import com.delasoft.dvl.db.entities.Appdataset;
import com.delasoft.dvl.db.entities.Appsql;
import com.delasoft.dvl.db.entities.Dvldataset;
import com.delasoft.dvl.models.DvldatasetModel;
import com.delasoft.dvl.models.Roads;
import com.delasoft.dvl.services.DvlDataService;

@Service("DvlDataService")
public class DvlDataServiceImpl implements DvlDataService {
	
	@Value(value = "${application.dvlImgesLink}")
	private String dvlImgesLink;
	
	@Value(value = "${application.dvlImgesHttpsLink}")
	private String dvlImgesHttpsLink;
	
	@Autowired
	@Qualifier("DvlDataSetDao")	
	public DvlDataSetDao dvlDataSetDao;
	
	@Autowired
	@Qualifier("AppSqlDataDao")	
	public AppSqlDataDao appSqlDataDao;
	
	@Autowired
	@Qualifier("AppdatasetDao")	
	public AppdatasetDao appdatasetDao;
	 
	public DvldatasetModel getDvldatasetById(String sqlnmae,String year,String roadwayid) { 
		 
		DvldatasetModel dmodel=new DvldatasetModel();
		Map<String, Appdataset> result =getAppDataSet();
		Appsql sqlEntity=getSqlByName(sqlnmae);
		if(result!=null && result.containsKey(year) && sqlEntity!=null){
			Appdataset ads=result.get(year); 
			String sqlquery=sqlEntity.getSqlstmt();
			sqlquery=sqlquery.replace("tblName", ads.getDatasetname()).replaceAll("emilePointparam","0"); 
			dmodel.setData(dvlDataSetDao.getDvldatasetById(sqlquery,roadwayid));
			dmodel.setDataSettings(ads);
		}
		return dmodel;
	}
 
	
	public Appsql getSqlByName(String sqlname) { 
		return appSqlDataDao.getSqlByName(sqlname);
	}

	public Map<String,Appdataset> getAppDataSet() {
		Map<String, Appdataset> result = new HashMap<String,Appdataset>();
		List<Appdataset> cxlxn = appdatasetDao.getAppDataSet(); 
		int count=1;
		for (Appdataset appdataset : cxlxn) {			
			if(appdataset.getThumbnailhost()!=null){
				appdataset.setThumbnailhost(appdataset.getThumbnailhost().replace(dvlImgesLink, dvlImgesHttpsLink));
			}
			if(appdataset.getOrgimagehost()!=null){
				appdataset.setOrgimagehost(appdataset.getOrgimagehost().replace(dvlImgesLink, dvlImgesHttpsLink));
			}
			
			if (count ==1) {
				result.put("curYear", appdataset);
			}
			else if (count ==2) {
				result.put("prevYear", appdataset);
			}
			
			result.put(appdataset.getYear()+"", appdataset);
			count++;
		}
		return result;
	}


	@Override
	public List<Roads> getRoads(String search) {
		 
		
		String year= "curYear";
		Map<String, Appdataset> result =getAppDataSet();
		Appdataset ads=result.get(year); 
		String sqlname = "getRoads";
		Appsql sqlEntity=getSqlByName(sqlname);
		String sqlquery=sqlEntity.getSqlstmt(); 
		sqlquery=sqlquery.replace("tblName", ads.getDatasetname()).replace("searchkey", search.toLowerCase()); 
		 	
		return dvlDataSetDao.getRoads(sqlquery);
	}

}
