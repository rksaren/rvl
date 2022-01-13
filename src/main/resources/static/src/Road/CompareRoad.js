import React, { Fragment, PureComponent } from "react";
import ImageViewer from "../ImageViewer";
import $ from "jquery";
import PropTypes from "prop-types";
import settings from "../settings"
import update from "immutability-helper"

import { withRouter,Link } from 'react-router-dom';
 
import { Provider, withBus } from 'react-bus'
 

class CompareRoadView extends PureComponent{
	constructor(props)
	{
		super(props)
		this.state = {
	      isLoading: true,playing:false,items:null
		}
	}
	render() {
	     
	    if (this.state.isLoading) {

	      return (<div className="lds-facebook">
	        <div></div>
	        <div></div>
	        <div></div>
	      </div>)

	    }
	    else if (this.state.items == null || this.state.items.length == 0) {
	      return (
	        <React.Fragment>
	           
	          
	          <div className={"row"}>
	              <div className="col s2 offset-s10"></div>

	          </div>
	        <div className="noresults">No Images found..</div>
	        </React.Fragment>
	      )
	    }
	     
	    return (	      
	        <div className={"row nopadding"} >
	          {this.getImageViewer()}
	        </div>	       
	    )
	  }	  
	  getImageViewer() 
	  {
		  let self = this
		    let milepoint = this.state.items[this.props.curr]
		    let entry = this.state.mappings[milepoint];
		    let images = entry.images
		    let sm = null
			if(this.props.rearview == 1)
			{
				sm = 9/(entry.images.length-1)
			}
			else
			{
				images = images.filter((x)=>{ return x.dir  != "B" })
				sm = 12/images.length
				
			}
			
		    return images.map( (im) => {
		    	   	 
		         
		        return (<ImageViewer adjust={this.state[im.adjust]}  
		        		key={im.id+"_"+this.props.rearview} 
		        		adjustImage={this.adjustImage.bind(this)}
		           		height={400} src={im} dir= {im.dir}
		        		originalwidth = {this.metadata.originalwidth}
		        		originalheight = {this.metadata.originalheight}
		        		sm = {"s"+(im.dir == "B" ? "3": sm)}
		        />)
		    })

	     
	  }
	  adjustImage(dir,transform){
	      
	      let property = "";
	      let value = transform.x+":"+transform.y;
	      if(dir == "L") property="leftImageAdj";
	      else if(dir == "M") property="centerImageAdj";
	      else if(dir == "R") property="rightImageAdj";
	      let newstate  = {}
	      newstate[property] = value
	      this.setState(newstate)

	  }
	 
	  loadData()
	  {
		 	
	    let id = this.props.roadway_id
	    let year = this.props.year
	    let self = this

	    $.ajax({
	      url: settings.baseurl + "/rest/services/getcompareyearDvldataset/"+year+"/"+ id , type: "GET"
	    }).done((images)=>{
	      if(images.length == 0){

	        self.setState(update(self.state,{ isLoading:{$set:false}}))
	        return false
	      }
	             
	            self.metadata = images.dataSettings
	            self.noOfImages = images.dataSettings.numimages;
	            images = images.data;
	            images = images.sort((a, b)=>{
	              return a.milepoint-b.milepoint
	            })
	            self.images = images;
	            let items = images.map((x) => {  
	                return x.milepoint
	              }
	            );
	            let mappings = images.reduce((total,entry) => {  
	              let mimages = [];
	              if(entry.frontLeftImageLink){
	            	  mimages.push({dir:"L",id:entry.id+"L",path:this.metadata.orgimagehost+entry.frontLeftImageLink
	                      ,adjust: "leftImageAdj"})
	              }
	              if(entry.frontCenterImageLink){
	            	  mimages.push({dir:"M",id:entry.id+"M",path:this.metadata.orgimagehost+entry.frontCenterImageLink
	                      ,adjust: "centerImageAdj"})
	              }
	              if(entry.frontRightImageLink){
	            	  mimages.push({dir:"R",id:entry.id+"R",path:this.metadata.orgimagehost+entry.frontRightImageLink
	                      ,adjust:"rightImageAdj"})
	              }
	              if(entry.rearImageLink)
	              {
	            	  mimages.push({dir:"B",id:entry.id+"B",path:this.metadata.orgimagehost+entry.rearImageLink
	                      ,adjust:null})
	              }	 
	              let obj =  { id: entry.id,images:mimages,position:{lat:entry.latitude,lon:entry.longitude}};
	              total[entry.milepoint] = obj;
	              
	              return total;
	            }
	           
	          ,{});
	            
	         
	             
	            self.setState({isLoading:false,items:items,mappings:mappings,leftImageAdj:self.metadata.leftImageAdj,
	              centerImageAdj:self.metadata.centerImageAdj,rightImageAdj:self.metadata.rightImageAdj,noOfImages:self.noOfImages})
	        
	    })
	  }
	  componentDidMount() {
	     
	    this.loadData()

	  }
}

let returnObj = CompareRoadView
returnObj = withBus()( returnObj )
export default withRouter(returnObj);