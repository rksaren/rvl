import React, { PureComponent,Fragment   } from 'react';
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
        this.addressbar = React.createRef();
        this.addressbarbox = React.createRef();
        this.clearsearch = React.createRef();
        this.map = React.createRef();
        this.info = React.createRef();
        this.searched = false
        this.width = null
    }
    resetSearch()
    {
    	if(this.searched)
        {
        	this.searched = false
        	this.addressbar.current.value = "";
        	this.clearsearch.current.style.opacity = 0
        	this.map.current.map.setCenter(this.props.data[this.props.curr])
        }	
    	
    }
    initMapSearch()
    {
    	let map = this.map.current.map
        let google = this.props.google
        let button = this.clearsearch.current
        let info = this.info.current
        
       
        
        button.addEventListener('click', this.resetSearch.bind(this));
        const options = {
      		  
      		  componentRestrictions: { country: "us" },
      		  fields: ["address_components", "geometry", "icon", "name"],
      		  strictBounds: false,
      		  types: ["address"],
        }
    	const marker = new google.maps.Marker({
    	    map,
    	    anchorPoint: new google.maps.Point(0, -29),
    	});
    	marker.setVisible(false);
    	const infowindow = new google.maps.InfoWindow();
    	google.maps.event.addListener(infowindow,'closeclick',()=>{
    		 marker.setVisible(false);
    		 this.resetSearch()
    	}); 

    	infowindow.setContent(info);
    	
    	map.addListener("click", (mapsMouseEvent) => {
             // Close the current InfoWindow.
    		infowindow.close();
    		marker.setVisible(false);
    		marker.setPosition(mapsMouseEvent.latLng);
      	    marker.setVisible(true); 
      	    let latlng = mapsMouseEvent.latLng.toJSON()
      	  $.ajax({
      	      url: settings.baseurl 
      	      + "/rest/services/locatepoint?lat=" + latlng.lat+"&lng="+latlng.lng 
      	      , type: "GET"
      	    }).done((roads)=>{
      	    	if(roads.length == 0)
      	    	{
      	    		 info.children["place-address"].textContent ="No Road found.." 
      	    	}
      	    	else
      	    	{
      	    		let html = "<ul>"
      	      	    for (var i = 0; i < roads.length; i++)
      	      	    {
      					html += "<li><a href='/Roads/"+roads[i].rdway_id+"/"+roads[i].begmp+"'>"+roads[i].roadno+" at mile "+roads[i].begmp+"</a></li>" 
      				}
      	      	    html += "</ul>"
      	      	    info.children["place-address"].innerHTML = html	
      	    	}	
      	    	
      	    })
      	   //JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2) ;
            infowindow.open(map,marker);
        });
    	
    	
        const autocomplete = new google.maps.places.Autocomplete(this.addressbar.current,options)
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.addressbarbox.current)
        autocomplete.addListener("place_changed", () => {
      	    infowindow.close();
      	    marker.setVisible(false);
      	    button.style.opacity = 1
      	    const place = autocomplete.getPlace();

      	    if (!place.geometry || !place.geometry.location) {
      	      // User entered the name of a Place that was not suggested and
      	      // pressed the Enter key, or the Place Details request failed.
      	      window.alert("No details available for input: '" + place.name + "'");
      	      return;
      	    }

      	    // If the place has a geometry, then present it on a map.
      	    if (place.geometry.viewport) {
      	      map.fitBounds(place.geometry.viewport);
      	    } else {
      	      map.setCenter(place.geometry.location);
      	      map.setZoom(17);
      	    }
      	  
      	    marker.setPosition(place.geometry.location);
      	    marker.setVisible(true);
      	    this.info.current.children["place-name"].textContent = place.name;
      	    this.info.current.children["place-address"].textContent = place.formatted_address;
      	    infowindow.open(map, marker)
      	    this.searched = true
      	  });
    }
    componentDidMount()
    {
      let self = this
      
      this.initMapSearch()
    }

    handleMapLoad(map, view) {
         this.view = view
         this.map = map
    }
    componentDidUpdate(){
    	let map = this.map.current.map
        let google = this.props.google
        this.resetSearch()
      
    }
    render() {
    	
    
      const mapStyles = {
    		  
        position: 'relative', 
        width: '100%',
        height: '300px',
      };
    const styleBox = {"opacity": 0,"float": "right","position": "relative","top": "12px","transition": "opacity 0.2s linear"}
      return (
    	<Fragment>
    		<span ref={this.addressbarbox}>
        		<input style={{"width":"300px","backgroundColor":"WHITE","margin":"10px"}}
        				ref={this.addressbar} type="text" placeholder="Enter An Address" />	 
        		<a className="waves-effect waves-light btn" ref={this.clearsearch} style={styleBox}>Clear</a>					
        	</span>		
	        <Map ref={this.map}
	          google={this.props.google}
	          zoom={16}
	          containerStyle={mapStyles}
	          initialCenter={this.props.data[this.props.curr]}   >
	          <Polyline   path={this.props.data}   options={{ 
	                strokeColor: '#00ffff',
	                strokeOpacity: 1,
	                strokeWeight: 2,
	                 
	            }}
	          />
	          <Marker key={this.props.curr}  icon={{url:car,scaledSize:{width:20,height:20}}}  
	          							position={this.props.data[this.props.curr] } ></Marker>
	        </Map>
	        <div ref={this.info}>
		        <span id="place-name" className="title"></span><br />
		        <span id="place-address"></span>
		    </div>
        </Fragment>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCZhWRDdjALYZ9da8hOL0LND2BJfOhzL0E'
})(RoarMap);
