
package com.delasoft.dvl.models;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

//import io.swagger.annotations.ApiModel;
 

/**
 * @Name_and_Description The Result class for Geometry To Measure(geometryToMeasure)  Layers
 * @author Raghavendar
 * @category LRS Service Model
 * @version 1.0.0
 * @since 03/28/2017
 * @Build
 *
 */
@JsonIgnoreProperties(ignoreUnknown=true) 
//@ApiModel("Geometry Result")
public class Result implements Serializable
{
	private static final long serialVersionUID = 1L;

	@JsonProperty("routeId")
    private String routeId;
    
    @JsonProperty("measure")
    private Double measure;
    
    @JsonProperty("geometryType")
    private String geometryType; 
     
    /**
     * No args constructor for use in serialization
     * 
     */
    public Result() {
    }

	/**
	 * @return the routeId
	 */
	public String getRouteId() {
		return routeId;
	}

	/**
	 * @param routeId the routeId to set
	 */
	public void setRouteId(String routeId) {
		this.routeId = routeId;
	}

	/**
	 * @return the measure
	 */
	public Double getMeasure() {
		return measure;
	}

	/**
	 * @param measure the measure to set
	 */
	public void setMeasure(Double measure) {
		this.measure = measure;
	}

	/**
	 * @return the geometryType
	 */
	public String getGeometryType() {
		return geometryType;
	}

	/**
	 * @param geometryType the geometryType to set
	 */
	public void setGeometryType(String geometryType) {
		this.geometryType = geometryType;
	} 
    
}
