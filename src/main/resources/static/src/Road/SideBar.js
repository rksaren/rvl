import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import settings from "../settings";
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { TabStripTab,TabStrip} from "@progress/kendo-react-layout"
import $ from "jquery";
import update, { extend } from 'immutability-helper';
import { getLocalNow, LocalToUTC  } from "../helper";
import Materialize from "materialize-css"
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';


class SideBar extends PureComponent{


  constructor(props){
    super(props)
    this.state = {
      isLoading:true,

      visible: false,selected:0,features:[]
    }
    this.workspace = this.props.item.param

    this.id = this.props.item.id
    this.procesdate = React.createRef()
    this.processtime = React.createRef()
    this.extractdate = React.createRef()
    this.extracttime = React.createRef()
    this.grid = React.createRef()
    this.adddatasource = React.createRef()
    this.model = React.createRef()
    this.setDefaultDateTime()
  }
  handleSelect = (e) => {
    let newstate = update(this.state,{ selected:{$set : e.selected}})
    this.setState(newstate)
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
    if(typeof this.workspace.date == "undefined"){

      this.workspace.date = datetimeparts[0]
    }
    if(typeof this.workspace.time == "undefined") {

      this.workspace.time = datetimeparts[1]
    }
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
        <div className="menu_box" onClick={this.toggleDialog.bind(this)} title={"Run Detection"}>
          <div className="valign"><i className="fa fa-outdent"></i></div>
        </div>

      </div>
        {
          this.state.visible &&
        <Dialog width={'100%'} closeIcon={true} height={'100%'} onClose={this.toggleDialog.bind(this)}>
            {
              this.state.isLoading ?
              (
                <div  className="lds-facebook"><div></div><div></div><div></div></div>
              ):
              this.getModalContent()
            }

        </Dialog>
        }

      </React.Fragment>
    )
  }
  getModalContent(){
    let self = this
    return (
      <React.Fragment>
        <div className="row">
          <div className="col s11"><h5>Manage Workpsace</h5></div>
          <div className={"col s1"}><i className={"fa fa-close"} style={{fontSize:"18px",cursor:"pointer"}} onClick={this.toggleDialog.bind(this)} ></i> </div>
        </div>
        <div className="row">
          <div className="col s12 m12">
                <TabStrip selected={this.state.selected} onSelect={this.handleSelect}>
                  <TabStripTab title="Process">

                    <div ref={this.grid} className={"col s6"}>
                      <Grid   data={this.features} scrollable={"scrollable"}
                            style={{height:"350px"}}      >
                        <Column field={"name"}  style={{width:"150px"}} title={"Feature"}/>
                        <Column field={"threshold"}  style={{width:"50px"}} title={"Threshold"} />
                        <Column field={"id"} style={{width:"100px"}}  title={"Selected?"} cell={(props)=>
                          (
                            <td>
                              <label>
                                <input defaultChecked={self.state.features.findIndex(
                                  (t)=>{ return t.classid==props.dataItem["classid"]  }) != -1 }

                                       name={props.dataItem["id"]}  type="checkbox"   />
                                <span>&nbsp;</span>
                              </label>
                            </td>)
                        } />
                      </Grid>
                    </div>
                    <div className={"col s6"}>

                        <div className="card">
                          <div className="card-content">
                            <div className={"row "}>

                              <div className="input-field col s12">
                                <select  ref={this.model} defaultValue={this.workspace.model} >

                                  { this.models.map( (d,i)=>(
                                    <option key={i}  >{d.name}</option>
                                  ) ) }
                                </select>
                                <label>Model</label>
                              </div>

                            </div>

                        <div className={"row"}>
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

                          <a className="waves-effect waves-light btn" onClick={this.triggerProcess.bind(this)} >Process</a>

                      </div>
                    </div>

                    </div>

                  </TabStripTab>
                <TabStripTab title={"Add more"}>

                    <div className={"col s12"}>
                    <div className="card">
                      <div className="card-content">
                       <div className={"row "}>

                         <div className="input-field col s12">
                           <select ref={this.adddatasource} defaultValue={this.datasources[0].id}
                                     >

                             { this.datasources.map( (d,i)=>(
                                <option key={i}  value={d.id} >{d.name}</option>
                             ) ) }
                           </select>
                           <label>Datasource</label>
                         </div>

                       </div>


                <div className={"row"}>
                  <div className={"input-field col s12"}>
                    <input
                           type="text" className="datepicker" id={"datepicker-extract"} ref={this.extractdate} defaultValue={this.workspace.date} />

                    <label htmlFor={"datepicker-extract"}>Download images on day.</label>
                  </div>
                  <div className={"input-field  col s12"}>
                    <input
                            type={"text"} className={"timepicker"} id={"timepicker-extract"} ref={this.extracttime} defaultValue={this.workspace.time}/>
                    <label htmlFor={"timepicker-extract"}>Download images on time.</label>
                  </div>
                </div>



                  <a className="waves-effect waves-light btn" onClick={this.triggerExtract.bind(this)} >Process</a>

                    </div>
                  </div>
                    </div>
                </TabStripTab>
                </TabStrip>
              </div>
            </div>


      </React.Fragment>
    )
  }
  toggleDialog(){
   let state = update(this.state, { visible:{$set:!this.state.visible}})
    this.setState(state)
  }

  triggerProcess() {
    this.workspace.procesdate = this.procesdate.current.value
    this.workspace.procestime = this.processtime.current.value
    let val = this.model.current.value
    val = this.models.find( (p)=> { return p.name == val})
    this.workspace.model = val
    debugger
    let checkboxes = this.grid.current.querySelectorAll("input[type=checkbox]")
    if(typeof this.workspace.features == "undefined") this.workspace.features = []
    let self = this
    this.workspace.features.length = 0
    let features = []
    checkboxes.forEach((x,i)=>{
          if(x.checked){
            let obj = self.features.find((g)=>{ return g.id == x.name })
           let f = Object.assign({},{ classid:obj.classid,label:obj.name,threshold:obj.threshold})
            features.push(f)
          }
    })
    this.workspace.features = features
    let savedata = Object.assign( {},this.props.item)
    delete savedata.id

    self.setState(update( self.state,{isLoading:{$set:true} }))

    $.ajax({ url:settings.baseurl+"/data/workspaces/"+this.props.item.id+"/",type:"PUT",data:JSON.stringify(savedata) })
      .done( ()=>{
        let jobstarttime = LocalToUTC(self.workspace.procesdate+" "+self.workspace.procestime)
        let jobData = {workspace:self.props.item.id,type:5,starttime: jobstarttime,
            param: self.workspace}
          $.ajax({ url: settings.baseurl+"/data/jobs/",type:"POST", data:JSON.stringify(jobData)})
            .done(()=>{
              self.setState( update( self.state,{isLoading:{$set:false},features:{$set:features} }))
            })


      })


  }
  triggerExtract(){
    let self = this
    this.workspace.date = this.extractdate.current.value
    this.workspace.time = this.extracttime.current.value
    let val = this.adddatasource.current.value
    val = this.datasources.find( (p)=> { return p.name == val})

    if(this.props.item.datasource != val.id){


      this.props.item.datasource = val.id
      for (let attrname in val)
      {if(attrname != "date" && attrname != "time")
        this.workspace[attrname] = val[attrname]; }

    }

    let savedata = Object.assign( {},this.props.item)
    delete savedata.id

    self.setState(update( self.state,{isLoading:{$set:true} }))

    $.ajax({ url:settings.baseurl+"/data/workspaces/"+this.props.item.id+"/",type:"PUT",data:JSON.stringify(savedata) })
      .done( ()=>{
        let jobstarttime = LocalToUTC(self.workspace.date+" "+self.workspace.time)
        let jobData = {workspace:self.props.item.id,type:val.type,starttime: jobstarttime,
          param: self.workspace}
        $.ajax({ url: settings.baseurl+"/data/jobs/",type:"POST", data:JSON.stringify(jobData)})
          .done(()=>{
            self.setState( update( self.state,{isLoading:{$set:false} }))
          })


      })

  }

  componentDidMount() {
    let self = this
    let d0 = $.ajax({
      url: settings.baseurl + "/data/aimodel/", type: "GET"
    })
    let d1 = $.ajax({
      url: settings.baseurl + "/data/features/", type: "GET"
    })
    let d2  =  $.ajax( { url:settings.baseurl + "/data/datasources/", type: "GET"})
    $.when(d0,d1,d2).done( (v0,v1,v2)=>{

      self.models = v0[0]
      self.features = v1[0]
      self.datasources = v2[0]
      let currfeatures = self.props.item.param.features
      if(typeof currfeatures == "undefined") currfeatures = []

      let newstate = update(self.state,{ isLoading: {$set:false},
          features:{$set:currfeatures.map((f)=>{ return {classid:f.classid,threshold:f.threshold }})}})
      this.initMaterial()

      self.setState(newstate)

    })
  }
  initMaterial(){
    let elems = document.querySelectorAll('select')
    Materialize.FormSelect.init(elems, {})

    if(this.procesdate.current != null)
      Materialize.Datepicker.init(this.procesdate.current, {format:"mm/dd/yyyy"
      });
    if(this.processtime.current != null)
      Materialize.Timepicker.init(this.processtime.current,{twelveHour:false,format:"HH:MM"} )


    if(this.extractdate.current != null)
      Materialize.Datepicker.init(this.extractdate.current, {format:"mm/dd/yyyy"
      });
    if(this.extracttime.current != null)
      Materialize.Timepicker.init(this.extracttime.current,{twelveHour:false,format:"HH:MM"} )


    Materialize.updateTextFields()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.initMaterial()

  }
}

SideBar.propTypes = {
  playing:PropTypes.bool,
  item:PropTypes.object,
  play:PropTypes.func,
  next:PropTypes.func,
  prev:PropTypes.func
};
export default SideBar;
