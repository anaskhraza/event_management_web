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
  Modal,
  Alert,
  Switch,
  Menu,
  Dropdown,
  Select
} from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SpinnerComponent } from "../utils/common";
import { fetchOrders, updateOrder } from "../actions/orders";
import { printOrders, resetPrintState } from "../actions/orders";
import { prepareUpdateEvent } from "../actions/createEvent";
import { ColumnDropDown, ColumnButton } from "../components/Common";

const { Option } = Select;

const selectBox = [
  { key: "overdue", value: "Over Due Orders" },
  { key: "upcoming", value: "Upcoming Orders" },
  { key: "completed", value: "Completed Orders" },
  { key: "closed", value: "Closed Orders" }
];

class OrderListPage extends Component {
  constructor(props) {
    super();
    this.state = {
      searchValue: "",
      order_no: "",
      items_expense: "",
      other_expense: "",
      profit_amount: "",
      db_balance_amount: 0,
      balance_amount: 0,
      received_amount: 0,
      total_amount: 0,
      db_received_amount: 0,
      isShow: false,
      disableOkButton: false,
      isOrderProcessModal: false,
      disabledCancelButton: false,
      isVoidModalShow: false,
      isStatsModalShow: false,
      printModal: false,
      searchCategory: "order_no",
      filterInfo: "",
      disableVoided: true,
      customerSearchById: "",
      key: "",
      id: "",
      printURL: ""
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps ", props);
    if (props.print && props.print.url && props.print.url.filename) {
      return { printURL: props.print.url.filename };
    } else if (props.customerListId) {
      return { customerSearchById: props.customerListId };
    } else {
      return null;
    }
  }

  handleNumberChange = e => {
    var inputNumber = e.target.value ? e.target.value : 0;
    const number = parseInt(inputNumber, 10);

    if (Number.isNaN(number)) {
      return;
    }
    if (!("value" in this.props)) {
      this.setState({ [e.target.id]: number });
    }

    if (e.target.id == "received_amount") {
      this.setState({
        balance_amount:
          this.state.total_amount -
          parseFloat(inputNumber) -
          this.state.db_received_amount
      });
    }
  };

  handleReceivePayment = (record, e) => {
    const data = {
      total_amount: this.state.total_amount,
      received_amount:
        parseInt(this.state.db_received_amount, 10) +
        parseInt(this.state.received_amount, 10),
      balance_amount: this.state.balance_amount,
      is_due_amount: this.state.balance_amount,
      complete:
        parseInt(this.state.db_received_amount, 10) +
          parseInt(this.state.received_amount, 10) ===
        parseInt(this.state.total_amount, 10)
    };

    const orderId = this.state.id;

    this.props.updateOrder(orderId, data, true);

    this.setState({
      isShow: false,
      received_amount: 0
    });
    if (this.state.customerSearchById) {
      let itemsPromise = this.props.fetchOrders(
        `customerId/${this.state.customerSearchById}`
      );
    } else {
      this.props.fetchOrders(this.state.searchValue);
    }
  };

  handleVoidOrder = (record, e) => {
    const data = {
      total_amount: 0,
      received_amount: 0,
      balance_amount: 0,
      is_due_amount: 0,
      is_void: true,
      complete: true
    };

    const orderId = this.state.id;

    this.props.updateOrder(orderId, data, true);

    this.setState({
      isVoidModalShow: false,
      received_amount: 0
    });
    if (this.state.customerSearchById) {
      let itemsPromise = this.props.fetchOrders(
        `customerId/${this.state.customerSearchById}`
      );
    } else {
      this.props.fetchOrders(this.state.searchValue);
    }
  };

  markComplete = (record, e) => {
    //console.log("record -> ", record);
    //console.log("e -> ", e);
    const data = {
      total_amount: record.received_amount,
      discount:
        parseInt(record.discount, 10) + parseInt(record.balance_amount, 10),
      balance_amount: 0,
      is_due_amount: 0,
      complete: true
    };

    const orderId = record.id;

    this.props.updateOrder(orderId, data, true);
    if (this.state.customerSearchById) {
      let itemsPromise = this.props.fetchOrders(
        `customerId/${this.state.customerSearchById}`
      );
    } else {
      this.props.fetchOrders(this.state.searchValue);
    }
  };

  handleCancel = e => {
    ////console.log(e);
    this.setState({
      isShow: false,
      isVoidModalShow: false
    });
  };

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
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            this.setState({ filterInfo: e.target.value });
          }}
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
    onFilter: (value, record) => {
      if (dataIndex == "order_customer.customer_name") {
        return record.order_customer.customer_name
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else if (dataIndex == "order_customer.customer_number") {
        return record.order_customer.customer_number
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
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
        textToHighlight={text ? text.toString() : ""}
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

  componentDidMount() {
    if (this.state.customerSearchById) {
      let itemsPromise = this.props.fetchOrders(
        `customerId/${this.state.customerSearchById}`
      );
    } else {
      let itemsPromise = this.props.fetchOrders();
    }
  }

  onChangeSelectBox = value => {
    this.setState({
      searchValue: value
    });
    let itemsPromise = this.props.fetchOrders(value);
  };

  showRecieveModal = recordObj => {
    this.setState({
      key: recordObj.key,
      id: recordObj.id,
      order_no: recordObj.order_no,
      total_amount: recordObj.total_amount,
      db_received_amount: recordObj.received_amount,
      db_balance_amount: recordObj.balance_amount,
      balance_amount: recordObj.balance_amount,
      isShow: true
    });
  };

  printOrder = recordObj => {
    this.props.printOrders({
      orderInfo: recordObj,
      fetchOrderItems: true
    });
  };

  showVoidModal = recordObj => {
    this.setState({
      key: recordObj.key,
      id: recordObj.id,
      order_no: recordObj.order_no,
      total_amount: recordObj.total_amount,
      db_received_amount: recordObj.received_amount,
      db_balance_amount: recordObj.balance_amount,
      balance_amount: recordObj.balance_amount,
      isVoidModalShow: true
    });
  };

  handleClick = (record, e) => {
    //console.log("Rec -> ", record);
    const key = e.target ? e.target.id : e.key;
    //console.log("key -> ", key);
    switch (key) {
      case "printorder": {
        this.printOrder(record);
        break;
      }
      case "receievepayment": {
        this.showRecieveModal(record);
        break;
      }
      case "void": {
        this.showVoidModal(record);
        break;
      }
      case "edit": {
        this.props.prepareUpdateEvent(record);
        break;
      }
      default: {
        break;
      }
    }
  };

  ModalScreen = props => {
    return (
      <React.Fragment>
        <div className="orderInfo">
          <span>Order No: {this.state.order_no}</span>
        </div>
        <div className="orderInfo">
          <span>Total Order Cost: Rs {this.state.total_amount}</span>
        </div>
        <div className="orderInfo">
          <span>Recieved Amount: Rs {this.state.db_received_amount}</span>
        </div>
        <div className="orderInfo">
          <span>Balance Amount: Rs {this.state.db_balance_amount}</span>
        </div>
        <Input
          id="received_amount"
          addonBefore="New Amount Received"
          onChange={this.handleNumberChange}
          style={{ width: "65%", marginRight: "3%", marginTop: "3%" }}
          placeholder="Receive Amount"
        />
        <p>
          <span>New Total Amount Remaining: {props.balanceAmount}</span>
        </p>
      </React.Fragment>
    );
  };

  enableVoid = () => {
    this.setState({
      disableVoided: !this.state.disableVoided
    });
  };

  VoidModal = () => {
    return (
      <React.Fragment>
        <Modal
          title="Void the Order"
          visible={this.state.isVoidModalShow}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="Void Order"
              onClick={this.handleVoidOrder}
              disabled={this.state.disableVoided}
              type="danger"
            >
              Okay
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>
          ]}
        >
          <p>Swipe the switch and press OK to void the order</p>
          <Switch onChange={this.enableVoid} />
        </Modal>
      </React.Fragment>
    );
  };

  StatsModal = () => {
    return (
      <React.Fragment>
        <Modal
          title="Order Stats"
          visible={this.state.isStatsModalShow}
          onCancel={() => {
            this.setState({
              isStatsModalShow: false
            });
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  isStatsModalShow: false
                });
              }}
            >
              Ok
            </Button>
          ]}
        >
          <div
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex"
              }}
            >
              <label style={{ fontSize: 30 }}>{this.state.order_no}</label>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex"
              }}
            >
              <div
                style={{
                  width: "33%",
                  padding: 10,
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  margin: 10
                }}
              >
                <label>Total Amount</label>
                <label style={{ paddingLeft: 10 }}>
                  {this.state.total_amount}
                </label>
              </div>
              <div
                style={{
                  width: "33%",
                  padding: 10,
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  margin: 10
                }}
              >
                <label>Recieved Amount</label>
                <label style={{ paddingLeft: 10 }}>
                  {this.state.db_received_amount}
                </label>
              </div>
              <div
                style={{
                  width: "33%",
                  padding: 10,
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  margin: 10
                }}
              >
                <label>Balance Amount</label>
                <label style={{ paddingLeft: 10 }}>
                  {this.state.db_balance_amount}
                </label>
              </div>
            </div>
            <div style={{ flexDirection: "row", display: "flex" }}>
              <div
                style={{
                  width: "33%",
                  padding: 10,
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  margin: 10
                }}
              >
                <label>Items expense</label>

                <label style={{ paddingLeft: 10 }}>
                  {this.state.items_expense}
                </label>
              </div>
              <div
                style={{
                  width: "33%",
                  padding: 10,
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  margin: 10
                }}
              >
                <label>Other Expense</label>

                <label style={{ paddingLeft: 10 }}>
                  {this.state.other_expense}
                </label>
              </div>
              <div
                style={{
                  width: "33%",
                  padding: 10,
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  margin: 10
                }}
              >
                <label>Profit</label>

                <label style={{ paddingLeft: 10 }}>
                  {this.state.profit_amount}
                </label>
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  };

  RecieveModal = props => {
    let SpinnerScreen = null;

    if (this.state.isOrderProcessModal) {
      SpinnerScreen = <SpinnerComponent />;
    }

    return (
      <React.Fragment>
        <Modal
          title="Recieve Money"
          visible={this.state.isShow}
          footer={[
            <Button
              key="recievepayment"
              onClick={this.handleReceivePayment}
              disabled={
                this.state.received_amount > 0
                  ? this.state.disableOkButton
                    ? true
                    : false
                  : true
              }
              type="danger"
            >
              Recieve Payment
            </Button>,
            <Button
              key="back"
              disabled={this.state.disabledCancelButton}
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          ]}
        >
          {SpinnerScreen}
          <this.ModalScreen {...props} />
        </Modal>
      </React.Fragment>
    );
  };
  handleClose = props => {
    this.setState({ printURL: "" });
    this.props.resetPrintState();
  };

  showStatsModal = (record, e) => {
    console.log("rec ", record);
    this.setState({
      order_no: record.order_no,
      items_expense: record.expense_items ? record.expense_items : 0,
      total_amount: record.total_amount,
      db_received_amount: record.received_amount ? record.received_amount : 0,
      db_balance_amount: record.balance_amount ? record.balance_amount : 0,
      other_expense:
        parseFloat(record.service_expense ? record.service_expense : 0) +
        parseFloat(record.vehicle_charges ? record.vehicle_charges : 0),
      profit_amount: parseFloat(
        parseFloat(record.total_amount) -
          parseFloat(record.expense_items ? record.expense_items : 0) -
          parseFloat(record.vehicle_charges ? record.vehicle_charges : 0) -
          parseFloat(record.service_expense ? record.service_expense : 0)
      ).toFixed(2),
      isStatsModalShow: true
    });
  };

  render() {
    const showStatsButton = this.props.showStatsButton
      ? this.props.showStatsButton
      : false;

    const columns1 = [
      {
        title: "Order Number",
        dataIndex: "order_no",
        width: "10%",
        ...this.getColumnSearchProps("order_no")
      },
      {
        title: "order_title",
        dataIndex: "order_title",
        width: "10%",
        ...this.getColumnSearchProps("order_title")
      },
      {
        title: "customer Name",
        dataIndex: "order_customer.customer_name",
        width: "10%",
        ...this.getColumnSearchProps("order_customer.customer_name")
      },
      {
        title: "customer Number",
        dataIndex: "order_customer.customer_number",
        width: "10%",
        ...this.getColumnSearchProps("order_customer.customer_number")
      },
      {
        title: "DATE",
        dataIndex: "event_date",
        width: "10%"
      },
      {
        title: "Total Amount",
        dataIndex: "total_amount",
        width: "8%"
      },
      {
        title: "Balance Amount",
        dataIndex: "balance_amount",
        width: "8%"
      },
      {
        title: "Action",
        key: "action",
        width: "10%",
        render: (text, record) => (
          <ColumnDropDown
            record={record}
            type={"primary"}
            handleClick={this.handleClick}
          />
        )
      },
      {
        title: "Mark Complete",
        key: "markcomplete",
        width: "20%",
        render: (text, record) => (
          <Popconfirm
            title="Are you sure you want to mark the order complete？Amount is Pending!"
            onConfirm={e => this.markComplete(record, e)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="danger"
              disabled={parseInt(record.balance_amount, 10) === 0}
            >
              Mark pending order as complete
            </Button>
            {/* <a href="#">Mark Complete</a> */}
          </Popconfirm>
        )
      }
    ];

    const columns2 = [
      {
        title: "Order Number",
        dataIndex: "order_no",
        width: "10%",
        sorter: (a, b) => {
          a.id - b.id;
        },
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("order_no")
      },
      {
        title: "order_title",
        dataIndex: "order_title",
        width: "10%",
        ...this.getColumnSearchProps("order_title")
      },
      {
        title: "DATE",
        dataIndex: "event_date",
        width: "10%"
      },
      {
        title: "Total Amount",
        dataIndex: "total_amount",
        width: "8%"
      },
      {
        title: "See Stats",
        key: "seestats",
        width: "10%",
        render: (text, record) => (
          <Button type="danger" onClick={e => this.showStatsModal(record)}>
            See Stats
          </Button>
        )
      }
    ];

    const columns = showStatsButton ? columns2 : columns1;

    const selectAfter = (
      <Select
        defaultValue="order_no"
        onChange={e => {
          this.setState({ searchCategory: e });
        }}
        style={{ width: 200 }}
      >
        <Select.Option value="order_no">Order Number</Select.Option>
        <Select.Option value="order_title">Title</Select.Option>
        <Select.Option value="order_customer.customer_number">
          Number
        </Select.Option>
      </Select>
    );

    const itemCount = this.props.itemData ? this.props.itemData.length : 0;
    const count = `Order Count: ${itemCount}`;
    const balanceAmount = this.state.balance_amount;
    return (
      <Card
        title="List Of Orders"
        extra={count}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 1200,
          textAlign: "center",
          alignContent: "center"
        }}
      >
        {this.state.printURL ? (
          <Alert
            message="Success"
            description={
              <a style={{ color: "#000000" }} href={this.state.printURL}>
                {this.state.printURL}
              </a>
            }
            type="success"
            closable
            afterClose={() => this.handleClose()}
            showIcon
          />
        ) : null}
        {!this.state.customerSearchById ? (
          <Select
            showSearch
            allowClear={true}
            style={{ width: 600, paddingTop: 10 }}
            placeholder="Select Search Mechanism"
            optionFilterProp="children"
            onChange={this.onChangeSelectBox}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {selectBox.map(obj => (
              <Option key={obj.key}>{obj.value}</Option>
            ))}
          </Select>
        ) : null}

        <Button
          type="primary"
          onClick={() => {
            if (this.state.customerSearchById) {
              let itemsPromise = this.props.fetchOrders(
                `customerId/${this.state.customerSearchById}`
              );
            } else {
              this.props.fetchOrders(this.state.searchValue);
            }
          }}
          icon="refresh"
          size="medium"
          style={{
            width: 90,
            marginRight: 8,
            float: "right",
            marginBottom: 10
          }}
        >
          <Icon type="sync" />
        </Button>
        <Table
          style={{ marginTop: 20 }}
          columns={columns}
          dataSource={this.props.itemData}
          loading={this.props.fetching}
          scroll={{ y: 400 }}
        />
        <this.RecieveModal balanceAmount={balanceAmount} />
        <this.VoidModal />
        <this.StatsModal />
      </Card>
    );
  }
}

function mapStateToProps(state) {
  //console.log("here Create Event Page", state);
  return {
    itemData: state.orders ? state.orders.data : [],
    fetching: state.orders ? state.orders.fetching : false,
    print: state.print ? state.print : null
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchOrders: fetchOrders,
      updateOrder: updateOrder,
      prepareUpdateEvent: prepareUpdateEvent,
      printOrders: printOrders,
      resetPrintState: resetPrintState
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderListPage);
