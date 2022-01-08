import React, { PureComponent } from "react";
 
class Workspace extends PureComponent{

  constructor(props){
    super(props)
    let id = this.props.match.params.id
    this.state = {
      currentComponent : typeof id == "undefined" ?"List":"View",
      param : typeof id == "undefined" ? {} :{id:id}
    }
  }
  changeState (comp,param){
    this.setState({currentComponent:comp,param:param});
  }

  getComponent (){
    let component;
  /*  switch (this.state.currentComponent){
      case 'List' :
        component = <List changeState={this.changeState.bind(this)} param={this.state.param}/>;
        break;
      case 'View' :
        component = <View changeState={this.changeState.bind(this)} param={this.state.param} />;
    }*/
    return component;
  }
  render() {
    return (
      <div className={'app_content'}>

       	<h1>To Do</h1>
      </div>

    )
  }

}

export default  Workspace;