import React, { Fragment, PureComponent } from "react";
import ImageViewer from "../ImageViewer";
import Slider from "../Slider";
import DetectionView from "../Table";
import PropTypes from "prop-types";
import settings from "../settings"
import update from "immutability-helper"
import $ from "jquery";
import SideBar from "../SideBar"
import { withRouter,Link } from 'react-router-dom';
import {getImage} from "../helper"
import * as d3 from "d3";
import { Provider, withBus } from 'react-bus'
import Map from "../Map"
import Materialize from "materialize-css"
import KendoGrid from "../KendoGrid"
import ColumnMenu from "../ColumnMenu"
import CustomCell from "../Customcell"
import {  GridColumn as Column } from '@progress/kendo-react-grid'
import ReactExport from "react-data-export";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import Marker from "../Marker";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Download = (props)=> {

        return (
            <ExcelFile   element={<i className="roadexport fa fa-cloud-download"    title="Download Excel" ></i>}>
                <ExcelSheet data={props.data} name="Detections">
                  <ExcelColumn  label={"Feature name"} value={"name"}     />
                  <ExcelColumn   label={"Milepoint"}  value={"mile"}   />
                  <ExcelColumn   label={"Latitude"}  value={"lat"}    />
                  <ExcelColumn   label={"Longitude"}  value={"lon"}     />
                  <ExcelColumn   label={"Confidence"}  value={"confidence"} />
                  <ExcelColumn   label={"Collected on"} value={"created"}    />


                </ExcelSheet>
            </ExcelFile>
        )

}
class FullGrid extends PureComponent{

  constructor(props) {

    super(props)
    /*this.gridopts = {
      take:10,skip:0,
      sort: [
            { field: 'mile', dir: 'asc' }
        ]
    }*/
   this.state = { type:1 }
 }
 gridopts(){
    let opts = {
      take:20,skip:0,
      sort: [
            { field: 'mile', dir: 'desc' }
        ]
    }
    if(this.state.type == 1){
        opts.filter = {
            logic: "and",
            filters: [
                { field: "info.roarid", operator: "doesnotcontain", value: "Dup" },
                { field: "info.roarid", operator: "doesnotcontain", value: "Incorrect"},
                { field: "info.roarid", operator: "neq", value: "*"}

            ]
        }
    }else if(this.state.type == 2){
         opts.filter = {
            logic: "and",
            filters: [
               { field: "info.roarid", operator: "eq", value: "Incorrect"}
            ]
        }
    }
    return opts;
 }
 handleSelect(evt){
    let newstate = update(this.state,{$set : {type:evt.target.value.id}})
    this.setState(newstate)
 }
 render(){
   let data = [ {id:0,text:"All Results"},{id:1,text:"Unique Results"},{id:2,text:"Incorrect Results"}];
   let current = data.find((t)=>{ return t.id == this.state.type});
   let MyCustomCell = (props) => <CustomCell {...props} />
   return  (

   <Fragment>
      <div className="row">

        <DropDownList style={{"float":"right"}} className="resultselect" defaultValue={current}  onChange={this.handleSelect.bind(this)}
          textField="text" dataItemKey="id" data={data}/>

     <KendoGrid data={this.props.processed} onRowClick={this.props.gotoMile} key={this.state.type}
           initstate={ this.gridopts()} scrollable={"none"}
           style={{ height: '1100px',width:"1250px" }}
            >
           <Column width={"150px"} title={"Feature Name"} field={"name"} columnMenu={ColumnMenu}   />
           <Column width={"150px"} title={"Feature Direction"} field={"info.ocrinfo.featuredirection"} />
           <Column width={"100px"} title={"Milepoint"}  field={"mile"}  columnMenu={ColumnMenu} filter="numeric"  />
           <Column width={"150px"} title={"Latitude"}  field={"lat"}   columnMenu={ColumnMenu} filter="numeric" />
           <Column width={"120px"} title={"Longitude"}  field={"lon"}  columnMenu={ColumnMenu} filter="numeric" />

           <Column width={"120px"} title={"Confidence"}  field={"info.confidence"}  columnMenu={ColumnMenu} filter="numeric"  />

           <Column width={"150px"} title={"Detection Id"} field={"info.roarid"} columnMenu={ColumnMenu} filter="text" />
           <Column width={"150px"} title={"Details"} field={"info.ocrinfo.detection_details"} columnMenu={ColumnMenu} filter="text"  />

           <Column width={"150px"} title={"Status"}  cell={MyCustomCell}  />
       </KendoGrid>
     </div>
    </Fragment>

     )
 }
 componentDidUpdate(){
   console.log("updated")
 }
}
class RoadView extends PureComponent {

