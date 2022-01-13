package com.delasoft.dvl.resources;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.delasoft.dvl.db.entities.Appdataset;
import com.delasoft.dvl.db.entities.Appsql;
import com.delasoft.dvl.models.DvldatasetModel;
import com.delasoft.dvl.models.Location;
import com.delasoft.dvl.models.Roads;
import com.delasoft.dvl.services.DvlDataService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
@CrossOrigin(origins = {"*"})
@RestController
@Api(value = "/rest/service", description = "Dvl Data Controller")
@RequestMapping(value = "/rest/services", produces = { "application/json" })
public class DvlDataController {

	@Autowired
	@Qualifier("DvlDataService")
	private DvlDataService dvlDataService;

	@ApiOperation(value = "Dvl Data Controller", notes = "Dvl Data Controller", hidden = true)
	@RequestMapping(value = "/", method = RequestMethod.GET) 
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Success", response = String.class),
			@ApiResponse(code = 404, message = "Not Found"), @ApiResponse(code = 500, message = "Server Error") })
	@ResponseBody
	public String index() {
		return "Dvl Data Controller";
	}

	@ApiOperation(value = "Get Query by Name", notes = "Get Query by Name", hidden = true)
	@RequestMapping(value = "/getQuery", method = RequestMethod.GET, produces = "application/json")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Success", response = Appsql.class),
			@ApiResponse(code = 500, message = "Server Error") })
	public ResponseEntity<?> getQuery(
			@ApiParam(name = "sqlname", value = "SQL Name", required = true) @RequestParam String sqlname) {
		Appsql result = dvlDataService.getSqlByName(sqlname);
		return new ResponseEntity<Appsql>(result, HttpStatus.OK);
	}

	@ApiOperation(value = "Get DVL Data Settings", notes = "Get DVL Data Settings")
	@RequestMapping(value = "/getAppdataset", method = RequestMethod.GET, produces = "application/json")
	@ApiResponses(value = {
			@ApiResponse(code = 200, message = "Success", response = Appdataset.class, responseContainer = "List"),
			@ApiResponse(code = 500, message = "Server Error") })
	public ResponseEntity<?> getAppdataset() {
		Map<String, Appdataset> result = dvlDataService.getAppDataSet();
		return new ResponseEntity<Map<String, Appdataset>>(result, HttpStatus.OK);
	}

	@ApiOperation(value = "Get Current Year DVL Data Set By Road Identifier", notes = "Get Current Year DVL Data Set By Road Identifier")
	@RequestMapping(value = "/getcurrentyearDvldataset/{roadwayid}", method = RequestMethod.GET, produces = "application/json")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Success", response = DvldatasetModel.class),
			@ApiResponse(code = 500, message = "Server Error") })
	public ResponseEntity<?> getcurrentyearDvldataset(
			@ApiParam(name = "roadwayid", value = "Road Identifier", required = true) @PathVariable String roadwayid) {
		DvldatasetModel result = dvlDataService.getDvldatasetById("getCurNxtFrm", "curYear", roadwayid);
		return new ResponseEntity<DvldatasetModel>(result, HttpStatus.OK);
	}

	@ApiOperation(value = "Get DVL Data Set By Road Identifier and Year", notes = "Get DVL Data Set By Road Identifier and Year")
	@RequestMapping(value = "/getcompareyearDvldataset/{year}/{roadwayid}", method = RequestMethod.GET, produces = "application/json")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Success", response = DvldatasetModel.class),
			@ApiResponse(code = 500, message = "Server Error") })
	public ResponseEntity<?> getcompareyearDvldataset(
			@ApiParam(name = "year", value = "Compare year", required = true) @PathVariable String year,
			@ApiParam(name = "roadwayid", value = "Road Identifier", required = true) @PathVariable String roadwayid) {
		DvldatasetModel result = dvlDataService.getDvldatasetById("getCmpNxtFrm", year, roadwayid);
		return new ResponseEntity<DvldatasetModel>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "/getroads", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody List<Roads> getRoads(@RequestParam String search){
		
		return  dvlDataService.getRoads(search); 
	}
	@RequestMapping(value = "/getroad", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody Roads getRoad(@RequestParam Integer rdway_id,@RequestParam BigDecimal mile){
		
		return  dvlDataService.getRoad(rdway_id,mile); 
	}
	@RequestMapping(value = "/locatepoint", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody List<Roads> getLocation( Location loc){
		
		return  dvlDataService.getRoads(loc);
		
	}
}