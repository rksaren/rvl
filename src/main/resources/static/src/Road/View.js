import React, { Fragment, PureComponent } from "react";
import ImageViewer from "../ImageViewer";
import Slider from "../Slider";
 
import PropTypes from "prop-types";
import settings from "../settings"
import update from "immutability-helper"
import $ from "jquery";
import SideBar from "../SideBar"
import { withRouter,Link } from 'react-router-dom';
 
import * as d3 from "d3";
import { Provider, withBus } from 'react-bus'
import Map from "../Map"
 

class RoadView extends PureComponent {

  constructor(props) {

    super(props)
    this.state = {
      isLoading: true,playing:false, curr:0,items:null
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
        <SideBar  playing={this.state.playing}  play={this.autoPlay.bind(this)}  next={this.next.bind(this)} prev={this.prev.bind(this)}/>

        <span className="roadnum" >Road #{this.props.param.id}</span>
       

      
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
         <div className={"row nopadding"} >
           <div className="col s12">
            {
              this.getMap()
            }
          </div>
         </div>
      </React.Fragment>
    )
  }
  getMap(){
    let data = this.state.items.map( (x) => {
        let q = this.state.mappings[x]
        
       
        
	return { lat: q.position.lat,lng:q.position.lon,mile: x }})
    if(data.length == 0) return (<Fragment></Fragment>)

    return (  <Map data={data} curr={this.state.curr}  ></Map>)
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
   
   

  slide(curr){
      let n =  Math.ceil( curr  )

      let s = update( this.state,{curr:{$set:n}} )

      this.setState(s)
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
          //document.querySelectorAll("img").forEach((x,y)=>{ loading += x.complete ? 0 :1    } )
          //if( loading > 0) return
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
 
   

  getImageViewer() {
    let self = this
    let milepoint = this.state.items[this.state.curr]
    let entry = this.state.mappings[milepoint];
    console.log(entry.images);
    let sm = 12/entry.images.length;
    return entry.images.map( (im) => {

         
        return (<ImageViewer adjust={this.state[im.adjust]}  
        		key={im.id} 
        		adjustImage={this.adjustImage.bind(this)}
           		height={"400px"} src={im} dir= {im.dir}
        		originalwidth = {this.metadata.originalwidth}
        		originalheight = {this.metadata.originalheight}
        		sm = {"sm-"+sm}
        />)
    })

     
  }
  
  getSlideParam() {
    let width = document.querySelector(".app_content").clientWidth

    return  {


      width:width,height:20,start:0,
      end:this.state.items.length-1 ,
      count:this.state.items.length
    }
  }
  adjustImage(dir,transform){
      
      let property = "";
      let value = transform.x+":"+transform.y;
      if(dir == "L") property="leftImageAdj";
      else if(dir == "M") property="centerImageAdj";
      else property="rightImageAdj";
      let newstate  = {}
      newstate[property] = value
      this.setState(newstate)

  }
  loadData(){
    let id = this.props.param.id
    let self = this

    $.ajax({
      url: settings.baseurl + "/rest/services/getcurrentyearDvldataset/" + id , type: "GET"
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

              let obj =  { id: entry.id,images:mimages,position:{lat:entry.latitude,lon:entry.longitude}};
              total[entry.milepoint] = obj;
              
              return total;
            }
           
          ,{});
            
         

            self.setState({isLoading:false,curr:0,items:items,mappings:mappings,leftImageAdj:self.metadata.leftImageAdj,
              centerImageAdj:self.metadata.centerImageAdj,rightImageAdj:self.metadata.rightImageAdj,noOfImages:self.noOfImages})
        
    })
  }
  componentDidMount() {
     
    this.loadData()

  }
   
}
RoadView.propTypes = {
  changeState: PropTypes.func,
  param:PropTypes.object
};
let returnObj = RoadView
returnObj = withBus()( returnObj )
export default withRouter(returnObj);
