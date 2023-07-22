import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import routes from "../constants/routes";
import { printOrders, resetPrintState } from "../actions/orders";
import {
  Modal,
  DatePicker,
  Button,
  Card,
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  AutoComplete,
  Tabs,
  Spin,
  Result,
  Alert
} from "antd";
import moment from "moment";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createEvent, resetSateEvent } from "../actions/createEvent";
import { createDraft } from "../actions/drafts";
import { fetchItems, resetSate } from "../actions/eventItem";
import {
  SpinnerComponent,
  AlertErrorFieldComponent,
  OrderSubmitButton,
  DraftSubmitButton,
  OrderFailureAlert,
  OrderSuccessAlert
} from "../utils/common";
import OrderCostPage from "./OrderCostPage";
import EventDate from "./EventDatePage";

const { TextArea } = Input;

const { TabPane } = Tabs;

class OrderCustomerPage extends Component {
  constructor(props) {
    super();
    this.state = {
      mobileNumber: "",
      altNumber: "",
      discount: 0,
      vehicleCharges: 0,
      balanceAmount: 0,
      receivedAmount: 0,
      totalAmount: 0,
      grossAmount: 0,
      itemExpense: 0,
      itemCalculationExpense: 0,
      isDraft: null,
      draftTitle: null,
      serviceExpense: 0,
      customerName: "",
      customerAddress: "",
      locationAddress: "",
      noOfPerson: "",
      perHeadAmount: "",
      itemCalculationAmount: "",
      draftId: "",
      duplicateOrderId: "",
      tabSelect: "1",
      isOrderProcessModal: false,
      isOrderProcessDraftModal: false,
      isShow: false,
      redirectOnProcessedOrder: false,
      disableShowButton: true,
      showCustomerInfo: false,
      orderTitle: "",
      disableDate: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.orderCost !== state.grossAmount && state.tabSelect !== "2") {
      const discount = state.discount ? parseFloat(state.discount) : 0;
      const receivedAmount = state.receivedAmount
        ? parseFloat(state.receivedAmount)
        : 0;
      const vehicleCharges = state.vehicleCharges
        ? parseFloat(state.vehicleCharges)
        : 0;
      return {
        grossAmount: props.orderCost,
        itemExpense: props.itemExpense,
        itemCalculationExpense: props.itemExpense,
        totalAmount: parseFloat(props.orderCost) - discount + vehicleCharges,
        balanceAmount:
          parseFloat(props.orderCost) -
          discount +
          vehicleCharges -
          receivedAmount,
        itemCalculationAmount: props.orderCost
      };
    } else if (props.isOrderProcessModal !== state.isOrderProcessModal) {
      return {
        isOrderProcessModal: props.isOrderProcessModal
      };
    } else if (
      props.isOrderProcessDraftModal !== state.isOrderProcessDraftModal
    ) {
      return {
        isOrderProcessDraftModal: props.isOrderProcessDraftModal
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  componentDidMount() {
    const props = this.props.location.state;
    const disableDate = props.disableDate ? props.disableDate : false;
    this.updateStateFromProps(props.record, disableDate);
  }

  updateStateFromProps = (record, disableDate) => {
    console.log("rec  updateStateFromProps ", record);
    let customerObj = {};
    if (record.duplicateOrderId) {
      customerObj = record.order_customer;
    } else {
      customerObj = record.draft_customer;
    }
    this.setState({
      draftTitle: record.draft_title || "",
      customerName: customerObj.customer_name,
      mobileNumber: customerObj.customer_number
        ? customerObj.customer_number.substr(1)
        : "",
      altNumber: customerObj.alternate_number
        ? customerObj.alternate_number.substr(1)
        : "",
      customerAddress: customerObj.customer_address,
      locationAddress: record.location_address,
      discount: record.discount,
      receivedAmount: record.received_amount,
      serviceExpense: record.service_expense,
      itemExpense: record.expense_items,
      itemCalculationExpense: record.expense_items,
      perHeadAmount: record.per_head_amount,
      noOfPerson: record.no_of_person,
      tabSelect: record.per_head_amount ? "2" : "1",
      grossAmount: record.gross_amount,
      totalAmount: record.total_amount,
      duplicateOrderId: record.duplicateOrderId,
      isDraft: true,
      balanceAmount: record.balance_amount,
      itemCalculationAmount: record.gross_amount,
      draftId: record.id,
      vehicleCharges: record.vehicle_charges,
      disableDate: disableDate
    });
  };

  componentWillUnmount() {
    this.props.resetSate();
    this.props.resetSateEvent();
    this.props.resetPrintState();
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

    if (e.target.id == "discount") {
      this.setState({
        totalAmount:
          this.state.grossAmount -
          parseFloat(inputNumber) +
          parseFloat(this.state.vehicleCharges),
        balanceAmount:
          this.state.grossAmount -
          parseFloat(this.state.receivedAmount) -
          parseFloat(inputNumber) +
          parseFloat(this.state.vehicleCharges)
      });
    } else if (e.target.id == "vehicleCharges") {
      this.setState({
        totalAmount:
          this.state.grossAmount -
          parseFloat(this.state.discount) +
          parseFloat(inputNumber),
        balanceAmount:
          this.state.grossAmount -
          parseFloat(this.state.receivedAmount) -
          parseFloat(this.state.discount) +
          parseFloat(inputNumber)
      });
    } else if (e.target.id == "receivedAmount") {
      this.setState({
        balanceAmount:
          this.state.grossAmount -
          parseFloat(this.state.discount) +
          parseFloat(this.state.vehicleCharges) -
          parseFloat(inputNumber)
      });
    } else if (e.target.id == "noOfPerson") {
      if (this.state.perHeadAmount) {
        ////console.log("noOfPerson alertPerHeadAmount", this.state.perHeadAmount);
        ////console.log(" noOfPerson alertNoOfPerson", this.state.noOfPerson);
        this.setState({
          grossAmount:
            parseFloat(this.state.perHeadAmount) * parseInt(inputNumber)
        });
      }
    } else if (e.target.id == "perHeadAmount") {
      if (this.state.noOfPerson) {
        this.setState({
          grossAmount:
            parseFloat(inputNumber) * parseInt(this.state.noOfPerson),
          totalAmount:
            parseFloat(inputNumber) * parseInt(this.state.noOfPerson),
          balanceAmount:
            parseFloat(inputNumber) * parseInt(this.state.noOfPerson)
        });
      }
    }
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleOk = async e => {
    //console.log(e);
    let orderPromise = this.props.createEvent(
      this.props.orderedData,
      this.props.startDate,
      this.props.endDate,
      this.state
    );
    this.setState({
      isOrderProcessModal: true
    });
  };

  handleOrderModalOk = e => {
    this.setState({
      redirectOnProcessedOrder: true
    });
  };

  handleOkDraft = async e => {
    //console.log(e);
    let orderPromise = this.props.createDraft(
      this.props.orderedData,
      this.props.startDate,
      this.props.endDate,
      this.state
    );
    this.setState({
      isOrderProcessDraftModal: true
    });
  };

  handlePrintDraft = e => {
    this.props.printOrders({
      orderInfo: {
        order: { ...this.props.draft.draft, isDraft: true },
        customer: { ...this.props.draft.customer }
      },
      orderedData: this.props.orderedData
    });
  };

  handleOrderModalCancel = e => {
    if (this.props.isError) {
      this.setState({
        isOrderProcessModal: false,
        isOrderProcessDraftModal: false
      });
    } else {
      this.setState({
        redirectOnProcessedOrder: true
      });
    }
  };

  handlePrint = e => {
    this.props.printOrders({
      orderInfo: this.props.order,
      orderedData: this.props.orderedData
    });
  };

  onTabChange = key => {
    if (key == 1) {
      const discount = this.state.discount
        ? parseFloat(this.state.discount)
        : 0;
      const receivedAmount = this.state.receivedAmount
        ? parseFloat(this.state.receivedAmount)
        : 0;
      const vehicleCharges = this.state.vehicleCharges
        ? parseFloat(this.state.vehicleCharges)
        : 0;
      this.setState({
        tabSelect: key,
        grossAmount: this.state.itemCalculationAmount,
        itemExpense: this.state.itemCalculationExpense,
        totalAmount:
          parseFloat(this.state.itemCalculationAmount) -
          discount +
          vehicleCharges,
        balanceAmount:
          parseFloat(this.state.itemCalculationAmount) -
          discount +
          vehicleCharges -
          receivedAmount
      });
    } else if (key == 2) {
      if (this.state.noOfPerson && this.state.perHeadAmount) {
        this.setState({
          grossAmount:
            parseFloat(this.state.perHeadAmount) *
            parseInt(this.state.noOfPerson),
          totalAmount:
            parseFloat(this.state.perHeadAmount) *
            parseInt(this.state.noOfPerson),
          balanceAmount:
            parseFloat(this.state.perHeadAmount) *
            parseInt(this.state.noOfPerson),
          itemExpense: 0,
          tabSelect: key
        });
      } else {
        this.setState({
          grossAmount: 0,
          totalAmount: 0,
          balanceAmount: 0,
          itemExpense: 0,
          tabSelect: key
        });
      }
    }
  };

  OrderCreationModal = props => {
    let screen = null;
    const printURL = props.printURL.filename ? props.printURL.filename : "";
    if (props.isError) {
      screen = <OrderFailureAlert title={"order"} />;
    } else if (!_.isEmpty(props.order)) {
      let data = {
        orderNo: `ORD - 1000${props.order.order.id}`,
        customer: props.order.customer.customer_name,
        eventDate: props.order.order.event_date,
        totalAmount: props.order.order.total_amount,
        dueAmount: props.order.order.is_due_amount
      };
      screen = <OrderSuccessAlert {...data} />;
    }
    return (
      <Modal
        title="Order Creation Status"
        visible={this.state.isOrderProcessModal}
        footer={[
          <Button
            key="print"
            type="warning"
            onClick={this.handlePrint}
            disabled={props.isError}
          >
            Print the Order
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOrderModalOk}>
            List Page
          </Button>,
          <Button
            key="back"
            disabled={!_.isEmpty(props.order)}
            onClick={this.handleOrderModalCancel}
          >
            Cancel
          </Button>
        ]}
      >
        {this.props.isPendingOrderCreation ? <Spin size="large" /> : screen}
        {printURL ? (
          <label>
            Document Link:
            <a style={{ color: "#000000" }} href={printURL}>
              {printURL}
            </a>
          </label>
        ) : null}
      </Modal>
    );
  };

  DraftCreationModal = props => {
    let screen = null;
    if (props.isError) {
      screen = <OrderFailureAlert title={"draft"} />;
    } else if (!_.isEmpty(props.order)) {
      let data = {
        orderNo: `DRT - 1000${props.order.draft.id}`,
        customer: props.order.customer.customer_name,
        eventDate: props.order.draft.event_date,
        totalAmount: props.order.draft.total_amount,
        dueAmount: props.order.draft.is_due_amount
      };
      screen = <OrderSuccessAlert {...data} />;
    }
    return (
      <Modal
        title="Order Creation Status"
        visible={this.state.isOrderProcessDraftModal}
        footer={[
          <Button
            key="print"
            type="warning"
            onClick={this.handlePrintDraft}
            disabled={props.isError}
          >
            Print the Order
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOrderModalOk}>
            List Page
          </Button>,
          <Button
            key="back"
            disabled={!_.isEmpty(props.order)}
            onClick={this.handleOrderModalCancel}
          >
            Cancel
          </Button>
        ]}
      >
        {this.props.isPendingOrderDraftCreation ? (
          <Spin size="large" />
        ) : (
          screen
        )}
      </Modal>
    );
  };
  onCloseModal = e => {
    this.setState({
      disableShowButton: false
    });
  };

  render() {
    const alertBoxName = this.state.customerName;
    const alertBoxNumber = this.state.mobileNumber;
    const alertBoxAddress = this.state.customerAddress;
    const alertBoxLocationAddress = this.state.locationAddress;
    const alertPerHeadAmount = this.state.perHeadAmount;
    const alertNoOfPerson = this.state.noOfPerson;
    const tabSelect = this.state.tabSelect;

    if (this.state.redirectOnProcessedOrder) {
      return <Redirect to={routes.HOME} />;
    } else {
      return (
        <div>
          <Card
            title="Order Booking Page"
            style={{
              width: "80%",
              maxHeight: "100%",
              overflow: "auto",
              position: "absolute"
            }}
          >
            {this.state.disableDate ? (
              <Input
                id="eventDate"
                disabled
                value={this.props.startDate + " " + this.props.endDate}
                style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
              />
            ) : (
              <EventDate />
            )}

            <OrderCostPage
              disableDate={this.state.disableDate}
              draftId={this.state.draftId}
              duplicateOrderId={this.state.duplicateOrderId}
              startDate={this.props.startDate}
              isEventUpdate={this.state.isUpdateEvent}
              afterClose={this.onCloseModal}
            />
            <Button
              type="danger"
              disabled={this.state.disableShowButton}
              onClick={e => {
                this.setState({ showCustomerInfo: true });
              }}
              style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
            >
              Show Customer Info Form
            </Button>

            {this.state.showCustomerInfo ? (
              <div>
                <Input
                  id="customerName"
                  addonBefore="Name"
                  value={this.state.customerName}
                  style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
                  onChange={this.handleChange}
                  placeholder="Customer Name"
                  required
                />
                <AlertErrorFieldComponent validateField={alertBoxName} />
                <Input
                  id="mobileNumber"
                  addonBefore="Cell Number"
                  prefix="0"
                  value={this.state.mobileNumber}
                  onChange={this.handleNumberChange}
                  style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
                  placeholder="Phone Number"
                />
                <AlertErrorFieldComponent validateField={alertBoxNumber} />
                <Input
                  id="altNumber"
                  addonBefore="Alternate Number"
                  disabled={this.state.isUpdateEvent}
                  prefix="0"
                  value={this.state.altNumber}
                  onChange={this.handleNumberChange}
                  style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
                  placeholder="Alternate Number"
                />
                <p style={{ marginRight: "3%", marginTop: "3%" }}>
                  <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                    Customer Address:
                  </span>
                  <TextArea
                    id="customerAddress"
                    value={this.state.customerAddress}
                    onChange={this.handleChange}
                    style={{ width: "100%" }}
                    placeholder="Customer Address"
                    autosize={{ minRows: 1, maxRows: 2 }}
                  />
                </p>
                <AlertErrorFieldComponent validateField={alertBoxAddress} />

                <p style={{ marginRight: "3%", marginTop: "3%" }}>
                  <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                    Location Address:
                  </span>
                  <TextArea
                    id="locationAddress"
                    value={this.state.locationAddress}
                    onChange={this.handleChange}
                    style={{ width: "100%" }}
                    placeholder="Location Address"
                    autosize={{ minRows: 1, maxRows: 2 }}
                  />
                </p>
                <AlertErrorFieldComponent
                  validateField={alertBoxLocationAddress}
                />
                <Tabs
                  defaultActiveKey={this.state.tabSelect}
                  activeKey={this.state.tabSelect}
                  onChange={this.onTabChange}
                >
                  <TabPane tab="Per Item Calculation" key="1">
                    <div style={{ flexDirection: "row", marginTop: "3%" }}>
                      <Input
                        id="grossAmount"
                        addonBefore="Gross Amount"
                        value={this.state.grossAmount}
                        style={{
                          width: "30%",
                          marginRight: "3%"
                        }}
                        placeholder="Total Gross Cost"
                        disabled
                      />
                      <Input
                        id="discount"
                        addonBefore="Discount"
                        value={this.state.discount}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "30%",
                          marginRight: "3%"
                        }}
                        placeholder="Discount"
                      />
                      <Input
                        id="vehicleCharges"
                        addonBefore="Vehicle Charges"
                        value={this.state.vehicleCharges}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "30%",
                          marginRight: "3%"
                        }}
                        placeholder="Vehicle Charges"
                      />
                    </div>
                    <Input
                      id="totalAmount"
                      addonBefore="Total Amount"
                      value={this.state.totalAmount}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Total Amount"
                      disabled
                    />
                    <Input
                      id="receivedAmount"
                      addonBefore="Received Amount"
                      value={this.state.receivedAmount}
                      onChange={this.handleNumberChange}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Received Amount"
                    />
                    <Input
                      id="balanceAmount"
                      addonBefore="Balance Amount"
                      value={this.state.balanceAmount}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Balance Amount"
                      disabled
                    />
                    <Input
                      id="serviceExpense"
                      addonBefore="Service Expense"
                      value={this.state.serviceExpense}
                      onChange={this.handleNumberChange}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Service Expenses"
                    />
                    <Input
                      id="itemExpense"
                      addonBefore="Items of Expense"
                      value={this.props.itemExpense}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Items of Expense"
                      disabled
                    />
                  </TabPane>
                  <TabPane tab="Per Person Calculation" key="2">
                    <div style={{ flexDirection: "row", marginTop: "3%" }}>
                      <div>
                        <Input
                          id="noOfPerson"
                          addonBefore="No of Person"
                          value={this.state.noOfPerson}
                          onChange={this.handleNumberChange}
                          style={{
                            width: "90%",
                            marginRight: "3%"
                          }}
                          placeholder="No Of Person"
                        />
                        <AlertErrorFieldComponent
                          validateField={alertNoOfPerson}
                          additionalCondition={tabSelect == "2"}
                        />
                      </div>
                      <div>
                        <Input
                          id="perHeadAmount"
                          addonBefore="Per Head"
                          value={this.state.perHeadAmount}
                          onChange={this.handleNumberChange}
                          style={{
                            width: "90%",
                            marginRight: "3%",
                            marginTop: "10px"
                          }}
                          placeholder="Per Head"
                        />
                        <AlertErrorFieldComponent
                          validateField={alertPerHeadAmount}
                          additionalCondition={tabSelect == "2"}
                        />
                      </div>
                    </div>
                    <div style={{ flexDirection: "row", marginTop: "3%" }}>
                      <Input
                        id="grossAmount"
                        addonBefore="Gross Amount"
                        value={this.state.grossAmount}
                        style={{
                          width: "30%",
                          marginRight: "3%"
                        }}
                        placeholder="Total Gross Cost"
                        disabled
                      />
                      <Input
                        id="discount"
                        addonBefore="Discount"
                        value={this.state.discount}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "30%",
                          marginRight: "3%"
                        }}
                        placeholder="Discount"
                      />
                      <Input
                        id="vehicleCharges"
                        addonBefore="Vehicle Charges"
                        value={this.state.vehicleCharges}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "30%",
                          marginRight: "3%"
                        }}
                        placeholder="Vehicle Charges"
                      />
                    </div>
                    <Input
                      id="totalAmount"
                      addonBefore="Total Amount"
                      value={this.state.totalAmount}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Total Amount"
                      disabled
                    />
                    <Input
                      id="receivedAmount"
                      addonBefore="Received Amount"
                      value={this.state.receivedAmount}
                      onChange={this.handleNumberChange}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Received Amount"
                    />
                    <Input
                      id="balanceAmount"
                      addonBefore="Balance Amount"
                      value={this.state.balanceAmount}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Balance Amount"
                      disabled
                    />
                    <Input
                      id="serviceExpense"
                      addonBefore="Service Expense"
                      value={this.state.serviceExpense}
                      onChange={this.handleNumberChange}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Service Expenses"
                    />
                    <Input
                      id="itemExpense"
                      addonBefore="Items of Expense"
                      value={0}
                      style={{
                        width: "90%",
                        marginRight: "3%",
                        marginTop: "3%"
                      }}
                      placeholder="Items of Expense"
                      disabled
                    />
                  </TabPane>
                </Tabs>
                <Input
                  id="orderTitle"
                  addonBefore="Order Title"
                  value={this.state.orderTitle}
                  style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
                  onChange={this.handleChange}
                  placeholder="Order Title"
                />
                <OrderSubmitButton
                  alertBoxName={alertBoxName}
                  alertBoxNumber={alertBoxNumber}
                  alertBoxAddress={alertBoxAddress}
                  alertBoxLocationAddress={alertBoxLocationAddress}
                  orderTitle={this.state.orderTitle}
                  alertPerHeadAmount={alertPerHeadAmount}
                  alertNoOfPerson={alertNoOfPerson}
                  tabSelect={tabSelect == "2"}
                  showModal={this.handleOk}
                />
                <Input
                  id="draftTitle"
                  addonBefore="Draft Title"
                  value={this.state.draftTitle}
                  style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
                  onChange={this.handleChange}
                  placeholder="Draft Title"
                />

                <DraftSubmitButton
                  alertBoxName={alertBoxName}
                  alertBoxNumber={alertBoxNumber}
                  alertBoxAddress={alertBoxAddress}
                  alertTitle={this.state.draftTitle}
                  alertPerHeadAmount={alertPerHeadAmount}
                  alertNoOfPerson={alertNoOfPerson}
                  tabSelect={tabSelect == "2"}
                  showModal={this.handleOkDraft}
                />
                <Button
                  type="danger"
                  style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
                >
                  <Link to={routes.EVENTITEMPAGE}>Back</Link>
                </Button>

                <this.OrderCreationModal
                  isError={this.props.isError}
                  isPendingOrderCreation={this.props.isPendingOrderCreation}
                  order={this.props.order}
                  printURL={this.props.printURL}
                />
                <this.DraftCreationModal
                  isError={this.props.isDraftError}
                  isPendingOrderCreation={
                    this.props.isPendingOrderDraftCreation
                  }
                  order={this.props.draft}
                />
              </div>
            ) : null}
          </Card>
        </div>
      );
    }
  }
}
const moveToNextPage = () => {};

