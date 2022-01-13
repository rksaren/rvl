import settings from "./settings"
 
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
 
import * as d3 from "d3";
 
class ImageViewer extends PureComponent{
  constructor(props){
   
   
    super(props)
    
    this.state = {
             
    }
    this.container = React.createRef();
    //this.originalWidth = 2000;
    //this.originalHeight = 2000;
  }
  
  render (){
  
    return (  <div  ref={this.container} className={"col "+ this.props.sm} > </div>   )
  }
 componentDidMount() {
   this.width = this.container.current.clientWidth;

   let self = this 
  
   let width = this.width;
   let height = (this.props.originalheight*this.width)/this.props.originalwidth;
    
   let svg = d3.select(this.container.current)
        .append("svg")
        .attr("width",width)
        .attr("height",this.props.height);

   let zoomed = ()=> {
          const currentTransform = d3.event.transform;
          container.attr("transform", currentTransform);
          if(self.timer != null) clearTimeout(self.timer);
          self.timer = setTimeout(()=>{ self.props.adjustImage(self.props.dir,currentTransform); }, 5000);   
            
    }
  
     
  
    let  zoom = d3.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed);
     
     
    svg =  svg .append("g")    
     
      .call(zoom);
    let rect = svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");
   
    let container = svg.append("g")
    if(this.props.adjust != null)
    {
    	 let adjust = this.props.adjust;
    	    adjust = adjust.split(":");
    	container .attr("transform", "translate(" + adjust[0] + "," + adjust[1] + ")"); 
    }	
     
    
    
    container.append("image")
    .attr("width",  width + "px")
    .attr("height", this.props.height + "px")
    .attr("viewBox", (d,i)=>{
					
		return [0, 0, width, this.props.height]
	})
	.attr( "preserveAspectRatio","none")
    .attr("xlink:href",  this.props.src.path);


 }
}
ImageViewer.propTypes = {
  changeState: PropTypes.func,
  src:PropTypes.object,
  height:PropTypes.number
};


export default ImageViewer;
