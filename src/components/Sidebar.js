import React from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import routes from "../constants/routes";
const { SubMenu } = Menu;
import { IMAGE } from "../assets/index";

class Sider extends React.Component {
  handleClick = e => {
    //console.log("click ", e);
  };

  render() {
    return (
      <React.Fragment>
        <Menu
          onClick={this.handleClick}
          style={{ width: 200, height: "100%", position: "absolute" }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          <img src={IMAGE} width={175} style={{ padding: 20 }} />
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="setting" />
                <span>Menu</span>
              </span>
            }
          >
            <Menu.Item key="1">
              <Link to={routes.HOME}>Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to={routes.EVENTPAGE}>Order Create</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to={routes.ORDERLISTPAGE}>Order List</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to={routes.DRAFTLISTPAGE}>Draft List</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to={routes.ITEMLISTPAGE}>Item List</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to={routes.CUSTOMERLISTPAGE}>Customer List</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to={routes.TARGETLISTPAGE}>Financial Statistics</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </React.Fragment>
    );
  }
}

export default Sider;
