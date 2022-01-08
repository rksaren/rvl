import React, { PureComponent } from "react";

import List from "./List";
import View from "./View"
class Workspace extends PureComponent{

  constructor(props){
    super(props)
    let id = this.props.match.params.id
    this.state = {
      currentComponent : typeof id == "undefined" ?"List":"View"
      
    }
  }
  changeState (comp,param){
    this.setState({currentComponent:comp,param:param});
  }

  getComponent (){
    let component = null;
    let id = this.props.match.params.id
    let param =  typeof id == "undefined" ? {} :{id:id}
    switch (this.state.currentComponent){
      case 'List' :
        component = <List changeState={this.changeState.bind(this)} param={param}/>;
        break;
      case 'View' :
        component = <View key={id} changeState={this.changeState.bind(this)} param={param} />;
    }
    return component;
  }
  render() {
    return (
      <div className={'app_content'}>

        {this.getComponent()}
      </div>

    )
  }

}

export default  Workspace;