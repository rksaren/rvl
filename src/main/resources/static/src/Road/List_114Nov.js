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
            { field: 'ROAD', dir: 'asc' }
        ]
    }
    this.state = {
      visible:false,road:null,
      isLoading:true,skip: 0, take:10
    }
  }
  toggleDialog(){
   let state = update(this.state, { visible:{$set:!this.state.visible},
    road:{$set:null}})
    this.setState(state)
  }

 render() {
    let Back = (props)=>( <Link to={"/"}><span className={"back"}  >Back</span></Link> )
    if(this.state.isLoading){

      return (<div className="lds-facebook"><div></div><div></div><div></div></div>)

    }
    else if(this.state.items.length == 0)
    {
      return (<React.Fragment><Back /><div className="noresults">No results found..</div></React.Fragment> )
    }
    return (
      <React.Fragment>
       <Back />
        <div className="row" ref={this.content}>


                <div className={"row"}>
                  <div className={"col s11"}><h5>All Roads</h5></div>
                  <div className={"col s1"}></div>
                </div>
                <KendoGrid data={this.state.items}
                      initstate={this.gridopts} scrollable={"none"}
                      style={{ height: '624px',width:"1000px" }}
                      >
                   <Column field={"NAME"} width={"250px"} columnMenu={ColumnMenu} />
                   <Column filter="numeric" field={"ROAD"} width={"150px"} columnMenu={ColumnMenu} />
                  <Column filter="numeric" field={"NUMIMAGES"} width={"150px"} title={"Num Images"} columnMenu={ColumnMenu} />
                  <Column filter="numeric" field={"NUMFEATURES"} width={"150px"} title={"# Identified"} columnMenu={ColumnMenu} />
                  <Column  field={"PROCESSED"} width={"150px"} title={"Is Collected"}
                          cell={(props)=>
                            (
                            <td>
                              <i style={{fontSize:"18px"}} className={props.dataItem[props.field] == null || props.dataItem[props.field] == 0
                                ? "fa fa-close" : "fa fa-check"}></i>


                            </td>)
                          } />
                        <Column field={"ID"} width={"150px"} title={"Action"} cell={
                    (props)=>{
                      if(props.dataItem["NUMIMAGES"] != 0
                      || (props.dataItem["PROCESSED"] != null && props.dataItem["PROCESSED"] != 0))
                      return (
                      <td>
                        <Link  to={"/Roads/"+props.dataItem["ROAD"]}><span className={"fa fa-angle-double-right"}  ></span></Link>


                      </td>)
                      else return (
                        <td>
                           <span onClick={(evt)=>{
                              let state = update(this.state, { visible:{$set:!this.state.visible},
                              road:{$set:Number(evt.currentTarget.dataset.item)}})
                              this.setState(state)
                             }}
                             style={{cursor:"pointer"} }
                             data-item={props.dataItem["ROAD"]} className={"fa fa-download"}  ></span>


                        </td>)

                    }

                  }/>
                </KendoGrid>
              </div>
      {
        this.state.visible &&
      <Dialog width={'100%'} closeIcon={true} height={'100%'}
            onClose={this.toggleDialog.bind(this)}>
          <LoadRoad road={Number(this.state.road)} close={this.toggleDialog.bind(this)} />
      </Dialog>
      }

      </React.Fragment>
    )


  }
  newJobAdded(job){
    let road = job.param.isroad
    if(typeof road != "undefined"){
        let idx = this.state.items.findIndex((t)=>{ return t.ROAD == road })
        if(idx != -1)
        {
          let r = update(this.state.items[idx],{PROCESSED:{$set:1}})

          this.setState(update(this.state,{ items:{$splice:[[idx,1,r]] }}))
        }

    }
  }
  componentWillUnmount(){
    this.props.bus.off("job-add")
  }
  componentDidMount() {
    this.props.bus.on("job-add",this.newJobAdded.bind(this))
    let self = this
    $.ajax({
      url:settings.baseurl+"/io/getroads/",type:"GET",success:(data)=> {
        data = data.sort((a,b)=>{ return compareUTCDate(a,b) })
        self.setState({items:data,isLoading:false})  }
    } )
  }



}
List.propTypes = {
  changeState: PropTypes.func,
  param:PropTypes.object
};

let returnObj = List
returnObj = withBus()( returnObj )
export default withRouter(returnObj);
