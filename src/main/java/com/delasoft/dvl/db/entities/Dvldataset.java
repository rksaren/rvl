package com.delasoft.dvl.db.entities;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Cacheable 
@JsonIgnoreProperties(ignoreUnknown = true) 
public class Dvldataset implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "ID")
	private BigDecimal id; 

	@Column(name="FRONT_LEFT_IMAGE_LINK")
	private String frontLeftImageLink; 

	@Column(name="FRONT_RIGHT_IMAGE_LINK")
	private String frontRightImageLink;
	
	@Column(name="FRONT_CENTER_IMAGE_LINK")
	private String frontCenterImageLink;

	@Column(name="SIDE_LEFT_IMAGE_LINK")
	private String sideLeftImageLink;

	@Column(name="SIDE_RIGHT_IMAGE_LINK")
	private String sideRightImageLink;

	@Column(name="REAR_IMAGE_LINK")
	private String rearImageLink;

	@Column(name="LATITUDE")
	private double latitude;

	@Column(name="LONGITUDE")
	private double longitude; 

	@Column(name="INFO_TAGGED")
	private String infoTagged;

	@Column(name="VIDEO_DIRECTION")
	private String videoDirection;

	@Column(name="MILEPOINT")
	private BigDecimal milepoint;
	
	@Column(name="ALTERNATEREF")
	private String alternateref;


	//@Column(name="GEOM")
	//private Object geom;

	//@Column(name="REFERENCE_MILEPOINT")
	//private BigDecimal referenceMilepoint;

	//@Column(name="REFERENCE_SET")
	//private String referenceSet;

	//@Column(name="ROAD_IDENTIFIER")
	//private String roadIdentifier;


	//@Temporal(TemporalType.DATE)
	//private Date updt;


	//@Column(name="YEAR_RECORDED")
	//private BigDecimal yearRecorded;

	public Dvldataset() {
	}

	public BigDecimal getId() {
		return id;
	}

	public void setId(BigDecimal id) {
		this.id = id;
	}

	public String getAlternateref() {
		return alternateref;
	}

	public void setAlternateref(String alternateref) {
		this.alternateref = alternateref;
	}

	public String getFrontCenterImageLink() {
		return frontCenterImageLink;
	}

	public void setFrontCenterImageLink(String frontCenterImageLink) {
		this.frontCenterImageLink = frontCenterImageLink;
	}

	public String getFrontLeftImageLink() {
		return frontLeftImageLink;
	}

	public void setFrontLeftImageLink(String frontLeftImageLink) {
		this.frontLeftImageLink = frontLeftImageLink;
	}

	public String getFrontRightImageLink() {
		return frontRightImageLink;
	}

	public void setFrontRightImageLink(String frontRightImageLink) {
		this.frontRightImageLink = frontRightImageLink;
	}

	public String getInfoTagged() {
		return infoTagged;
	}

	public void setInfoTagged(String infoTagged) {
		this.infoTagged = infoTagged;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public BigDecimal getMilepoint() {
		return milepoint;
	}

	public void setMilepoint(BigDecimal milepoint) {
		this.milepoint = milepoint;
	}

	public String getRearImageLink() {
		return rearImageLink;
	}

	public void setRearImageLink(String rearImageLink) {
		this.rearImageLink = rearImageLink;
	}
 
	public String getSideLeftImageLink() {
		return sideLeftImageLink;
	}

	public void setSideLeftImageLink(String sideLeftImageLink) {
		this.sideLeftImageLink = sideLeftImageLink;
	}

	public String getSideRightImageLink() {
		return sideRightImageLink;
	}

	public void setSideRightImageLink(String sideRightImageLink) {
		this.sideRightImageLink = sideRightImageLink;
	}

	public String getVideoDirection() {
		return videoDirection;
	}

	public void setVideoDirection(String videoDirection) {
		this.videoDirection = videoDirection;
	}
 
	
	
	
}