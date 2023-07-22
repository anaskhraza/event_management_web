import React, { Component } from "react";
import { Link } from "react-router-dom";
import routes from "../constants/routes";
import {
  DatePicker,
  Button,
  Divider,
  PageHeader,
  Statistic,
  Progress,
  Card,
  Row,
  Col,
  Table,
  Tag,
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
  Select,
  Badge,
} from "antd";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SpinnerComponent } from "../utils/common";
import {
  fetchHomeOrders,
  fetchUpcomingOrders,
  updateOrder,
} from "../actions/orders";
import { prepareUpdateEvent } from "../actions/createEvent";
import { ColumnDropDown, ColumnButton } from "../components/Common";
const localizer = momentLocalizer(moment);

class HomePage extends Component {
  constructor(props) {
    super();
    this.state = {
      order_no: "",
      db_balance_amount: 0,
      iconLoading: false,
      balance_amount: 0,
      received_amount: 0,
      total_amount: 0,
      db_received_amount: 0,
      isShowHome: false,
      disableOkButton: false,
      isOrderProcessModal: false,
      disabledCancelButton: false,
      isVoidModalShow: false,
      disableVoided: true,
      key: "",
      id: "",
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      showModal: false,
      eventObj: null,
    };
  }

  StatsModal = () => {
    const eventObj = this.state.eventObj;
    if (eventObj) {
      return (
        <React.Fragment>
          <Modal
            title="Order Stats"
            visible={this.state.showModal}
            onCancel={() => {
              this.setState({
                showModal: false,
              });
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  this.setState({
                    showModal: false,
                  });
                }}
              >
                Ok
              </Button>,
            ]}
          >
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <label style={{ fontSize: 30 }}>{eventObj.order_no}</label>
              </div>
              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
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
                    margin: 10,
                  }}
                >
                  <label>Total Amount</label>
                  <label style={{ paddingLeft: 10 }}>
                    {eventObj.total_amount}
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
                    margin: 10,
                  }}
                >
                  <label>Recieved Amount</label>
                  <label style={{ paddingLeft: 10 }}>
                    {eventObj.db_received_amount}
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
                    margin: 10,
                  }}
                >
                  <label>Balance Amount</label>
                  <label style={{ paddingLeft: 10 }}>
                    {eventObj.db_balance_amount}
                  </label>
                </div>
              </div>
              <div style={{ flexDirection: "row", display: "flex" }}>
                <div
                  style={{
                    width: "49%",
                    padding: 10,
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #e8e8e8",
                    borderRadius: 10,
                    margin: 10,
                  }}
                >
                  <label>Items expense</label>

                  <label style={{ paddingLeft: 10 }}>
                    {eventObj.items_expense}
                  </label>
                </div>
                <div
                  style={{
                    width: "49%",
                    padding: 10,
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #e8e8e8",
                    borderRadius: 10,
                    margin: 10,
                  }}
                >
                  <label>Other Expense</label>

                  <label style={{ paddingLeft: 10 }}>
                    {eventObj.other_expense}
                  </label>
                </div>
              </div>
            </div>
          </Modal>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  handleNumberChange = (e) => {
    var inputNumber = e.target.value ? e.target.value : 0;
    const number = parseInt(inputNumber, 10);
    console.log("inputNumber => ", inputNumber);
    console.log("e.target.id => ", e.target.id);
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
          this.state.db_received_amount,
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
        parseInt(this.state.total_amount, 10),
    };

    const orderId = this.state.id;

    this.props.updateOrder(orderId, data, true);
    let itemsPromise3 = this.props.fetchUpcomingOrders();
    let itemsPromise4 = this.props.fetchHomeOrders({
      monthYear: `${this.state.currentMonth}-${this.state.currentYear}`,
      runClosed: false,
    });
    this.forceUpdate();

    this.setState({
      isShowHome: false,
      received_amount: 0,
    });
  };

  handleVoidOrder = (record, e) => {
    const data = {
      total_amount: 0,
      received_amount: 0,
      balance_amount: 0,
      is_due_amount: 0,
      complete: true,
    };

    const orderId = this.state.id;

    this.props.updateOrder(orderId, data, true);

    this.setState({
      isVoidModalShow: false,
      received_amount: 0,
    });
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
      complete: true,
    };

    const orderId = record.id;

    this.props.updateOrder(orderId, data, true);
  };

  handleCancel = (e) => {
    ////console.log(e);
    this.setState({
      isShowHome: false,
      isVoidModalShow: false,
    });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
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
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  componentDidMount() {
    let itemsPromise = this.props.fetchUpcomingOrders();
    let itemsPromise1 = this.props.fetchHomeOrders({
      monthYear: `${this.state.currentMonth}-${this.state.currentYear}`,
      runClosed: false,
    });
  }

  showRecieveModal = (recordObj) => {
    this.setState({
      key: recordObj.key,
      id: recordObj.id,
      order_no: recordObj.order_no,
      total_amount: recordObj.total_amount,
      db_received_amount: recordObj.received_amount,
      db_balance_amount: recordObj.balance_amount,
      balance_amount: recordObj.balance_amount,
      isShowHome: true,
    });
  };

  showVoidModal = (recordObj) => {
    this.setState({
      key: recordObj.key,
      id: recordObj.id,
      order_no: recordObj.order_no,
      total_amount: recordObj.total_amount,
      db_received_amount: recordObj.received_amount,
      db_balance_amount: recordObj.balance_amount,
      balance_amount: recordObj.balance_amount,
      isVoidModalShow: true,
    });
  };

  handleClick = (record, key) => {
    console.log("Rec -> ", record);

    console.log("key -> ", key);
    switch (key) {
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

  ModalScreen = (props) => {
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
      disableVoided: !this.state.disableVoided,
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
            </Button>,
          ]}
        >
          <p>Swipe the switch and press OK to void the order</p>
          <Switch onChange={this.enableVoid} />
        </Modal>
      </React.Fragment>
    );
  };

  RecieveModal = (props) => {
    console.log("this.seyaye => ", this.state.isShowHome);
    return (
      <React.Fragment>
        <Modal
          title="Recieve Money"
          visible={this.state.isShowHome}
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
            </Button>,
          ]}
        >
          <this.ModalScreen {...props} />
        </Modal>
      </React.Fragment>
    );
  };
  enterIconLoading = () => {
    let itemsPromise1 = this.props.fetchHomeOrders({
      monthYear: `${this.state.currentMonth}-${this.state.currentYear}`,
      runClosed: true,
    });
    let itemsPromise = this.props.fetchUpcomingOrders();
  };

  HomeCards = (props) => {
    let reactNode = null;
    const data = this.props.itemData || [];
    const isError = this.props.isError || [];
    const RecieveModal1 = props.isShowHome ? (
      <this.RecieveModal balanceAmount={props.balanceAmount} />
    ) : null;
    if (isError) {
      reactNode = (
        <Alert
          message="Error"
          description="There is an error while fetching data"
          type="error"
          showIcon
        />
      );
    }
    if (data.length < 1) return null;
    reactNode = data.map((obj) => {
      return (
        <React.Fragment>
          <Card
            style={{ width: 250, margin: 5, textAlign: "center" }}
            title={
              <Badge style={{ left: -7 }} dot={obj.today}>
                {obj.order_no}
              </Badge>
            }
            cover={
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  textAlign: "left",
                  marginTop: 10,
                }}
              >
                <label
                  style={{
                    borderBottom: "1px solid #e8e8e8",
                    marginTop: 10,
                    paddingLeft: 5,
                  }}
                >
                  {obj.order_title}
                </label>
                <label
                  style={{
                    borderBottom: "1px solid #e8e8e8",
                    marginTop: 10,
                    paddingLeft: 5,
                  }}
                >
                  Event Date: {obj.event_date}
                </label>
                <label
                  style={{
                    borderBottom: "1px solid #e8e8e8",
                    marginTop: 10,
                    paddingLeft: 5,
                  }}
                >
                  Total Amount: {obj.total_amount}
                </label>
                <label
                  style={{
                    borderBottom: "1px solid #e8e8e8",
                    marginTop: 10,
                    paddingLeft: 5,
                  }}
                >
                  Balance Amount: <Tag color="#f50">{obj.balance_amount}</Tag>
                </label>
              </div>
            }
            actions={[
              <Button
                id={"receievepayment"}
                onClick={(e) => this.handleClick(obj, "receievepayment")}
                disabled={parseInt(obj.balance_amount, 10) === 0}
                style={{
                  border: "none",
                  background: "transparent",
                }}
              >
                <Icon type="dollar" key="dollar" />
              </Button>,
              <Button
                id={"edit"}
                onClick={(e) => this.handleClick(obj, "edit")}
                style={{
                  border: "none",
                  background: "transparent",
                }}
              >
                <Link
                  style={{ display: "block", height: "100%" }}
                  to={routes.ORDERCUSTOMERPAGE}
                >
                  <Icon type="edit" key="edit" />
                </Link>
              </Button>,
            ]}
          ></Card>
          {RecieveModal1}
        </React.Fragment>
      );
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          paddingTop: 20,
          paddingLeft: 20,
          paddingBottom: 50,
        }}
      >
        {reactNode}
      </div>
    );
  };
  render() {
    const Views1 = {
      MONTH: "month",
    };
    const myEventsList = this.props.calendarData;

    let allViews = Object.keys(Views1).map((k) => Views1[k]);
    const itemCount = this.props.itemData ? this.props.itemData.length : 0;
    const count = `Order Count: ${itemCount}`;
    const isShowHome = this.state.isShowHome;
    const isErrorHome = this.props.isErrorHome;
    const balanceAmount = this.state.balance_amount;
    return (
      <React.Fragment>
        <div
          style={{
            width: "80%",
            maxHeight: "100%",
            overflowY: "auto",
            position: "absolute"
          }}
        >
          {isErrorHome ? (
            <Alert
              style={{marginBottom: "10px", width: "95%"}}
              message="Error"
              description="There is an error while fetching data"
              type="error"
              showIcon
            />
          ) : null}

          {this.props.itemData.length > 0 ? (
            <div>
              <div
                style={{
                  // display: "flex",
                  // justifyContent: "flex-start",
                  marginTop: 10,
                  marginLeft: 20
                }}
              >
                <label style={{ paddingTop: 20 }}>Upcoming Orders</label>
              </div>
              <div>
                <this.HomeCards
                  isShowHome={isShowHome}
                  balanceAmount={balanceAmount}
                />
              </div>
            </div>
          ) : null}
          <div
            style={{
              backgroundColor: "#FFF",
              width: "90%",
              marginLeft: 20,
              marginBottom: 20
            }}
          >
            <div
              style={{
                width: "70%",
                marginBottom: 0,
                marginLeft: 20,
                flexDirection: "row",
                display: "flex"
              }}
            >
              <div
                style={{
                  width: "30%",
                  backgroundColor: "#1890ff",
                  marginLeft: 2,
                  padding: 10
                }}
              >
                Upcoming
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "#3cba54",
                  marginLeft: 2,
                  padding: 10
                }}
              >
                Closed
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "#f4c20d",
                  marginLeft: 2,
                  padding: 10
                }}
              >
                Complete
              </div>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "#db3236",
                  marginLeft: 2,
                  padding: 10
                }}
              >
                OverDue
              </div>
            </div>
            {this.props.fetchingHome ? (<div style={{
                  width: "80%",
                  backgroundColor: "white",
                  marginLeft: 2,
                  padding: 10
                }}> <label style={{color: "black"}}>Loading Calendar</label></div>): null }
            <Calendar
              localizer={localizer}
              views={allViews}
              events={myEventsList}
              popup={true}
              popupOffset={{ x: 30, y: 20 }}
              startAccessor="start"
              onNavigate={event => {
                this.setState({
                  currentMonth: new Date(event).getMonth(),
                  currentYear: new Date(event).getFullYear()
                });
                this.props.fetchHomeOrders({
                  monthYear: `${new Date(event).getMonth()}-${new Date(
                    event
                  ).getFullYear()}`,
                  runClosed: false
                });
              }}
              endAccessor="end"
              onDoubleClickEvent={event => {
                this.setState({
                  eventObj: {
                    ...event,
                    items_expense: event.expense_items
                      ? event.expense_items
                      : 0,
                    total_amount: event.total_amount,
                    db_received_amount: event.received_amount
                      ? event.received_amount
                      : 0,
                    db_balance_amount: event.balance_amount
                      ? event.balance_amount
                      : 0,
                    other_expense:
                      parseFloat(
                        event.service_expense ? event.service_expense : 0
                      ) +
                      parseFloat(
                        event.vehicle_charges ? event.vehicle_charges : 0
                      ),
                    profit_amount: parseFloat(
                      parseFloat(event.total_amount) -
                        parseFloat(
                          event.expense_items ? event.expense_items : 0
                        ) -
                        parseFloat(
                          event.vehicle_charges ? event.vehicle_charges : 0
                        ) -
                        parseFloat(
                          event.service_expense ? event.service_expense : 0
                        )
                    ).toFixed(2)
                  },
                  showModal: true
                });
              }}
              eventPropGetter={event => {
                let background = "#1890ff";
                if (event.is_closed) {
                  background = "#3cba54";
                } else if (event.complete) {
                  background = "#f4c20d";
                } else if (new Date(event.event_date_start) < new Date()) {
                  background = "#db3236";
                }
                return { style: { backgroundColor: background } };
              }}
              style={{ height: 700, width: "100%", color: "#000", padding: 10 }}
            />
          </div>
          <div
            style={{
              justifyContent: "flex-start",
              marginLeft: 20,
              marginTop: 10
            }}
          >
            <Card
              style={{
                width: "62%"
              }}
            >
              <Button
                type="primary"
                icon="poweroff"
                loading={this.props.fetchingHome}
                onClick={this.enterIconLoading}
              >
                Mark Previous Completed Orders Closed
              </Button>
              <label style={{ paddingLeft: 10 }}>
                Orders to be closed
                <Tag color="#f50" style={{ marginLeft: 10 }}>
                  {this.props.compCloseCount}
                </Tag>
              </label>
            </Card>
          </div>
          <div
            style={{
              // display: "flex",
              // justifyContent: "flex-start",
              marginTop: 10,
              marginLeft: 20
            }}
          >
            <label style={{ paddingTop: 20 }}>Total Order Stats</label>
          </div>
          <div
            style={{
              // display: "flex",
              // position: "relative",
              // justifyContent: "flex-start",
              marginLeft: 20,
              marginTop: 10
            }}
          >
            <Row gutter={18}>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#1890ff" }}
                    />
                    <label style={{ fontSize: 20, color: "#1890ff" }}>
                      Total Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 50, color: "#1890ff" }}
                    >
                      {this.props.totalOrderCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#c41d7f" }}
                    />
                    <label style={{ fontSize: 20, color: "#c41d7f" }}>
                      Open Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 50, color: "#c41d7f" }}
                    >
                      {this.props.totalOverdueCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#531dab" }}
                    />
                    <label style={{ fontSize: 20, color: "#531dab" }}>
                      Completed Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 20, color: "#531dab" }}
                    >
                      {this.props.totalCompleteCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#52c41a" }}
                    />
                    <label style={{ fontSize: 20, color: "#52c41a" }}>
                      Closed Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 20, color: "#52c41a" }}
                    >
                      {this.props.totalClosedCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#ff4d4f" }}
                    />
                    <label style={{ fontSize: 20, color: "#ff4d4f" }}>
                      Void Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 20, color: "#ff4d4f" }}
                    >
                      {this.props.voidCount}
                    </label>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          <div
            style={{
              // display: "flex",
              // justifyContent: "flex-start",
              marginTop: 10,
              marginLeft: 20
            }}
          >
            <label style={{ paddingTop: 20 }}>Current Month Order Stats</label>
          </div>
          <div
            style={{
              // display: "flex",
              // justifyContent: "flex-start",
              marginTop: 10,
              marginLeft: 20,
              marginBottom: 100
            }}
          >
            <Row gutter={18}>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#1890ff" }}
                    />
                    <label style={{ fontSize: 20, color: "#1890ff" }}>
                      Total Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 50, color: "#1890ff" }}
                    >
                      {this.props.monthOrderCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#c41d7f" }}
                    />
                    <label style={{ fontSize: 20, color: "#c41d7f" }}>
                      Open Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 50, color: "#c41d7f" }}
                    >
                      {this.props.monthOverdueCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#531dab" }}
                    />
                    <label style={{ fontSize: 20, color: "#531dab" }}>
                      Completed Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 20, color: "#531dab" }}
                    >
                      {this.props.monthCompleteCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#52c41a" }}
                    />
                    <label style={{ fontSize: 20, color: "#52c41a" }}>
                      Closed Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 20, color: "#52c41a" }}
                    >
                      {this.props.monthClosedCount}
                    </label>
                  </div>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={{ height: 250 }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center"
                    }}
                  >
                    <Icon
                      type="shopping-cart"
                      style={{ fontSize: 30, color: "#ff4d4f" }}
                    />
                    <label style={{ fontSize: 20, color: "#ff4d4f" }}>
                      Void Orders
                    </label>
                    <label
                      style={{ fontSize: 30, marginTop: 20, color: "#ff4d4f" }}
                    >
                      {this.props.monthVoidCount}
                    </label>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        <this.StatsModal />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  //console.log("here Create Event Page", state);
  return {
    itemData: state.upcoming ? state.upcoming.data : [],
    fetching: state.upcoming ? state.upcoming.fetching : false,
    fetchingHome: state.home ? state.home.fetching : false,
    isErrorHome: state.home.isError,
    isError: state.upcoming.isError,
    monthClosedCount: state.home.response
      ? state.home.response.monthClosedCount
      : 0,
    monthCompleteCount: state.home.response
      ? state.home.response.monthCompleteCount
      : 0,
    monthOrderCount: state.home.response
      ? state.home.response.monthOrderCount
      : 0,
    monthOverdueCount: state.home.response
      ? state.home.response.monthOverdueCount
      : 0,
    totalClosedCount: state.home.response
      ? state.home.response.totalClosedCount
      : 0,
    totalCompleteCount: state.home.response
      ? state.home.response.totalCompleteCount
      : 0,
    totalOrderCount: state.home.response
      ? state.home.response.totalOrderCount
      : 0,
    totalOverdueCount: state.home.response
      ? state.home.response.totalOverdueCount
      : 0,
    voidCount: state.home.response ? state.home.response.voidCount : 0,
    monthVoidCount: state.home.response
      ? state.home.response.monthVoidCount
      : 0,
    compCloseCount: state.home.response
      ? state.home.response.compCloseCount
      : 0,
    calendarData: state.home.response ? state.home.response.calendarData : [],
  };
}

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchHomeOrders: fetchHomeOrders,
      updateOrder: updateOrder,
      fetchUpcomingOrders: fetchUpcomingOrders,
      prepareUpdateEvent: prepareUpdateEvent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
