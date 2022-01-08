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
import LoadRoad from "./LoadRoad"
import KendoGrid from "../KendoGrid"
import ColumnMenu from "../ColumnMenu"
import { Provider, withBus } from 'react-bus'
class List extends PureComponent{

  constructor(props){
    super(props)
    this.gridopts = {
      take:10,skip:0,
      sort: [
            { field: 'roadno', dir: 'asc' }
        ]
    }
    this.state = {
      visible:false,road:null,items:[],searchkey:"",
      isLoading:false,skip: 0, take:10
    }
    this.inputfield = React.createRef()
  }
  toggleDialog(){
   let state = update(this.state, { visible:{$set:!this.state.visible},
    road:{$set:null}})
    this.setState(state)
  }
  searchRoad(){
    let self = this
    let searchkey = this.inputfield.current.value;
    if(searchkey.length < 3 ) return;
    let url =settings.baseurl+"/rest/services/getroads?search="+searchkey;
    $.ajax({
      url:url,type:"GET",success:(data)=> {
        
        self.setState({items:data,isLoading:false,searchkey:searchkey})  }
    } )
  }
 render() {
    let Back = (props)=>( <Link to={"/"}><span className={"back"}  >Back</span></Link> )
    if(this.state.isLoading){

      return (<div className="lds-facebook"><div></div><div></div><div></div></div>)

    }
   /* else if(this.state.items.length == 0)
    {
      return (<React.Fragment><Back /><div className="noresults">No results found..</div></React.Fragment> )
    }*/
    var self = this;
    return (
      <React.Fragment>
       <Back />
        <div className="row" ref={this.content}>


        
     
        <div className="row">
        <div className="input-field col s6">
          <input  placeholder="Search Road No." ref={this.inputfield} id="roadno" type="text" className="validate"
           onKeyPress={ e => (e.keyCode === 13) && self.searchRoad()  } />
         
        </div>
        <div className="input-field col s6"> 
              <i style={ { marginLeft:"-50px",marginTop:"13px"} }  
              className="fa fa-2x fa-search" aria-hidden="true" onClick={ e => { self.searchRoad() } }></i>
        </div>
        </div>
     
        <div className="row">
        <div className="col s6">
                <KendoGrid data={this.state.items} key={this.state.searchkey}
                      initstate={this.gridopts} scrollable={"none"}
                      style={{ height: '400px',width:"100%" }}
                      >
                   <Column title={"Road No."} field={"roadno"} width={"200px"} columnMenu={ColumnMenu} />
                   <Column filter="numeric" field={"begmp"} width={"200px"} columnMenu={ColumnMenu} />

                  <Column filter="numeric" field={"endmp"} width={"200px"} title={"# Detections"} columnMenu={ColumnMenu} />
               
                  <Column field={"rdway_id"} width={"50px"} title={"Action"} cell={
                    (props)=>{
                     
                      return (
                      <td>
                        <Link  to={"/Roads/"+props.dataItem["rdway_id"]}><span className={"fa fa-angle-double-right"}  ></span></Link>


                      </td>)
                       

                    }

                  }/>
                </KendoGrid>
              </div>
        </div>
       </div> 

      </React.Fragment>
    )


  }
  
  componentWillUnmount(){
    this.props.bus.off("job-add")
  }
  componentDidMount() {
     
    
  }



}
List.propTypes = {
  changeState: PropTypes.func,
  param:PropTypes.object
};

let returnObj = List
returnObj = withBus()( returnObj )
export default withRouter(returnObj);
