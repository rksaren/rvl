import React from 'react';
import {
    Grid, GridColumn as Column
} from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
export default class KendoGrid extends React.Component {
  constructor(props){
    super(props)
    this.state = this.createDataState(this.props.initstate)	
    this.gridconfig = this.props.initstate   
  }
  refresh(){
 	this.setState( this.createDataState(this.gridconfig), this.grid.forceUpdate.bind(this) )      
	//if(typeof this.grid != "undefined") this.grid.forceUpdate()
  }
   
  componentDidUpdate(){
    //  this.setState( this.createDataState(this.gridconfig)	)
  	
  }
  render() {
       let self = this
        return (
          <Grid ref={ (grid)=>{self.grid = grid  } }
                 style={this.props.style}
                 scrollable={this.props.scrollable}
                 data={this.state.result}
                 {...this.state.dataState}
                 onDataStateChange={this.dataStateChange}
                 sortable={true}
		 onSelectionChange={this.props.onSelectionChange}
                 onHeaderSelectionChange={this.props.onHeaderSelectionChange} 
                 onRowClick={this.props.onRowClick}
		 selectedField={this.props.selectedField}
                 pageable={{
                            buttonCount: 3,
                            info: false,
                            type: 'numeric',
                            pageSizes: false,
                            previousNext: false}
                 }
                 pageSize={this.props.pagesize}
             >
                { this.props.children}
            </Grid>
        )
    }
    createDataState(dataState) {
       return {
           result: process(this.props.data.slice(0), dataState),
           dataState: dataState
       };
   }
   dataStateChange = (event) => {
       this.gridconfig = event.data
       this.setState(this.createDataState(event.data));
   }
}
