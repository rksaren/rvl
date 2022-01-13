import React from 'react';
import ReactDOM from 'react-dom';
import { AutoComplete } from '@progress/kendo-react-dropdowns';
import settings from "./settings";

class RoadSearch extends React.PureComponent {
	constructor(props){
     super(props) 
	 this. init = { method: 'GET', accept: 'application/json', headers: {} };
	 this.state = { data: [], value: '', loading: false,"opened":false,valueid:null, mile:null };
 }
 
  

  onChange(event) {
    const value = event.target.value;
    if(value.length < 5)
    {
    	let state = {...this.state,value:value,opened:false }
    	
    	this.setState(state)
    }
    else
    {
    	
    	const eventType = event.nativeEvent.type;
        const nativeEvent = event.nativeEvent;
        const valueSelected = eventType === 'click' || eventType === 'keydown' && nativeEvent.keyCode === 13;

        let found = this.state.data.find((x)=>{  return x.roadno == value})
        if (valueSelected && found )
    	{
        	 
        	this.setState({value:value,loading:false,opened:false,valueid:found.rdway_id,mile:found.begmp },
        		()=>{
        			this.props.setRoad(this.state.valueid,this.state.mile)
        	})
           
        }
        else
        {
        	let url =settings.baseurl+"/rest/services/getroads?search="+value
    	    this.setState({
    	      loading: true
    	    },()=>{
    	    	fetch(url, this.init)
      	      	.then(response => response.json())
      	      	.then(json => {
      	      		this.setState({value:value,loading:false,opened:true, data: json});
      	      	});
    	    })
        }	
    	
    	    
    }	
   


  }
  render() {
    return (
      <AutoComplete
        placeholder={"Search Road"}
        loading={this.state.loading}
        data={this.state.data}
        value={this.state.value}
        onChange={this.onChange.bind(this)}
        textField='roadno' opened={this.state.opened}
      />
    );
  }
}

export default RoadSearch;

