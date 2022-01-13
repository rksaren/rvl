import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import settings from "./settings";
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { TabStripTab,TabStrip} from "@progress/kendo-react-layout"
import { DropDownButton } from "@progress/kendo-react-buttons";
import $ from "jquery";
import update, { extend } from 'immutability-helper';
import { getLocalNow, LocalToUTC  } from "./helper";
import Materialize from "materialize-css"
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import KendoGrid from "./KendoGrid"
import ColumnMenu from "./ColumnMenu"
import { Provider, withBus } from 'react-bus'
class SideBar extends PureComponent{


  constructor(props){
    super(props)
     
    this.state = {  settings:[],year:null }
  
     
  }
  

  render() {
   
	if(this.state.settings.length == 0) 
	{
		return (<React.Fragment> </React.Fragment>)
	}	
  		
    return (
      
      <div className="left_menu inner slidein">
        <div className="menu_box" onClick={this.rearview.bind(this)} title={"Rear"}>
          <div className="valign" >
          	<button className="k-button k-button-icon">
          		<i style={this.props.rearview == 1 ? {"color":"GREEN"} :{}} 
          		className="fa fa-exchange"></i>
          
          	</button>	
          	</div>
        </div>
       
        <div className="menu_box" onClick={this.compareview.bind(this)} title={"Compare"} style={{height:'70px'}}>
        	<div className="valign" >
        		<button  className="k-button k-button-icon">		
        			<i  style={this.props.compareview == 1 ? {"color":"GREEN"} :{}} className="fa fa-balance-scale"></i>
        		</button>	
        	</div>
        </div> 
        {this.props.compareview == 1 && 
        	(
        		<div className="menu_box"  style={{height:'70px'}}>
                	<div className="valign"  >
                			<div style={{"fontSize":"medium"}} >{ this.props.compareyear == null ? "Year" : this.props.compareyear }</div>
                			<DropDownButton onItemClick={this.setYear.bind(this)} iconClass="fa fa-calendar" items={this.state.settings}    />
                	</div>
                </div> 	
        	)
        }
        	
        
      </div>
    )
  }
  setYear(x)
  {
	  
	  this.props.changeCompareview(x.item)
	   
  }
  rearview()
  {
	   
	  this.props.changeRearview()
	   
  }
  compareview(){
	 this.props.changeCompareview(this.props.compareyear == null ? this.state.settings[0] : null )
  }
  getSettings(p)
  {
	  let arr =  Object.keys(p)
		.filter( (x) => { return ! ["prevYear","curYear"].includes(x) })
		.map((x)=>{ return Number(x)})
		.reverse()
		
		arr.shift()
		
		return arr
  }
  componentDidMount()
  {
	 
	  
	  let dataset = localStorage.getItem("dvldataset")
	  if(dataset == null)
	  {
		  $.ajax({ url: settings.baseurl + "/rest/services/getAppdataset" , type: "GET"})
		  .done((response)=>{
			   
			  localStorage.setItem("dvldataset", JSON.stringify(response))
			  this.setState(update(this.state,{settings:{$set: this.getSettings(response) }}))
		  })
	  }	  
	  else this.setState(update(this.state,{settings:{$set: this.getSettings(JSON.parse(dataset)) }})) 
	 
  } 
  
}
/*
SideBar.propTypes = {
  playing:PropTypes.bool,
  play:PropTypes.func,
  next:PropTypes.func,
  prev:PropTypes.func,
  
};*/

let returnObj = SideBar
returnObj = withBus()( returnObj )
export default returnObj