  constructor(props) {

    super(props)
    this.state = {
      isLoading: true,playing:false,marking:null,
      job: null,curr:0,items:null,mappings:null,fullgrid:true
    }
    //this.items = this.state.item
    //this.mappings = this.state.mappings
    this.dataMissing = null
    this.getMappings.bind(this)
  }

  render() {

    if (this.state.isLoading) {

      return (<div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>)

    } 
    else if (this.state.marking != null){
        return  ( <Marker image={this.state.marking} done={ this.unsetMarker }></Marker> )
    }    
    else if (this.state.items == null || this.state.items.length == 0) {
      return (
        <React.Fragment>
          <Link to={"/Roads"}><span className={"back"}  >Back</span></Link>
          <span className="roadnum" >Road #{this.props.param.id}</span>

          <div className={"row"}>
              <div className="col s2 offset-s10"></div>

          </div>
        <div className="noresults">No Images found..</div>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Link to={"/Roads"}> <span className={"back"}  >Back</span></Link>
        <SideBar isroad={Number(this.props.param.id)} item={this.workspace} playing={this.state.playing}  play={this.autoPlay.bind(this)}
        next={this.next.bind(this)} prev={this.prev.bind(this)}/>

        <span className="roadnum" >Road #{this.props.param.id}</span>
        <i className="roadfullgrid fa fa-television" style={{color:this.state.fullgrid ? "BLACK" : "#C2C2C2" }}  title="Full Grid"
                      onClick={this.showFullGrid.bind(this)}></i>
        {this.getDownload()}

        {this.getJobRunning()}


        <span className="roadinfo" >Milepoint &nbsp; &nbsp;{ this.state.items[this.state.curr]} </span>

        <div className={"row nopadding"} >
          {this.getImageViewer()}
        </div>
        {
          this.state.items.length > 1 ?
          (<div className={"row"} style={{ marginTop: "10px" }}>
            <Slider curr={this.state.curr} changeState={this.slide.bind(this)} param={this.getSlideParam()}/>
          </div>) : (<Fragment></Fragment>)

        }
        {
          this.state.job != null ?
            (
               <div className={"row nopadding"}> {this.getDetectionView()} </div>

            )
            : (<Fragment></Fragment>)
        }
      </React.Fragment>
    )
  }
  getMap(){
    let data = this.state.items.map( (x) => {
        let q = this.state.mappings[x]
        q = typeof q.Left == "undefined" ? q.left : q.Left
        let lat = !q.lat || q.lat == null || q.lat == -1  ? (q.roadinfo.lat ? q.roadinfo.lat : q.roadinfo.latitude) : q.lat
        let lon = !q.lon || q.lon == null || q.lon == -1 ? ( q.roadinfo.lon ? q.roadinfo.lon : q.roadinfo.longitude) : q.lon
        let processed = Object.keys( this.state.mappings[x])
            .reduce((total,curr)=>{ return total.concat(this.state.mappings[x][curr].processed
                  .filter((h)=> { return h.job == this.state.job })
                    .map((g)=>{ return g.name })) },[] )
	return { lat: lat,lon:lon,mile: x,detections:processed.length > 0 ? processed.join() : "N/A" }})
    if(data.length == 0) return (<Fragment></Fragment>)

    return (  <Map data={data} curr={this.state.curr} key={this.state.job} ></Map>)
  }
  getJobRunning(){
    let self = this
    if(this.state.job != null){
      let job = this.jobs.find((t)=>{ return t.id == self.state.job } )
      if(job.status == 2){
      return ( <div className={"roadrunning lds-facebook"}>
        <div></div>
        <div></div>
        <div></div>
      </div> )
    } else {
        return this.getJobDropdown()
    }}
    return (<Fragment></Fragment>)
  }
  showFullGrid(){
    this.setState(update( this.state,{fullgrid:{$set:!this.state.fullgrid}}))
  }
  getDownload(){
    let self = this
    let items = this.state.items

    let processed = items.reduce((total,curr) =>{
      let images = self.state.mappings[curr]
      let currtotal =  Object.keys( images).reduce((t,c)=>{
        let hasResult = images[c].processed.filter((d)=>{  return d.job == self.state.job })
        return t.concat(hasResult.map((f)=>{
          let q = images[c]
          let lat = !q.lat || q.lat == null || q.lat == -1  ? (q.roadinfo.lat ? q.roadinfo.lat : q.roadinfo.latitude) : q.lat
          let lon = !q.lon || q.lon == null || q.lon == -1 ? ( q.roadinfo.lon ? q.roadinfo.lon : q.roadinfo.longitude) : q.lon

          return  {lat:lat,lon:lon,mile:curr,confidence:f.info.confidence,name:f.name,created:f.created}
        })) },[] )
      return total.concat(currtotal)
    }  ,[] )

    return (<Download data={processed} ></Download> )
  }
  next(){
    let idx = this.state.curr
    if(idx + 1 < this.state.items.length){

    let s = update( this.state,{curr:{$set:(idx +1)}} )

    this.setState(s)
    }
  }
  prev(){
    let idx = this.state.curr
    if(idx - 1 >= 0){

      let s = update( this.state,{curr:{$set:(idx -1 )}} )

      this.setState(s)
    }
  }
  sortImages(a,b){
    if(isNaN(a) && isNaN(b)){
      let transform = (z)=>{
        let q = z.toLowerCase()
        if(q == "left" || q.includes("left") || q.startsWith("l"))
          return 0
        else if(q == "right" || q.includes("right") || q.startsWith("r") )
          return 2
        else return 1
      }
      return transform(a) - transform(b)
    }else {
      return a - b
    }
  }
  getItem( ){
    return this.state.mappings[this.state.items[this.state.curr]]
  }

  slide(curr){
      let n =  Math.ceil( curr  )

      let s = update( this.state,{curr:{$set:n}} )

      this.setState(s)
  }
  getDetectionView() {
    let self = this


    if(!this.state.fullgrid)
    {
      let images = this.getItem()
      let processed = Object.keys( images)
          .reduce((total,curr)=>{ return total.concat(images[curr].processed) },[] )
      let imagemap = Object.keys( images)
          .reduce((total,curr)=>{ return total.concat([{id: images[curr].id,path:images[curr].path}]) },[] )

      let job = this.jobs.find( (f)=>{ return f.id == self.state.job})
      let features = job.param.features
      processed = processed.filter( (q)=>{ return q.job == self.state.job &&
          typeof  features.find((z)=>{ return z.label == q.name
              && z.threshold <= Number(q.info.confidence)*100  }) != "undefined" } )

      return (<DetectionView key = {this.state.curr} imagemap={imagemap}  items={processed}>{this.getMap()}</DetectionView> );
    }

    else
    {

      let items = this.state.items.filter((x,idx)=> { return idx <= this.state.curr })
      let processed = items.reduce((total,curr) =>{
        let images = self.state.mappings[curr]
        let currtotal =  Object.keys( images).reduce((t,c)=>{
          let hasResult = images[c].processed.filter((d)=>{  return d.job == self.state.job })
          return t.concat(hasResult.map((f)=>{
            let q = images[c]
            let lat = !q.lat || q.lat == null || q.lat == -1  ? (q.roadinfo.lat ? q.roadinfo.lat : q.roadinfo.latitude) : q.lat
            let lon = !q.lon || q.lon == null || q.lon == -1 ? ( q.roadinfo.lon ? q.roadinfo.lon : q.roadinfo.longitude) : q.lon
            return Object.assign(f,{lat:lat,lon:lon,mile:curr})
          })) },[] )
        return total.concat(currtotal)
      }  ,[] )

      return ( <FullGrid key={this.state.curr} processed={processed} gotoMile={this.gotoMile.bind(this)}></FullGrid>

       )
    }
  }
  gotoMile(event){
     let item = event.dataItem
     let newcurr =  this.state.items.indexOf(item.mile)
     let newstate = update(this.state,{curr: {$set: newcurr}})
     this.setState(newstate)
  }
  autoPlay(){
    let self = this
    let checked = this.state.playing;

    if(!checked){


        this.timer = d3.interval(()=> {
          let loading = 0
          document.querySelectorAll("img").forEach((x,y)=>{ loading += x.complete ? 0 :1    } )
          if( loading > 0) return
          let idx =  self.state.curr
          if(idx +1 < self.state.items.length )
          self.setState(update(self.state, {curr: {$set:idx+1} }))
          else{
            self.timer.stop()
            delete self.timer
            self.setState(update(self.state,{playing:{$set:false}}))
          }
        },3000);
      this.setState(update(this.state,{playing:{$set:true}}))
    }else{

      this.timer.stop()
      delete this.timer
      this.setState(update(this.state,{playing:{$set:false}}))
    }
  }
  initMaterial(){
  //  let elems = document.getElementById('jobselect')
  //  Materialize.FormSelect.init(elems, {})
  }
  handleSelect = (e) => {
    let newstate = update(this.state,{ job:{$set : e.target.value.id}})
    this.setState(newstate)
  }
  getJobDropdown(){
    if(!settings.showjobdropdown)
      return (<Fragment></Fragment>)
    let data = this.jobs.map( (d,i)=>{ return {id:d.id,text:
        d.param.model.name+" | "+(d.param.features.length == 1 ? d.param.features[0].label : d.param.features.length)+" features"}
      })
    let current = data.find((t)=>{ return t.id == this.state.job})
    return (


        <DropDownList className="jobselect" defaultValue={current}  onChange={this.handleSelect.bind(this)}
          textField="text" dataItemKey="id" data={data}
            />



    )
  }

  getImageViewer() {
    let self = this
    let images = this.getItem()
    let job = this.jobs.find( (f)=>{ return f.id == self.state.job})
    let features = job.param.features
    images =  Object.keys(images).sort(this.sortImages)
      .map((dir)=>{
      let image = images[dir]
      let newItems = image.processed
      let isProcessed = this.state.job != null
      let hasResult = newItems.filter( (q)=>{ return q.job == self.state.job &&
          typeof  features.find((z)=>{ return z.label == q.name
              && z.threshold <= Number(q.info.confidence)*100  }) != "undefined" } )

      return { id:image.id,path:image.path,processed:hasResult,markings:image.roadinfo.markings ||  []}
      /*let old = image.path
      let newItems = image.processed
      let isProcessed = this.state.job != null
      let hasResult = newItems.filter((d)=>{  return d.job == self.state.job })
      if(!settings.showjobdropdown && hasResult.length == 0 && isProcessed  && newItems.length > 0 ){
        hasResult = [newItems.sort((a,b)=>{ return b.job - a.job } )[0]]
      }

      return { curr: isProcessed && hasResult.length != 0?   hasResult[0].info.imagepath : old,
          old:old,type:isProcessed && hasResult.length != 0?   "curr" : "old"}
      */
    })

    images = Object.keys(images).map( (dir,idx) => {

        let im =  images[dir]
        return (<ImageViewer mark={this.setMarker.bind(this)} key={im.id} 
           height={"400px"} src={im}/>)
    })

    //console.log(images)
    return images;
  }
 unsetMarker(){
    let  newstate = update( this.state,{
        marking:{$set : null}
     })

     this.setState(newstate)   
 }     
 setMarker(im){
     
     let newstate = update( this.state,{
        marking:{$set : im}
     })

     this.setState(newstate)
     
  }    
  getSlideParam() {
    let width = document.querySelector(".app_content").clientWidth

    return  {


      width:width,height:20,start:0,
      end:this.state.items.length-1 ,
      count:this.state.items.length
    }
  }
  loadData(){
    let id = this.props.param.id
    let self = this

    $.ajax({
      url: settings.baseurl + "/io/getroadimages/?road=" + id , type: "GET"
    }).done((images)=>{
      if(images.length == 0){

        self.setState(update(self.state,{ isLoading:{$set:false}}))
        return false
      }
      let {mappings,items,dataMissing} = self.getMappings(images)
      //self.mappings = mappings
     // self.items = items

      self.dataMissing = dataMissing

      let workspace_id = images[0].workspace

        let d0 = $.ajax({
            url: settings.baseurl + "/data/workspaces/" + workspace_id+"/", type: "GET"
          })
          let d1 = $.ajax({
            url: settings.baseurl + "/data/jobs/?workspace=" + workspace_id, type: "GET"
          })
        $.when(d0, d1 ).done((v0, v1 ) => {
            self.workspace = v0[0]
            self.jobs = v1[0].filter( (t)=> { return t.type==5 || t.type == 7})
				.sort( (p,q) => { return p.id - q.id })


            let job = self.jobs.length > 0 ? self.jobs[self.jobs.length - 1].id : null
            let s = update(self.state,{
              mappings:{$set:mappings},
	            items:{$set:items},
              job:{$set:job},isLoading:{$set:false},
              curr:{$set:items.length - 1}
            })
            self.setState(s)
        })
    })
  }
  componentDidMount() {
    let self = this
    this.props.bus.on("job-update",(job)=>{
	if( job.id == self.state.job || job.status==1 && job.road == this.props.param.id)
		self.loadData()} ) //this.loadData.bind(this))
    this.loadData()

  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.initMaterial()

  }
  componentWillUnmount(){
    this.props.bus.off("job-update")
  }
  getMappings (images){
    let dataMissing = true
     let getName = (p)=>{
        let aname = p.path.split("/")
        return  aname[aname.length -1].split(".")[0] }
    let getMile = (p)=>{ return p.roadinfo.milepoint }

    let mappings = images.reduce( (total,currentValue)=>{
        let key = getMile(currentValue)
        if(typeof  key == "undefined")
          key = getName(currentValue)

        let found = total[key]
        if(typeof found == "undefined"){
          found = {}
          total[key] = found

        }
        let dir = currentValue.roadinfo.direction

        let count = Object.keys(found).length
        if(typeof dir != "undefined")
          found[dir] = currentValue
        else found[count] = currentValue

        return total
    },{})
    if(Object.keys(mappings).length > Math.ceil(images.length/2))
    {
      mappings = images.reduce((total,current,idx,arr)=>{

        if(idx%3 == 0){
          total.push([current ] )

        }else{
          total[total.length -1].push(current)
        }

        return total
      },[] )

    }
    else if(isNaN(Object.keys(mappings)[0]))
    {
         mappings = Object.keys(mappings).map( (q)=>{ return mappings[q] })
    }
    else dataMissing = false
    let items = Object.keys(mappings).map((z)=>{return Number(z)})
          .sort((a, b)=>{
         return a-b
    })

    return {items:items,mappings:mappings,dataMissing }
  }
}
RoadView.propTypes = {
  changeState: PropTypes.func,
  param:PropTypes.object
};
let returnObj = RoadView
returnObj = withBus()( returnObj )
export default withRouter(returnObj);
