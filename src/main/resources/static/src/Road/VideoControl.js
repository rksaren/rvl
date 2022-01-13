import React, { Fragment, PureComponent } from "react";
 
import settings from "../settings"
import update from "immutability-helper"
import $ from "jquery";
 
import { withRouter,Link } from 'react-router-dom';
 
import { Provider, withBus } from 'react-bus'
 
 

class VideoControl extends PureComponent {
	
	render(){
		  return (
			     
			      <div className="control_menu inner slidein">
			        <div className="menu_box" onClick={this.props.prev} title={"Prev"}>
			          <div className="valign" >
			          	<button className="k-button k-button-icon">
			          		<i className="fa fa-backward"></i>
			          	</button>	
			          </div>
			        </div>
			        <div className="menu_box" onClick={this.props.play} title={"Play"}>
			          <div className="valign">
			          	<button className="k-button k-button-icon">
			          		<i className={this.props.playing ? "fa fa-pause" :"fa fa-play"}></i>
			          	</button>
			          </div>
			        </div>
			        <div className="menu_box" onClick={this.props.next} title={"Next"}>
			          <div className="valign">
			          	<button className="k-button k-button-icon">
			          		<i className="fa fa-forward"></i>
			          	</button>	
			          </div>
			        </div>
			        <div className="roadinfo" key={this.props.mile}>
			        	 
			        		<span style={{"marginRight":"5px"}}>Milepoint</span>
			        		<input step=".01" type="number"  defaultValue={this.props.mile}
			        			onChange={(evt)=>{ 
			        				this.props.gotoMile({ "dataItem":{ "mile":evt.currentTarget.value }}) }}
			        			/> 
			        	 
			        </div>
			      </div>
			        
			       
			    )
	}
	
}

export default VideoControl;