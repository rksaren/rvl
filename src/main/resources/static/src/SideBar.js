import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import settings from "./settings";
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { TabStripTab,TabStrip} from "@progress/kendo-react-layout"
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
     
    this.state = {  isLoading:false  }
  
     
  }
  

  render() {

    return (
      <React.Fragment>
      <div className="left_menu inner slidein">
        <div className="menu_box" onClick={this.props.prev} title={"Prev"}>
          <div className="valign" ><i className="fa fa-backward"></i></div>
        </div>
        <div className="menu_box" onClick={this.props.play} title={"Play"}>
          <div className="valign"><i className={this.props.playing ? "fa fa-pause" :"fa fa-play"}></i></div>
        </div>
        <div className="menu_box" onClick={this.props.next} title={"Next"}>
          <div className="valign"><i className="fa fa-forward"></i></div>
        </div>
        <div className="menu_box" onClick={this.props.next} title={"Compare"} style={{height:'70px'}}>
        	<div className="valign"><i className="fa fa-balance-scale"></i></div>
        </div> 

      </div>
        
      </React.Fragment>
    )
  }
  

   
  
}

SideBar.propTypes = {
  playing:PropTypes.bool,
  play:PropTypes.func,
  next:PropTypes.func,
  prev:PropTypes.func,
  
};

let returnObj = SideBar
returnObj = withBus()( returnObj )
export default returnObj
