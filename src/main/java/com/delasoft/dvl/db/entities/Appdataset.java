package com.delasoft.dvl.db.entities;

import java.io.Serializable;
import javax.persistence.*;

import org.hibernate.annotations.CacheModeType;
import org.hibernate.annotations.NamedQueries;
import org.hibernate.annotations.NamedQuery;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;


/**
 * The persistent class for the RV$APPDATASET database table.
 * 
 */
@Entity
@Cacheable
@Table(name = "RV$APPDATASET")
@JsonIgnoreProperties(ignoreUnknown = true) 
@NamedQueries(value = {
		@NamedQuery(name = "Appdataset.FindAll", query = "from Appdataset order by year desc",cacheable=true, cacheMode=CacheModeType.NORMAL)		
 })
public class Appdataset implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "ID")	
	private BigDecimal id;
	
	@Column(name="CENTER_IMAGE_ADJ")
	private String centerImageAdj;

	private String datasetname;

	@Column(name="FRAME_SIZE_HEIGHT")
	private BigDecimal frameSizeHeight;

	@Column(name="FRAME_SIZE_WIDTH_CENTER")
	private BigDecimal frameSizeWidthCenter;

	@Column(name="FRAME_SIZE_WIDTH_CENTER_REAR")
	private BigDecimal frameSizeWidthCenterRear;

	@Column(name="FRAME_SIZE_WIDTH_LEFT")
	private BigDecimal frameSizeWidthLeft;

	@Column(name="FRAME_SIZE_WIDTH_LEFT_REAR")
	private BigDecimal frameSizeWidthLeftRear;

	@Column(name="FRAME_SIZE_WIDTH_RIGHT")
	private BigDecimal frameSizeWidthRight;

	@Column(name="FRAME_SIZE_WIDTH_RIGHT_REAR")
	private BigDecimal frameSizeWidthRightRear; 
	
	@Column(name="LEFT_IMAGE_ADJ")
	private String leftImageAdj;

	@Column(name="MARGIN_LEFT")
	private BigDecimal marginLeft;

	@Column(name="MARGIN_RIGHT")
	private BigDecimal marginRight;
	
	@Column(name="ORGIMAGEHOST")
	private String orgimagehost;

	@Column(name="RIGHT_IMAGE_ADJ")
	private String rightImageAdj; 
	
	@Column(name="THUMBNAILHOST")
	private String thumbnailhost;
	
	@Column(name="YEAR")
	private BigDecimal year;
	
	@Column(name="ORIGINALWIDTH")
	private Integer originalwidth;
	@Column(name="ORIGINALHEIGHT")
	private Integer originalheight;
	@Column(name="NUM_IMAGES")
	private Integer numimages;
	public Appdataset() {
	}
	
	public Integer getOriginalwidth() {
		return originalwidth;
	}

	public void setOriginalwidth(Integer originalwidth) {
		this.originalwidth = originalwidth;
	}

	public Integer getOriginalheight() {
		return originalheight;
	}

	public void setOriginalheight(Integer originalheight) {
		this.originalheight = originalheight;
	}

	public String getCenterImageAdj() {
		return this.centerImageAdj;
	}

	public void setCenterImageAdj(String centerImageAdj) {
		this.centerImageAdj = centerImageAdj;
	}

	public String getDatasetname() {
		return this.datasetname;
	}

	public void setDatasetname(String datasetname) {
		this.datasetname = datasetname;
	}

	public BigDecimal getFrameSizeHeight() {
		return this.frameSizeHeight;
	}

	public void setFrameSizeHeight(BigDecimal frameSizeHeight) {
		this.frameSizeHeight = frameSizeHeight;
	}

	public BigDecimal getFrameSizeWidthCenter() {
		return this.frameSizeWidthCenter;
	}

	public void setFrameSizeWidthCenter(BigDecimal frameSizeWidthCenter) {
		this.frameSizeWidthCenter = frameSizeWidthCenter;
	}

	public BigDecimal getFrameSizeWidthCenterRear() {
		return this.frameSizeWidthCenterRear;
	}

	public void setFrameSizeWidthCenterRear(BigDecimal frameSizeWidthCenterRear) {
		this.frameSizeWidthCenterRear = frameSizeWidthCenterRear;
	}

	public BigDecimal getFrameSizeWidthLeft() {
		return this.frameSizeWidthLeft;
	}

	public void setFrameSizeWidthLeft(BigDecimal frameSizeWidthLeft) {
		this.frameSizeWidthLeft = frameSizeWidthLeft;
	}

	public BigDecimal getFrameSizeWidthLeftRear() {
		return this.frameSizeWidthLeftRear;
	}

	public void setFrameSizeWidthLeftRear(BigDecimal frameSizeWidthLeftRear) {
		this.frameSizeWidthLeftRear = frameSizeWidthLeftRear;
	}

	public BigDecimal getFrameSizeWidthRight() {
		return this.frameSizeWidthRight;
	}

	public void setFrameSizeWidthRight(BigDecimal frameSizeWidthRight) {
		this.frameSizeWidthRight = frameSizeWidthRight;
	}

	public BigDecimal getFrameSizeWidthRightRear() {
		return this.frameSizeWidthRightRear;
	}

	public void setFrameSizeWidthRightRear(BigDecimal frameSizeWidthRightRear) {
		this.frameSizeWidthRightRear = frameSizeWidthRightRear;
	}

	public BigDecimal getId() {
		return this.id;
	}

	public void setId(BigDecimal id) {
		this.id = id;
	}

	public String getLeftImageAdj() {
		return this.leftImageAdj;
	}

	public void setLeftImageAdj(String leftImageAdj) {
		this.leftImageAdj = leftImageAdj;
	}

	public BigDecimal getMarginLeft() {
		return this.marginLeft;
	}

	public void setMarginLeft(BigDecimal marginLeft) {
		this.marginLeft = marginLeft;
	}

	public BigDecimal getMarginRight() {
		return this.marginRight;
	}

	public void setMarginRight(BigDecimal marginRight) {
		this.marginRight = marginRight;
	}

	public String getOrgimagehost() {
		return this.orgimagehost;
	}

	public void setOrgimagehost(String orgimagehost) {
		this.orgimagehost = orgimagehost;
	}

	public String getRightImageAdj() {
		return this.rightImageAdj;
	}

	public void setRightImageAdj(String rightImageAdj) {
		this.rightImageAdj = rightImageAdj;
	}

	public Integer getNumimages() {
		return numimages;
	}

	public void setNumimages(Integer numimages) {
		this.numimages = numimages;
	}

	public String getThumbnailhost() {
		return this.thumbnailhost;
	}

	public void setThumbnailhost(String thumbnailhost) {
		this.thumbnailhost = thumbnailhost;
	}

	public BigDecimal getYear() {
		return this.year;
	}

	public void setYear(BigDecimal year) {
		this.year = year;
	}

}