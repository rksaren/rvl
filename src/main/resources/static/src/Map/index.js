import React, { PureComponent   } from 'react';
import settings from "../settings";
import $ from 'jquery';
//import Layer from "./layer";
//import { Map  } from '@esri/react-arcgis';
import { Map, GoogleApiWrapper, Marker,Polyline   } from 'google-maps-react';
import car from "../car.svg";

class RoarMap extends PureComponent {

    constructor(props) {
        super(props);
      /*  this.state = {
            curr:this.props.curr,
            data:this.props.data
         };*/
        this.eventbus = this.props.eventbus;
        this.width = null
    }

    componentDidMount() {
      let self = this

    }

    handleMapLoad(map, view) {
         this.view = view
         this.map = map
    }
    render() {
      const mapStyles = {
        width: '100%',
        height: '100%',
      };
     // let Marker = (props) =>{ return (<i className="fas fa-car"></i> ) }
      return (
        <Map
          google={this.props.google}
          zoom={16}
          style={mapStyles}
          initialCenter={this.props.data[this.props.curr]}
        >
          <Polyline   path={this.props.data}   options={{ 
                strokeColor: '#00ffff',
                strokeOpacity: 1,
                strokeWeight: 2,
                 
            }}
          />
          <Marker key={this.props.curr}  icon={{url:car,scaledSize:{width:12,height:12}}}  position={this.props.data[this.props.curr] } ></Marker>
        </Map>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCZhWRDdjALYZ9da8hOL0LND2BJfOhzL0E'
})(RoarMap);
