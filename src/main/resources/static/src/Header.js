import React, { PureComponent, Fragment } from "react";
import $ from "jquery";
import { withRouter, Link } from "react-router-dom";
import RoadSearch from "./RoadSearch";
class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.sidebar = React.createRef();
  }
  setRoad(rdway_id, mile) {
    this.props.history.push({ pathname: "/Roads/" + rdway_id+"/"+mile });
  }
  render() {
    return (
      <Fragment>
        <div className="header">
          <div className="menu" >
            
          </div>
          <div className="logo">
            <span className="rtr-s-Text_1_0">R</span>
            <span className="rtr-s-Text_1_1">
              <i className="fa fa-camera"></i>
            </span>
            <span className="rtr-s-Text_1_2">VL</span>
          </div>
          <div className="roadSearch">
            <RoadSearch setRoad={this.setRoad.bind(this)}>
              <span class="k-icon k-i-loading"></span>
            </RoadSearch>
          </div>
        </div>
       
      </Fragment>
    );
  }
}
export default withRouter(Header);
