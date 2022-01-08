import React, {Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import settings from "../settings";
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { TabStripTab,TabStrip} from "@progress/kendo-react-layout"
import $ from "jquery";
import update, { extend } from 'immutability-helper';
import { getLocalNow, LocalToUTC  } from "../helper";
import Materialize from "materialize-css"
import { withRouter,Link,Router } from 'react-router-dom';
import KendoGrid from "../KendoGrid"
import ColumnMenu from "../ColumnMenu"
import { Provider, withBus } from 'react-bus'
class LoadRoad extends PureComponent{

  constructor(props){

    super(props)
    this.gridopts = {
      take:5,skip:0,
      sort: [
            { field: 'NAME', dir: 'asc' }
        ]
    }
    this.state = {
        isLoading:true,features:[]
    }
    this.grid = React.createRef()
    this.workspace = {model:{}}
    this.procesdate = React.createRef()
    this.processtime = React.createRef()
    this.source = React.createRef()
    this.model = React.createRef()
    this.setDefaultDateTime()
  }
  setDefaultDateTime(){
    let jobtimestr = getLocalNow()
    let datetimeparts = jobtimestr.split(" ")
    console.log(datetimeparts)
    if(typeof this.workspace.procesdate == "undefined"){

      this.workspace.procesdate = datetimeparts[0]

    }
    if(typeof this.workspace.procestime == "undefined") {

      this.workspace.procestime = datetimeparts[1]
    }
  }
  updateFeaturesForModel(evt){
        let modelname = evt.target.value
        let model =  this.models.find( (x) => { return x.name == modelname} )
        let newstate = update ( this.state,{ model:{$set:model}})
        this.setState(newstate)
  }
  getFeatures(){
        let modelfeatures = this.state.model.features

        let features = this.state.features;

        if(!modelfeatures)
        {
                let modelname =  this.state.model.name
                let omodel = this.models.find((x)=>{ return x.name == modelname})
                if(omodel && omodel.features)
                modelfeatures = omodel.features
        }

        if(modelfeatures)
        {
            modelfeatures = modelfeatures.map( (x) => { return x.toLowerCase()})
            features = features.filter( (x)=>{
                 return modelfeatures.includes(x.modellabel.toLowerCase()) })
        }
        return features;
  }	
  triggerProcess() {
    this.workspace.procesdate = this.procesdate.current.value
    this.workspace.procestime = this.processtime.current.value
    let val = this.model.current.value
    val = this.models.find( (p)=> { return p.name == val})
    this.workspace.model = val
    //debugger
    //let checkboxes = this.grid.current.querySelectorAll("input.selects[type=checkbox]")
    if(typeof this.workspace.features == "undefined") this.workspace.features = []
    let self = this
    this.workspace.features.length = 0
    let features = this.getFeatures().filter ( (q)=>{ return  q.selected})
    .map( (obj,idx)=>{
        return { classid:self.state.model.features.findIndex( (t)=>{ return t.toLowerCase() == obj.modellabel.toLowerCase() })
    ,label:obj.name,threshold:obj.threshold,modellabel:obj.modellabel } })

    this.workspace.features = features

    let datasourceParam = Object.assign( {},this.datasource.config)
    datasourceParam.source = this.source.current.value
    datasourceParam.url = this.source.current.value
    let datasource = { name:"Road "+this.props.road,type:3,config:datasourceParam}
    self.setState(update( self.state,{isLoading:{$set:true} }))
    $.ajax({url:settings.baseurl+"/data/datasources/",type:"POST",data:JSON.stringify(datasource)})
    .then((d)=>{
      let workspace = {datasource :d.id}
        workspace.param = this.workspace
        return $.ajax({
          url:settings.baseurl+"/data/workspaces/",type:"POST",data:JSON.stringify(workspace)
        } )
      }
    )
    .then((w)=>{
      let jobstarttime = LocalToUTC(self.workspace.procesdate+" "+self.workspace.procestime)
      let jobData = {workspace:w.id,type:7,starttime: jobstarttime,
          param: Object.assign(datasourceParam,self.workspace)}
      jobData.param.isroad = self.props.road
      jobData.road = self.props.road	
      return $.ajax({ url: settings.baseurl+"/data/jobs/",type:"POST",
        data:JSON.stringify(jobData)})

    })
    .then((j)=>{
        self.props.bus.emit("job-add",j)
        self.setState( update( self.state,{isLoading:{$set:false}}))
        this.props.close()
    })
  }
  componentDidMount(){
    let self = this
    let d0 = $.ajax({
      url: settings.baseurl + "/data/aimodel/", type: "GET"
    })
    let d1 = $.ajax({
      url: settings.baseurl + "/data/features/", type: "GET"
    })
    let d2 = $.ajax({ url:settings.baseurl+"/data/datasources/?type=6",type:"GET" })
    $.when(d0,d1,d2).done( (v0,v1,v2)=>{

      self.models = v0[0].filter( (q) =>{ return q.active != null && q.active.hasOwnProperty("show") &&  q.active.show == "1" } )
      let features = v1[0]
         
           .map( (q) => { return update(q,{ selected: {$set : false } } ) } )

      if(v2[0].length > 0)
      self.datasource = v2[0][0]
      else {
        const { history } = this.props;
        history.push( { pathname:"/Networksettings"})
      }

     // let currfeatures = []


      let newstate = update(self.state,{ isLoading: {$set:false},
          features:{$set : features },model:{$set:self.models[0] } })


      self.setState(newstate)

    })
  }
  componentDidUpdate(){
    this.initMaterial()
  }
  initMaterial(){
    let elems = document.querySelectorAll('select')
    Materialize.FormSelect.init(elems, {})

    if(this.procesdate.current != null)
      Materialize.Datepicker.init(this.procesdate.current, {format:"mm/dd/yyyy"
      });
    if(this.processtime.current != null)
      Materialize.Timepicker.init(this.processtime.current,{twelveHour:false,format:"HH:MM"} )

    Materialize.updateTextFields()
  }
  render(){
    let self = this
    let running = window.alljobs.filter((t)=>{ return (t.status==2 || t.status==1) &&
       (t.type==5 || t.type == 7) && (t.param.isroad && t.param.isroad == self.props.road) })
   let selectionChange = (event) => {
        event.dataItem.selected = !event.dataItem.selected;
        this.forceUpdate();
    }

    let rowClick = (event) => {
        let last = self.lastSelectedIndex;
        const current = self.state.features.findIndex(dataItem => dataItem === event.dataItem);

        if (!event.nativeEvent.shiftKey) {
            self.lastSelectedIndex = last = current;
        }

        if (!event.nativeEvent.ctrlKey) {
            self.state.features.forEach(item => item.selected = false);
        }
        const select = !event.dataItem.selected;
        for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
            this.state.features[i].selected = select;
        }
        this.forceUpdate();
    }
    let headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        this.state.features.forEach(item => item.selected = checked);
        this.forceUpdate();
    }
    
    if(this.state.isLoading)
    {
      return (<div  className="lds-facebook"><div></div><div></div><div></div></div>)
    }

    return (
  <Fragment>
    <div className="row">
      <div className="col s11"><h5>Download Road #{this.props.road} and Process</h5></div>
      <div className={"col s1"}><i className={"fa fa-close"}
          style={{fontSize:"18px",cursor:"pointer"}}
          onClick={this.props.close} ></i> </div>
    </div>
  <div className="row">
    <div className={"input-field col s12"}>
      <input id={"source"}
             type="text"   defaultValue={this.datasource.config.url} ref={this.source} />

           <label htmlFor={"source"}>Update Image Source URL</label>
    </div>
  </div>
  <div className="row">
  <div ref={this.grid} className={"col s6"}>
    <KendoGrid  key={this.state.model.name}  data={this.getFeatures()} initstate={this.gridopts} scrollable={"none"}
          style={{height:"365px",width:"500px"}} onSelectionChange={selectionChange}
        onHeaderSelectionChange={headerSelectionChange}  onRowClick={rowClick}   selectedField="selected"      >
      <Column field={"name"}  style={{width:"250px"}} title={"Feature"} columnMenu={ColumnMenu} />
      <Column filter="numeric" field={"threshold"}  style={{width:"100px"}} title={"Threshold"}  columnMenu={ColumnMenu}/> 
      <Column
         field="selected"
         width="50px"
         headerSelectionValue={
         this.state.features.findIndex(dataItem => dataItem.selected === false) === -1
       } />
     </KendoGrid>
  </div>
  <div className={"col s6"}>

      <div className="card" style={{width:"400px"}}>
        <div className="card-content">
          <div className={"row "}>

            <div className="input-field col s12">
              <select  ref={this.model} defaultValue={this.state.model.name} onChange={this.updateFeaturesForModel.bind(this)}>

                { this.models.map( (d,i)=>(
                  <option key={i}  >{d.name}</option>
                ) ) }
              </select>
              <label>Model</label>
            </div>

          </div>
          <div className={"row"}>
            <div className={"col s6"}>
              <label>
                <input id="hasSchedule" defaultChecked={false}  type="checkbox"
                  onChange={ (evt)=>{
                    let root = evt.currentTarget
                    $("#"+root.id+"-dep").toggleClass("hidden")
                  }} />
                <span>Schedule later ?</span>
              </label>
            </div>
          </div>
      <div className={"row hidden"} id="hasSchedule-dep">
        <div className={"input-field col s12"}>
          <input
                 type="text" className="datepicker" id={"datepicker"} ref={this.procesdate} defaultValue={this.workspace.procesdate} />

          <label htmlFor={"datepicker"}>Process images on day.</label>
        </div>
        <div className={"input-field col s12"}>
          <input
            type={"text"}  className={"timepicker"} id={"timepicker"} ref={this.processtime} defaultValue={this.workspace.procestime}/>
          <label htmlFor={"timepicker"}>Process images on time.</label>
        </div>

      </div>
      <div className={"row"}>
                          <div className={"col-12"} dangerouslySetInnerHTML={{__html: this.state.model.modeldetails ? this.state.model.modeldetails.details :-
                         "" }} / >
---------------------------
      </div>
      <div className={"row"}>
        <button disabled={running.length != 0? true :false  } className="waves-effect waves-light btn right"
           onClick={this.triggerProcess.bind(this)} >Process</button>
        </div>
    </div>
  </div>
</div>
</div>
  </Fragment>
  )

  }

}
LoadRoad.propTypes = {
  close:PropTypes.func,
  road:PropTypes.number
};

let returnObj = LoadRoad
returnObj = withBus()( returnObj )
export default returnObj
