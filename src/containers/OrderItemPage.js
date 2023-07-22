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
  Tag,
  Form,
  Icon
} from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  fetchItems,
  updateData,
  updateSelectedRowKeys
} from "../actions/eventItem";

class OrderItemPage extends React.PureComponent {
  constructor(props) {
    super();
    this.state = { disableButton: true, selectedRowKeys: [], searchText: "" };
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  componentDidMount() {}

  render() {
    //console.log("render", this.props.disableOk);

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        ...this.getColumnSearchProps("name")
      },
      {
        title: "Category",
        dataIndex: "Category.category_name",
        width: "10%"
      },
      {
        title: "Quantity Available",
        dataIndex: "quantity",
        width: "10%"
      },
      {
        title: "Quantity Ordered",
        dataIndex: "quantity_ordered",
        width: "10%"
      },
      {
        title: "No Of Days",
        dataIndex: "no_of_days",
        width: "10%"
      },
      {
        title: "Rate",
        dataIndex: "rate",
        width: "10%"
      },
      {
        title: "Price",
        dataIndex: "price",
        width: "10%"
      }
    ];

    const itemCount = this.props.itemData ? this.props.itemData.length : 0;

    const count = (
      <React.Fragment>
        <Tag color="magenta">Total Order Cost: {this.props.orderCost}</Tag>
        <Tag color="magenta">Order Count: {itemCount}</Tag>
        <Button
          key="updatequantitychange"
          loading={this.props.confirmButtonLoading}
          onClick={this.props.updateModifiedItemQty}
          type="danger"
        >
          Check Quantity Available
        </Button>
        <Button
          style={{marginLeft: "10px"}}
          key="oktosave"
          onClick={this.props.onOkay}
          disabled={this.props.disableOk}
          type="primary"
        >
          Okay
        </Button>
      </React.Fragment>
    );

    return (
      <Card
        title="Ordered Items List"
        extra={count}
        style={{ width: "100%", height: "auto", maxHeight: 600, marginTop: 30 }}
      >
        <Table
          columns={columns}
          dataSource={this.props.itemData}
          scroll={{ y: 400 }}
        />
      </Card>
    );
  }
}

export default OrderItemPage;
