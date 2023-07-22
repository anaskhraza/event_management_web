import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import routes from "../constants/routes";
import {
  DatePicker,
  Row,
  Col,
  Button,
  PageHeader,
  Card,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Icon,
  Statistic,
  Modal,
  Alert,
  Select,
  Switch,
  Menu,
  Dropdown
} from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";
import OrderListPage from "../containers/OrderListPage";
import ReactECharts from "echarts-for-react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SpinnerComponent } from "../utils/common";
import {
  fetchTargets,
  createTarget,
  deleteTarget,
  resetSateEvent,
  backupDatabase,
  updateItemExpense
} from "../actions/targets";
import { ColumnDropDown, ColumnButton } from "../components/Common";
import { AlertCredentialsError } from "../utils/common";
import { Chart } from "react-google-charts";
const { Option } = Select;
const { MonthPicker } = DatePicker;

class TargetListPage extends Component {
  constructor(props) {
    super();
    const date = new Date(Date.now());
    console.log(date.toLocaleString("en-US", { month: "short" }));
    this.state = {
      isAddItemModal: false,
      enableAddItem: false,
      enableSignIn: false,
      monthYear: "",
      isEdit: false,
      year: "",
      yearPicker: "",
      targetAmount: "",
      username: "",
      password: "",
      chartMonth: date.toLocaleString("en-US", { month: "short" })
    };
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

  componentDidMount() {
    const date = new Date().getFullYear();
    //console.log("Target Page -> ", "Target Page");
    this.setState({
      year: date
    });
    let itemsPromise = this.props.fetchTargets(date, this.props.auth);
  }

  handleClick = (record, e) => {
    //console.log("Rec -> ", record);
    const key = e.target ? e.target.id : e.key;
    //console.log("key -> ", key);

    switch (key) {
      case "editItem": {
        this.editItem(record);
        break;
      }
      case "additem": {
        this.setState({
          isAddItemModal: true
        });
        break;
      }
      default: {
        break;
      }
    }
  };

  editItem = record => {
    //console.log("editItem -> ", record);
    this.setState({
      isEdit: record.id ? true : false,
      targetId: record.id || "",
      year: this.state.year,
      month_year: record.month_year,
      targetAmount: record.amount,
      isAddItemModal: true
    });
  };

  deleteItem = (record, e) => {
    //console.log("record -> ", record);
    //console.log("e -> ", e);

    const targetId = record.id;

    this.props.deleteTarget(targetId, this.props.auth, this.state.year);
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
    this.enableAddButton();
    this.enableSignInButton();
  };

  handleNumberChange = e => {
    var inputNumber = e.target.value ? e.target.value : 0;
    const number = parseInt(inputNumber, 10);

    if (Number.isNaN(number)) {
      return;
    }
    if (!("value" in this.props)) {
      this.setState({ [e.target.id]: number });
    }
    this.enableAddButton();
  };

  handleCancel = e => {
    ////console.log(e);
    this.setState({
      isAddItemModal: false,
      enableAddItem: false,
      monthYear: "",
      year: "",
      targetAmount: "",
      signInModal: false
    });
  };

  handleCancelSignIn = e => {
    ////console.log(e);
    this.setState({
      isAddItemModal: false,
      enableAddItem: false,
      monthYear: "",
      yearPicker: "",
      year: "",
      targetAmount: "",
      signInModal: false
    });
    this.props.history.push("/home");
  };

  enableAddButton = () => {
    if (
      this.state.month_year &&
      (this.state.year || this.state.yearPicker) &&
      this.state.targetAmount &&
      parseInt(this.state.targetAmount) > 0
    ) {
      this.setState({
        enableAddItem: true
      });
    } else {
      this.setState({
        enableAddItem: false
      });
    }
  };

  enableSignInButton = () => {
    if (this.state.username && this.state.password) {
      this.setState({
        enableSignIn: true
      });
    } else {
      this.setState({
        enableAddItem: false
      });
    }
  };

  handleAddItem = () => {
    console.log("this.state -> ", this.state);
    this.props.createTarget(this.state, this.props.auth, this.state.year);
    this.setState({
      isAddItemModal: false,
      enableAddItem: false,
      month_year: "",
      yearPicker: "",
      year: "",
      targetAmount: ""
    });

    const year = new Date().getFullYear();
    this.props.fetchTargets(
      year,
      null,
      this.state.username,
      this.state.password
    );
  };

  handleSignIn = () => {
    const year = new Date().getFullYear();
    this.props.fetchTargets(
      year,
      null,
      this.state.username,
      this.state.password
    );
  };

  onChangeSelectBox = value => {
    this.setState({
      year: value
    });
    this.props.fetchTargets(value, this.props.auth);
  };
  onMonthChange = value => {
    const monthYear = moment(value).format("MM-YYYY");
    const year = new Date(value).getFullYear();
    //console.log("onMonthChange =? ", year);
    this.setState({
      month_year: monthYear,
      yearPicker: year
    });
  };

  ItemModal = () => {
    return (
      <React.Fragment>
        <Modal
          title="Add/ Edit the Item"
          visible={this.state.isAddItemModal}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="Add Item"
              onClick={this.handleAddItem}
              disabled={!this.state.enableAddItem}
              type="danger"
            >
              {this.state.targetId ? "Update" : "Add"}
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>
          ]}
        >
          {!this.state.isEdit ? (
            <MonthPicker
              onChange={this.onMonthChange}
              placeholder="Select month"
            />
          ) : (
            <Input
              id="month_year"
              addonBefore="Month-Year"
              disabled={true}
              value={this.state.month_year}
              style={{ width: "65%", marginRight: "3%", marginTop: "3%" }}
              placeholder="Month-Year"
              required
            />
          )}
          <Input
            id="targetAmount"
            addonBefore="Target Amount"
            value={this.state.targetAmount}
            style={{ width: "65%", marginRight: "3%", marginTop: "3%" }}
            onChange={this.handleNumberChange}
            placeholder="Rate"
            required
          />
        </Modal>
      </React.Fragment>
    );
  };

  getYears = () => {
    var d = new Date("01 " + "January 2018");
    let first = d.getFullYear();

    var s = new Date();
    let second = s.getFullYear();
    let arr = Array();

    for (let i = second; i >= first; i--) {
      arr.push({ label: i.toString(), value: i.toString() });
    }

    return arr;
  };

  onChangeSelectMonth = value => {
    this.setState({
      chartMonth: value
    });
  };

  SignInModal = () => {
    return (
      <React.Fragment>
        <Modal
          title="Sign In"
          visible={this.props.signInModal}
          footer={[
            <Button
              key="Sign In"
              onClick={this.handleSignIn}
              disabled={!this.state.enableSignIn}
              type="danger"
            >
              Sign In
            </Button>,
            <Button key="back" onClick={this.handleCancelSignIn}>
              Cancel
            </Button>
          ]}
        >
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Username"
            id="username"
            value={this.state.username}
            onChange={this.handleChange}
            required
          />

          <Input
            style={{ marginTop: 10 }}
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            id="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Password"
          />
          <AlertCredentialsError signInError={this.props.signInError} />
        </Modal>
      </React.Fragment>
    );
  };

  render() {
    const years = this.getYears();
    const currentMonthProfit = this.props.closedOrderStats
      ? this.props.closedOrderStats.currentMonthAmount -
        this.props.closedOrderStats.currentMonthService
      : 0;
    const prevMonthProfit = this.props.closedOrderStats
      ? this.props.closedOrderStats.prevMonthAmount -
        this.props.closedOrderStats.prevMonthService
      : 0;
    const profitPercent =
      (currentMonthProfit - prevMonthProfit) / prevMonthProfit;
    const profitOrders = this.props.closedOrderStats
      ? (this.props.closedOrderStats.currentMonthOrders -
          this.props.closedOrderStats.prevMonthOrders) /
        this.props.closedOrderStats.prevMonthOrders
      : 0;
    const columns = [
      {
        title: "Month-Year",
        dataIndex: "month_year",
        width: "20%",
        sorter: (a, b) => {
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        },
        sortDirections: ["descend", "ascend"],
        ...this.getColumnSearchProps("month_year")
      },
      {
        title: "Target",
        dataIndex: "amount",
        width: "10%"
      },
      {
        title: "Edit",
        key: "editItem",
        width: "10%",
        render: (text, record) => (
          <ColumnButton
            title={"Edit Item"}
            record={record}
            id={"editItem"}
            type={"primary"}
            handleClick={this.handleClick}
          />
        )
      },
      {
        title: "Delete",
        key: "delete",
        width: "10%",
        render: (text, record) => (
          <Popconfirm
            title="Are you sure you want to delete the item?"
            onConfirm={e => this.deleteItem(record, e)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
            {/* <a href="#">Mark Complete</a> */}
          </Popconfirm>
        )
      }
    ];

    return (
      <React.Fragment>
        <div
          style={{
            width: "auto",
            maxHeight: "100%",
            overflow: "auto",
            position: "absolute"
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            {this.props.auth ? (
              <Button
                key="signout"
                onClick={e => {
                  this.props.resetSateEvent();
                  this.props.history.push("/home");
                }}
                type="danger"
                style={{
                  width: 300,
                  height: 50,
                  top: 10,
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: 20
                }}
              >
                Sign Out
              </Button>
            ) : null}
          </div>
          <div style={{ padding: "30px" }}>
            <span>Total Orders Financial</span>
          </div>
          <div
            style={{
              marginTop: 0,
              paddingLeft: "30px",
              paddingRight: "30px",
              width: "100%"
            }}
          >
            <Row gutter={12}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Closed Orders"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.totalOrders
                        : 0
                    }
                    precision={0}
                    prefix={<Icon type="shopping-cart" />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Closed Order Amount"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.totalAmount
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="stock" />}
                    suffix="Rs"
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Expense On Closed Order"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.totalService
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="fall" />}
                    suffix="Rs"
                    valueStyle={{ color: "#F72230" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Profit Closed Orders"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.totalAmount -
                          this.props.closedOrderStats.totalService
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="rise" />}
                    suffix="Rs"
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
          <div style={{ padding: "30px" }}>
            <span>Completed Orders Financial</span>
          </div>
          <div
            style={{
              marginTop: 0,
              paddingLeft: "30px",
              paddingRight: "30px",
              width: "100%"
            }}
          >
            <Row gutter={12}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Complete (To be Closed) Order Count"
                    value={
                      this.props.nonClosedOrdStats
                        ? this.props.nonClosedOrdStats.totalOrders
                        : 0
                    }
                    precision={0}
                    prefix={<Icon type="shopping-cart" />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Complete (To be Closed) Order Amount"
                    value={
                      this.props.nonClosedOrdStats
                        ? this.props.nonClosedOrdStats.totalAmount
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="stock" />}
                    suffix="Rs"
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
          <div style={{ padding: "30px" }}>
            <span>OverDue Orders Financial</span>
          </div>
          <div
            style={{
              marginTop: 0,
              paddingLeft: "30px",
              paddingRight: "30px",
              width: "100%"
            }}
          >
            <Row gutter={12}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Current Month Over Due Order Count"
                    value={
                      this.props.overDueOrdStats
                        ? this.props.overDueOrdStats.currentMonthOrders
                        : 0
                    }
                    precision={0}
                    prefix={<Icon type="shopping-cart" />}
                    valueStyle={{ color: "#F72230" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Overdue Order Count"
                    value={
                      this.props.overDueOrdStats
                        ? this.props.overDueOrdStats.totalOrders
                        : 0
                    }
                    precision={0}
                    prefix={<Icon type="shopping-cart" />}
                    valueStyle={{ color: "#F72230" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Over Due Order Amount"
                    value={
                      this.props.overDueOrdStats
                        ? this.props.overDueOrdStats.overDueAmount
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="stock" />}
                    suffix="Rs"
                    valueStyle={{ color: "#F72230" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
          <div style={{ padding: "30px" }}>
            <span>Current Month Orders Financial</span>
          </div>
          <div
            style={{
              marginTop: 0,
              paddingLeft: "30px",
              paddingRight: "30px",
              width: "100%"
            }}
          >
            <Row gutter={12}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Current Month Closed Order Count"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.currentMonthOrders
                        : 0
                    }
                    precision={0}
                    prefix={<Icon type="shopping-cart" />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Current Month Over Due Order Count"
                    value={
                      this.props.overDueOrdStats
                        ? this.props.overDueOrdStats.currentMonthOrders
                        : 0
                    }
                    precision={0}
                    prefix={<Icon type="shopping-cart" />}
                    valueStyle={{ color: "#F72230" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Current Month Closed Order Amount"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.currentMonthAmount
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="stock" />}
                    suffix="Rs"
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Current Month Expense On Closed Order"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.currentMonthService
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="fall" />}
                    suffix="Rs"
                    valueStyle={{ color: "#F72230" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Current Month Profit Closed Orders"
                    value={
                      this.props.closedOrderStats
                        ? this.props.closedOrderStats.currentMonthAmount -
                          this.props.closedOrderStats.currentMonthService
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="rise" />}
                    suffix="Rs"
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Current Month Over Due Order Amount"
                    value={
                      this.props.overDueOrdStats
                        ? -(
                            this.props.overDueOrdStats
                              .currentMonthOverDueAmount +
                            this.props.overDueOrdStats.currentMonthService
                          )
                        : 0
                    }
                    precision={2}
                    prefix={<Icon type="stock" />}
                    suffix="Rs"
                    valueStyle={{ color: "#F72230" }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
          {/* <div style={{ padding: "30px", width: "100%" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Profit Stats from Previous Month Closed Orders"
                    value={profitPercent}
                    precision={2}
                    valueStyle={{
                      color: profitPercent > 0 ? "#3f8600" : "#cf1322"
                    }}
                    prefix={
                      profitPercent > 0 ? (
                        <Icon type="arrow-up" />
                      ) : (
                        <Icon type="arrow-down" />
                      )
                    }
                    suffix="%"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Order Stats from Previous Month Closed Orders"
                    value={profitOrders}
                    precision={2}
                    valueStyle={{
                      color: profitOrders > 0 ? "#3f8600" : "#cf1322"
                    }}
                    prefix={
                      profitOrders > 0 ? (
                        <Icon type="arrow-up" />
                      ) : (
                        <Icon type="arrow-down" />
                      )
                    }
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>
          </div> */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            {this.props.auth ? (
              <Button
                key="backup"
                onClick={e => {
                  this.props.backupDatabase();
                }}
                type="primary"
                style={{
                  width: 300,
                  height: 50,
                  top: 10,
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: 20
                }}
              >
                Backup Database
              </Button>
            ) : null}
          </div>
          <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Card
              title="Target List"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 1200,
                marginTop: 20,
                textAlign: "center",
                alignContent: "center"
              }}
            >
              <Select
                showSearch
                style={{ width: 400, top: 10, display: "inline-block" }}
                placeholder="Select Year"
                optionFilterProp="children"
                onChange={this.onChangeSelectBox}
                value={this.state.year}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {years.map(obj => (
                  <Option key={obj.value}>{obj.value}</Option>
                ))}
              </Select>
              <Button
                key="addItem"
                onClick={e =>
                  this.setState({
                    isAddItemModal: true,
                    isAddCategoryModal: false
                  })
                }
                type="primary"
                style={{
                  width: 200,
                  top: 10,
                  display: "inline-block",
                  marginLeft: 20
                }}
              >
                Add Item
              </Button>
              <Table
                style={{ marginTop: 20 }}
                columns={columns}
                dataSource={this.props.itemData}
                loading={this.props.fetching}
                scroll={{ y: 400 }}
              />
            </Card>
          </div>
          <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <ChartsPerFinance yearlyStats={[...this.props.yearlyOrdStats]} />
          </div>
          <ChartsPerMonthFinance
            yearlyStats={[...this.props.yearlyOrdStats]}
            onChangeSelectMonth={this.onChangeSelectMonth}
            chartMonth={this.state.chartMonth}
            year={this.state.year}
          />
          <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
            <Card
              style={{
                marginTop: 20
              }}
            >
              <OrderListPage showStatsButton={true} />
            </Card>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            {this.props.auth ? (
              <Button
                key="backup"
                onClick={e => {
                  this.props.updateItemExpense();
                }}
                type="primary"
                style={{
                  width: 300,
                  height: 50,
                  top: 10,
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: 20
                }}
              >
                Update Expense Items
              </Button>
            ) : null}
          </div>
          <this.ItemModal />
          <this.SignInModal />
        </div>
      </React.Fragment>
    );
  }
}

const ChartsPerMonthFinance = props => {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const chartMonth = props.chartMonth;
  const year = props.year;
  let totalAmountData = [];
  let serviceCharges = [];
  let itemExpense = [];
  let option = null;
  let overdueAmt = [];
  let target = [];
  let totalAmountMonth;
  let serviceChargesMonth;
  let itemExpenseMonth;
  let overdueMonth;
  let targetMonth;
  let yearlyStats = props.yearlyStats;

  const onChangeSelectMonth = props.onChangeSelectMonth;
  if (yearlyStats.length > 0) {
    const yAxis = yearlyStats[0];
    yearlyStats.shift();
    yearlyStats.forEach(arr => {
      months.push(arr[0]);
      totalAmountData.push(arr[1]);
      serviceCharges.push(arr[2]);
      itemExpense.push(arr[3]);
      overdueAmt.push(arr[4]);
      target.push(arr[5]);
    });
    const indexMonth = months.indexOf(chartMonth);
    totalAmountMonth = totalAmountData[indexMonth];
    serviceChargesMonth = serviceCharges[indexMonth];
    overdueMonth = overdueAmt[indexMonth];
    itemExpenseMonth = itemExpense[indexMonth];
    targetMonth = target[indexMonth];
    option = {
      tooltip: {
        trigger: "item"
      },
      legend: {
        top: "5%",
        left: "center"
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center"
          },

          labelLine: {
            show: false
          },
          data: [
            { value: totalAmountMonth, name: "Recieved Amount" },
            { value: serviceChargesMonth, name: "Service Charges" },
            { value: overdueMonth, name: "OverDue" },
            { value: itemExpenseMonth, name: "Item Expense" }
          ]
        }
      ]
    };
  } else {
    return null;
  }
  return (
    <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
      <Card
        title="Target List"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 1200,
          marginTop: 20,
          textAlign: "center",
          alignContent: "center"
        }}
      >
        <div>
          <Select
            showSearch
            style={{ width: 400, top: 10, display: "inline-block" }}
            placeholder="Select Month"
            onChange={onChangeSelectMonth}
            value={chartMonth}
          >
            {months.map(obj => (
              <Option key={obj}>
                {obj}
                {` ${year}`}
              </Option>
            ))}
          </Select>
        </div>
        <Row style={{ paddingTop: "10px" }}>
          <Col span={12}>
            <ReactECharts option={option} />
          </Col>
          <Col span={12}>
            <div
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Row>
                <Col span={8}>
                  <div
                    style={{
                      flexDirection: "column",
                      display: "flex"
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#4359b9",
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
                      <label style={{ color: "#FFFFFF" }}>
                        Recieved Amount
                      </label>
                      <label style={{ color: "#FFFFFF" }}>
                        {totalAmountMonth}
                      </label>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#81c463",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #e8e8e8",
                        borderRadius: 10,
                        margin: 10
                      }}
                    >
                      <label style={{ color: "#FFFFFF" }}>Service Amount</label>
                      <label style={{ color: "#FFFFFF" }}>
                        {serviceChargesMonth}
                      </label>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#f7bf47",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #e8e8e8",
                        borderRadius: 10,
                        margin: 10
                      }}
                    >
                      <label style={{ color: "#FFFFFF" }}>OverDue Amount</label>
                      <label style={{ color: "#FFFFFF" }}>{overdueMonth}</label>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    style={{
                      flexDirection: "column",
                      display: "flex"
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#d8494e",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #e8e8e8",
                        borderRadius: 10,
                        margin: 10
                      }}
                    >
                      <label style={{ color: "#FFFFFF" }}>Item Expense</label>
                      <label style={{ color: "#FFFFFF" }}>
                        {itemExpenseMonth}
                      </label>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#fe9a18",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #e8e8e8",
                        borderRadius: 10,
                        margin: 10
                      }}
                    >
                      <label style={{ color: "#FFFFFF" }}>
                        Current Wallet Profit
                      </label>
                      <label style={{ color: "#FFFFFF" }}>
                        {totalAmountMonth -
                          serviceChargesMonth -
                          itemExpenseMonth}
                      </label>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#1878fe",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #e8e8e8",
                        borderRadius: 10,
                        margin: 10
                      }}
                    >
                      <label style={{ color: "#FFFFFF" }}>Total Amount</label>
                      <label style={{ color: "#FFFFFF" }}>
                        {totalAmountMonth + overdueMonth}
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <div
                    style={{
                      flexDirection: "column",
                      display: "flex"
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#4359b9",
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
                      <label style={{ color: "#FFFFFF" }}>
                        Estimated Profit
                      </label>
                      <label style={{ color: "#FFFFFF" }}>
                        {totalAmountMonth +
                          overdueMonth -
                          serviceChargesMonth -
                          itemExpenseMonth}
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const ChartsPerFinance = props => {
  let months = [];
  let totalAmountData = [];
  let totAmount = [];
  let serviceCharges = [];
  let overdueAmt = [];
  let itemExpense = [];
  let target = [];
  let profit = [];
  const yearlyStats = props.yearlyStats;
  if (yearlyStats.length > 0) {
    const yAxis = yearlyStats[0];
    yearlyStats.shift();
    yearlyStats.forEach(arr => {
      months.push(arr[0]);
      totalAmountData.push(arr[1]);
      serviceCharges.push(arr[2]);
      itemExpense.push(arr[3]);
      overdueAmt.push(arr[4]);
      target.push(arr[5]);
      totAmount.push(arr[1] + arr[4]);
      profit.push(arr[1] + arr[4] - arr[2] - arr[3]);
    });

    let series = [
      {
        name: "Recieved Amount",
        type: "bar",
        data: totalAmountData
      },
      {
        name: "Service Charges",
        type: "bar",
        data: serviceCharges
      },
      {
        name: "OverDue Amount",
        type: "bar",
        data: overdueAmt
      },
      {
        name: "Item Expense",
        type: "bar",
        data: itemExpense
      },
      {
        name: "Total Amount",
        type: "line",
        data: totAmount
      },
      {
        name: "Profit",
        type: "line",
        data: profit
      }
    ];

    let series1 = [
      {
        name: "Profit",
        type: "bar",
        data: profit
      },
      {
        name: "Target",
        type: "line",
        data: target
      }
    ];

    const option = {
      title: {
        text: "Yearly Stats"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, 0.01]
      },
      xAxis: {
        type: "category",
        data: months
      },
      series: series
    };

    const option1 = {
      title: {
        text: "Targets and Profit"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, 0.01]
      },
      xAxis: {
        type: "category",
        data: months
      },
      series: series1
    };

    return (
      <Fragment>
        <Card
          title="Monthly Chart"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: 1200,
            marginTop: 20,
            textAlign: "center",
            alignContent: "center"
          }}
        >
          <ReactECharts option={option} />
        </Card>
        <Card
          title="Monthly Chart"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: 1200,
            marginTop: 20,
            textAlign: "center",
            alignContent: "center"
          }}
        >
          <ReactECharts option={option1} />
        </Card>
      </Fragment>
    );
  } else {
    return null;
  }
  return null;
};

function mapStateToProps(state) {
  //console.log("here Create Event Page", state);
  return {
    itemData: state.targets ? state.targets.data : [],
    signInModal: state.targets.signInModal || false,
    signInError: state.targets.signInError || "",
    closedOrderStats: state.targets.closeOrdStats,
    nonClosedOrdStats: state.targets.nonClosedOrdStats,
    overDueOrdStats: state.targets.overDueOrdStats,
    yearlyOrdStats: state.targets.yearlyOrdStats
      ? state.targets.yearlyOrdStats.respArray
      : [],
    auth: state.targets.auth || "",
    fetching: state.drafts ? state.drafts.fetching : fasle
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchTargets: fetchTargets,
      createTarget: createTarget,
      deleteTarget: deleteTarget,
      backupDatabase: backupDatabase,
      updateItemExpense: updateItemExpense,
      resetSateEvent: resetSateEvent
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TargetListPage);
