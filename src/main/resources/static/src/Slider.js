import React, { Fragment,PureComponent,Component } from "react";
import PropTypes from "prop-types";
import update, { extend } from 'immutability-helper';
import * as d3 from "d3";
import {event as currentEvent} from 'd3-selection';

class Slider extends Component{
  constructor(props){

    super(props)

    this.state= {
      curr:null
    }
    this.playing = false
    this.overlay = React.createRef()
    this.x = d3.scaleLinear()
      .domain([ this.props.param.start ,  this.props.param.end ])
      .range([0, this.props.param.width-40])
      .clamp(true)


  }
  static getDerivedStateFromProps(props, current_state) {
    if (current_state.curr !== props.curr) {
      return update( current_state , {curr:{$set:props.curr}})
    }
    return null
  }
  render() {
    const margin = {
      left:10,right:10
    }

    return (

      <svg width={this.props.param.width} height={this.props.param.height} pointerEvents={"all"}
            viewBox={"0 0 "+this.props.param.width+" "+this.props.param.height}>
            <defs>
                <pattern id={"hatched"} width={4} height={4} patternUnits={"userSpaceOnUse"}>
                    <path d={"M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"}  strokeWidth={1} stroke={"black"} >
                    </path>
                </pattern>
            </defs>
            <g className={"slider"} transform={"translate("+margin.left+","+this.props.param.height/4+")"}>
              <line className={"track"} x1={this.x.range()[0]} x2={this.x.range()[1]}
                    fill={"url(#hatched)"}>

              </line>
              <line className={"track-inset"}  x1={this.x.range()[0]} x2={this.x(this.state.curr)}    >

              </line>
              <circle  className={"handle"} r={5} fill={"green"} cx={this.x(this.state.curr)}  >

              </circle>
              <line className={"track-overlay"}  x1={this.x.range()[0]} x2={this.x.range()[1]} ref={this.overlay} >

              </line>
            <g className={"ticks"} transform={"translate(0,14)"} style={{fontSize:"75%",color:"#666666"}}>
              { this.x.ticks(this.props.param.count).map( (p,idx)=> (<text key={idx} x={this.x(p)} textAnchor={"middle"}>|</text> ) ) }

            </g>

            </g>
      </svg>

    )
  }
  handleFunc(curr){
    if(curr < this.props.param.end)
    {
      this.props.changeState(curr)
      //this.setState({curr:curr})
    }
    else {
      if(this.playing) this.playing = !this.playing
    }
  }

  componentDidMount() {
    let self = this;

    d3.select(this.overlay.current).call(d3.drag().on("drag",()=>{

          self.handleFunc(self.x.invert(currentEvent.x))
    }))/**/
   // this.autoPlay()
  }
}
Slider.propTypes = {
  changeState: PropTypes.func,
  curr:PropTypes.number,
  param:PropTypes.object
};
export default Slider;