function mapStateToProps(state) {
  ////console.log("state order customer page", state);
  return {
    startDate: state.createEvent ? state.createEvent.eventStartDate : "",
    endDate: state.createEvent ? state.createEvent.eventEndDate : "",
    orderCost: state.eventItems ? state.eventItems.orderCost : 0,
    itemExpense: state.eventItems ? state.eventItems.itemExpense : 0,
    orderedData: state.eventItems.orderedData
      ? state.eventItems.orderedData
      : [],
    isOrderProcessModal: state.createEvent.isOrderProcessModal,
    isPendingOrderCreation: state.createEvent
      ? state.createEvent.isPendingOrderCreation
      : false,
    printURL: state.print ? state.print.url : { filename: "" },
    isDraftError: state.drafts ? state.drafts.isError : "",
    isError: state.createEvent ? state.createEvent.isError : "",
    order: state.createEvent.order ? state.createEvent.order : null,
    draft: state.drafts.draft ? state.drafts.draft : null,
    isOrderProcessDraftModal: state.drafts.isOrderProcessModal,
    isPendingOrderDraftCreation: state.drafts
      ? state.drafts.isPendingOrderCreation
      : false,
    isDraftError: state.drafts ? state.drafts.isError : ""
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createEvent: createEvent,
      createDraft: createDraft,
      resetSate: resetSate,
      resetSateEvent: resetSateEvent,
      printOrders: printOrders,
      resetPrintState: resetPrintState
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCustomerPage);
