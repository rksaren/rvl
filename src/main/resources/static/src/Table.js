import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import React, {Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import {getImage} from "./helper"
import settings from "./settings"

class Preview extends PureComponent{

  constructor(props){
    super(props)
    this.state  = {}
    this.canvas = React.createRef()
  }
  getOCR(){
    let ocrinfo = this.props.selected.item.info.ocrinfo
    let ocrinfoDFC = this.props.selected.item.info.ocrinfo.DFC_meters.toFixed(2);
    if(!ocrinfo || Object.keys(ocrinfo).length === 0)
        return (<Fragment></Fragment>)
    let color = "rgb("+ocrinfo.c1_avg_color[0]+","+ocrinfo.c1_avg_color[1]+","+ocrinfo.c1_avg_color[2]+",1)"
    return (
        <ul style={ {"display":"inline-block","marginLeft":"10px"}} className="collection">
            <li className="collection-item"><b>Camera Distance</b> {ocrinfoDFC}mt</li>
            <li className="collection-item"><b>Text</b> {ocrinfo.text}</li>
            <li className="collection-item"><b>Detection ID</b> {this.props.selected.item.info.roarid}</li>
            <li className="collection-item"><b>Feature direction</b> {this.props.selected.item.info.ocrinfo.featuredirection}</li>
            <li className="collection-item"><b>Detection details</b> {ocrinfo.detection_details}</li>
            
         </ul>
    )

  }
  render(){
    if(this.props.selected == null)
      return (<Fragment></Fragment>)

    return (
          <div className={"card"} style={{width:"590px",height:"400px",float:"left"}}>
            <div className={"card-content"} >
            <canvas ref={this.canvas} ></canvas>
            {this.getOCR()}
            <i className={"fa fa-close"}
              style={ {position:"absolute",right:"5px",top:"5px",cursor:"pointer"} }
              onClick={this.props.closeView} />
            </div>
          </div>
    )
  }
  componentDidMount(){
    this.loadCanvasData()
  }
  componentDidUpdate(){
    this.loadCanvasData()
  }
  loadCanvasData(){
    if(this.props.selected != null)
    {
      let item = this.props.selected.item
      let img =  this.props.selected.img
      //let canvas = this.canvas.current
      const fabric = window.fabric
      const width = 150
      const canvas = new fabric.StaticCanvas(this.canvas.current)
      const url =  settings.images+"/"+img.path
      fabric.Image.fromURL(url, function(img) {
        let realwidth = img.naturalWidth || img.width;
        let realheight = img.naturalHeight || img.height;
        let x = item.info.centerx*realwidth
        let y = item.info.centery*realheight
        let w = item.info.width*realwidth
        let h = item.info.height*realheight
        let ow = w
        let oh = h
        let ox = x - w/2
        let oy = y - h/2
        let curl = img.toDataURL({left:ox,top:oy,width:ow,height:oh  })

        let cropedImage = fabric.Image.fromURL(curl, (cimg )=>{
                //let cwidth =cimg.naturalWidth || cimg.width
                //cimg.set( { scaleX:cwidth/width });
                //cimg.set)
                canvas.setWidth( cimg.width)
                canvas.setHeight( cimg.height)
                canvas.setBackgroundImage(cimg)
                canvas.renderAll()
            })
        },{ crossOrigin: 'anonymous' });
      /*
      let ctx =canvas.getContext("2d")
      let url =item.info.imagepath
      let needWork = url.indexOf("_proc") == -1
      if(needWork){
      let q = url.split(".")
      q.pop()
      url = q.join(".") +"_proc.jpg"
      }
      let img = document.querySelector("img[src*='"+url+"']")
      if(img == null  || !img.complete) {
        this.props.closeView()
        return
      }
      let realwidth = img.naturalWidth
      let realheight = img.naturalHeight
      let x = item.info.centerx*realwidth
      let y = item.info.centery*realheight
      let w = item.info.width*realwidth
      let h = item.info.height*realheight
      let ow = w
      let oh = h
      let ox = x - w/2
      let oy = y - h/2
      let xmax = 600 - 24*2
      let ymax = 400 -24*2
      if(w > xmax){
        h = h*(xmax/w)
        w = xmax

      }
     if(h > ymax){
        w = w*(ymax/h)
        h = ymax

     }
     canvas.width = w
     canvas.height = h
     ctx.drawImage(img,ox,oy,ow,oh,0,0,w,h);
     */
    }
  }
}
Preview.propTypes={
  closeView : PropTypes.func,
  selected:PropTypes.object
}
class DetectionView extends PureComponent{

  constructor(props){
    super(props)

    this.state = {selected:null}
    //this.selectFeature.bind(this)
    //this.closeFeature.bind(this)

  }

  selectFeature(event){
    let item = event.dataItem
    let img = this.props.imagemap.find((x)=>{ return x.id == item.image })
    this.setState({selected:{item:item,img:img}})
  }
  closeFeature(){
    this.setState({ selected:null})
  }
  render() { //<div className="col s12 m7"></div>    <div className="col s12 m5"></div>

    return(
      <Fragment>


        <Grid   data={this.props.items} scrollable={"scrollable"} onRowClick={this.selectFeature.bind(this)}
               style={this.state.selected != null ? {display:"none"}:{height:"400px",width:"750px",float:"left"}}  >
          <Column width={"150px"} title={"Feature name"} field={"name"} />
          <Column width={"150px"} title={"Feature direction"} field={"info.ocrinfo.featuredirection"} />
          <Column width={"150px"} title={"Confidence"}  field={"info.confidence"} />
          <Column width={"150px"} title={"Detection id"} field={"info.roarid"} />
          <Column width={"150px"} title={"Camera Distance"} field={"status"} cell={ (props)=>{
                    let d = props.dataItem
                    return (<td> <span >{
                    d.info.ocrinfo ? d.info.ocrinfo.DFC_meters.toFixed(2)
                  : "N/A"}</span> </td>)

            }} />

        </Grid>

        <Preview key={  this.state.selected == null ? 0 :this.state.selected.item.id }
                closeView={this.closeFeature.bind(this)} selected={this.state.selected}/>

        {this.props.children}

      </Fragment>
    )
  }
}
DetectionView.propTypes={
  imagemap:PropTypes.array,
  items:PropTypes.array
}
export default  DetectionView
