import React, { PureComponent, Fragment } from "react";
import $ from "jquery";
import { withRouter, Link } from "react-router-dom";
import RoadSearch from "./RoadSearch";
class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.sidebar = React.createRef();
  }
  setRoad(rdway_id) {
    this.props.history.push({ pathname: "/Roads/" + rdway_id });
  }
  handleMenuClick(event) {
    let dom = $(this.sidebar.current);
    dom.toggleClass("slidein");
  }
  render() {
    return (
      <Fragment>
        <div className="header">
          <div className="menu" onClick={this.handleMenuClick}>
            <i className="fa fa-bars"></i>
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
        <div className="left_menu outer" ref={this.sidebar}>
          <div className="menu_box">
            <div className="top_menu" onClick={this.handleMenuClick}>
              <i className="fa fa-bars"></i>
            </div>
          </div>
          <div className="menu_box" title={"Road Video"}>
            <div className="valign">
              <Link to={"/Roads"} onClick={this.handleMenuClick}>
                <i className="fa fa-road"></i>
              </Link>
            </div>
          </div>
          <div className="menu_box" title={"Query Builder"}>
            <div className="valign">
              <Link to={"/Query"} onClick={this.handleMenuClick}>
                <i className="fa fa-database"></i>
              </Link>
            </div>
          </div>
          <div className="menu_box" title={"Admin"}>
            <div className="valign">
              <Link to={"/Admin"} onClick={this.handleMenuClick}>
                <i className="fa fa-gear"></i>
              </Link>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default withRouter(Header);
