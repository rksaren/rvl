import React, { PureComponent } from "react";
import $ from "jquery"
import settings from "../settings";
import PropTypes from "prop-types";
import { withRouter,Link } from 'react-router-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import {compareUTCDate,UTCToLocal} from "../helper"
import update from "immutability-helper"
import { filterBy } from '@progress/kendo-data-query';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

import KendoGrid from "../KendoGrid"
import ColumnMenu from "../ColumnMenu"
import { Provider, withBus } from 'react-bus'
class List extends PureComponent{

  constructor(props){
    super(props)
     
  }
   
 render() {
  
    return (
      
        <div className="row" >
 	        <div className="col s12">
	        	<h6>Select Road</h6>
	        </div>
        </div>      
    )


  }

}
 
let returnObj = List
returnObj = withBus()( returnObj )
export default withRouter(returnObj);
