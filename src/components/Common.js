import React, { Component } from "react";
import { Link } from "react-router-dom";
import routes from "../constants/routes";
import {
  DatePicker,
  Button,
  Card,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Icon,
  Menu,
  Dropdown
} from "antd";

const WrappedLink = props => {
  const routerPath = props.routerPath;
  return (
    <React.Fragment>
      <Button type="primary" block>
        <Link style={{ display: "block", height: "100%" }} to={routerPath}>
          Next
        </Link>
      </Button>
    </React.Fragment>
  );
};

const ColumnButton = props => {
  const title = props.title;
  const type = props.type;
  const id = props.id;
  const record = props.record;
  const isDisabled = parseInt(record.balance_amount, 10) === 0;
  const handleClick = props.handleClick;
  return (
    <React.Fragment>
      <span>
        <Button
          id={id}
          disabled={isDisabled}
          type={type}
          onClick={e => handleClick(record, e)}
        >
          {title}
        </Button>
      </span>
    </React.Fragment>
  );
};

const ColumnButtonDraft = props => {
  const title = props.title;
  const type = props.type;
  const id = props.id;
  let record = props.record;
  record.disableDate = true;
  const isDisabled = parseInt(record.balance_amount, 10) === 0;
  const handleClick = props.handleClick;
  return (
    <React.Fragment>
      <span>
        <Button
          id={id}
          disabled={isDisabled}
          type={type}
          onClick={e => handleClick(record, "edit")}
        >
          <Link
            to={{
              pathname: routes.ORDERDRAFTPAGE,
              state: {
                record: record,
                disableDate: true
              }
            }}
          >
            Edit
          </Link>
        </Button>
      </span>
    </React.Fragment>
  );
};

const ColumnButtonDraft1 = props => {
  const title = props.title;
  const type = props.type;
  const id = props.id;
  let record = props.record;
  record.disableDate = true;
  const isDisabled = parseInt(record.balance_amount, 10) === 0;
  const handleClick = props.handleClick;
  return (
    <React.Fragment>
      <span>
        <Button
          id={id}
          disabled={isDisabled}
          type={type}
          onClick={e => handleClick(record)}
        >
          <Link
            to={{
              pathname: routes.ORDERDRAFTPAGE,
              state: {
                record: record,
                disableDate: false
              }
            }}
          >
            Convert to New Order/Draft
          </Link>
        </Button>
      </span>
    </React.Fragment>
  );
};

const MenuDropdown = props => {
  const handleClick = props.handleClick;
  const record = props.record;
  const isDisabled = parseInt(record.balance_amount, 10) === 0;
  const draftObj = { ...record, duplicateOrderId: record.id };
  return (
    <Menu style={{ flex: 1, zIndex: 1 }}>
      <Menu.Item
        key="printorder"
        id="printorder"
        onClick={e => handleClick(record, e)}
      >
        <Icon type="dollar" />
        Print Order
      </Menu.Item>
      <Menu.Item
        key="receievepayment"
        disabled={isDisabled}
        id="receievepayment"
        onClick={e => handleClick(record, e)}
      >
        <Icon type="dollar" />
        Receive Payment
      </Menu.Item>
      <Menu.Item key="edit" id="edit" onClick={e => handleClick(record, e)}>
        <Link
          style={{ display: "block", height: "100%" }}
          to={{
            pathname: routes.ORDERCUSTOMERPAGE,
            state: {
              record: record
            }
          }}
        >
          <Icon type="edit" /> Edit
        </Link>
      </Menu.Item>
      <Menu.Item
        key="duplicateorder"
        id="duplicateOrder"
        onClick={e => handleClick(record, e)}
      >
        <Link
          to={{
            pathname: routes.ORDERDRAFTPAGE,
            state: {
              record: draftObj
            }
          }}
        >
          <Icon type="copy" /> Duplicate Order
        </Link>
      </Menu.Item>
      <Menu.Item
        key="void"
        disabled={isDisabled}
        id="void"
        onClick={e => handleClick(record, e)}
      >
        <Icon type="warning" />
        Void
      </Menu.Item>
    </Menu>
  );
};

const ColumnDropDown = props => {
  const handleClick = props.handleClick;
  const record = props.record;

  return (
    <React.Fragment>
      <span>
        <Dropdown
          overlay={<MenuDropdown record={record} handleClick={handleClick} />}
        >
          <Button>
            Action <Icon type="down" />
          </Button>
        </Dropdown>
      </span>
    </React.Fragment>
  );
};

export {
  WrappedLink,
  ColumnButton,
  ColumnDropDown,
  MenuDropdown,
  ColumnButtonDraft,
  ColumnButtonDraft1
};
