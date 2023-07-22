import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import routes from "../constants/routes";
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
import { createDraft, resetSateDraft } from "../actions/drafts";
import { printOrders, resetPrintState } from "../actions/orders";
import { prepareUpdateEvent } from "../actions/createEvent";
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
      isUpdateEvent: null,
      draftTitle: null,
      serviceExpense: 0,
      customerName: "",
      customerAddress: "",
      locationAddress: "",
      noOfPerson: "",
      perHeadAmount: "",
      itemCalculationAmount: "",
      orderId: "",
      customerId: "",
      tabSelect: "1",
      isOrderProcessModal: false,
      isOrderProcessDraftModal: false,
      isShow: false,
      redirectOnProcessedOrder: false,
      disableShowButton: true,
      showCustomerInfo: false,
      orderTitle: "",
      enableEditDate: false,
      enableEditDateField: false,
      disableEditCheck: false,
      disableItemsButton: false,
      recordObjDatabase: "",
      dateItemsUpdate: false,
      disableItemsUpdate: true
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
      props.isOrderProcessDraftModal !== state.isOrderProcessDraftModal &&
      props.isDraft
    ) {
      return {
        isOrderProcessDraftModal: props.isOrderProcessDraftModal
      };
    }

    if (props.isEventUpdate && props.customerObj) {
      console.log("update Order", props);
      return {
        customerName: props.customerObj.customer_name,
        customerAddress: props.customerObj.customer_address,
        mobileNumber: props.customerObj.customer_number
          ? props.customerObj.customer_number.substr(1)
          : "",
        altNumber: props.customerObj.alternate_number
          ? props.customerObj.alternate_number.substr(1)
          : "",
        discount: props.updateOrderDetail.discount,
        receivedAmount: props.updateOrderDetail.received_amount,
        serviceExpense: props.updateOrderDetail.service_expense,
        itemExpense: props.updateOrderDetail.expense_items,
        itemCalculationExpense: props.updateOrderDetail.expense_items,
        perHeadAmount: props.updateOrderDetail.per_head_amount,
        noOfPerson: props.updateOrderDetail.no_of_person,
        orderTitle: props.updateOrderDetail.order_title,
        locationAddress: props.updateOrderDetail.location_address,
        tabSelect: props.updateOrderDetail.per_head_amount ? "2" : "1",
        grossAmount: props.updateOrderDetail.gross_amount,
        totalAmount: props.updateOrderDetail.total_amount,
        isUpdateEvent: props.isEventUpdate,
        balanceAmount: props.updateOrderDetail.balance_amount,
        itemCalculationAmount: props.updateOrderDetail.gross_amount,
        orderId: props.updateOrderDetail.id,
        customerId: props.updateOrderDetail.customer_id,
        vehicleCharges: props.updateOrderDetail.vehicle_charges
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  componentDidMount() {
    // let itemsPromise = this.props.fetchItems();
    const recordObjDb = this.props.location.state;
    const recordObjDatabase = recordObjDb ? recordObjDb.record : null;
    this.setState({
      recordObjDatabase: recordObjDatabase
    });
  }

  componentWillUnmount() {
    this.props.resetSate();
    this.props.resetSateEvent();
    this.props.resetSateDraft();
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

  handleCancel = e => {
    ////console.log(e);
    this.setState({
      isShow: false
    });
  };

  handleOrderModalOk = e => {
    this.setState({
      redirectOnProcessedOrder: true
    });
  };

  handlePrint = e => {
    this.props.printOrders({
      orderInfo: this.props.order,
      orderedData: this.props.orderedData
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
    let printURL = "";
    if (props.printURL) {
      printURL = props.printURL.filename ? props.printURL.filename : "";
    }
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
        title="Draft Creation Status"
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
      disableEditCheck: true
    });
  };
  onTriggerCustomerInfo = e => {
    this.setState({
      disableShowButton: false
    });
  };
  onUpdateEditStatus = dateStrings => {
    this.setState({
      enableEditDate: false,
      disableItemsButton: false,
      disableItemsUpdate: false
    });
    const recordObj = this.props.location.state;
    const record = recordObj ? recordObj.record : null;
    if (record && dateStrings.length > 0) {
      record.event_date = dateStrings[0] + " " + dateStrings[1];

      this.props.prepareUpdateEvent(record);
    }
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
            {this.state.isUpdateEvent && !this.state.enableEditDate ? (
              <Input
                id="eventDate"
                disabled
                value={this.props.startDate + " " + this.props.endDate}
                style={{ width: "100%", marginRight: "3%", marginTop: "3%" }}
              />
            ) : (
              <div>
                <EventDate
                  onUpdateEditStatus={this.onUpdateEditStatus}
                  isUpdateEvent={this.state.isUpdateEvent}
                />
              </div>
            )}
            {this.state.isUpdateEvent ? (
              <Fragment>
                <div style={{ flexDirection: "row", marginTop: "3%" }}>
                  <Checkbox
                    checked={this.state.enableEditDate}
                    style={{
                      width: "45%"
                    }}
                    disabled={this.state.disableEditCheck}
                    onChange={() => {
                      if (this.state.enableEditDate) {
                        this.setState({
                          enableEditDate: false,
                          disableItemsButton: false
                        });
                      } else {
                        this.setState({
                          enableEditDate: true,
                          disableItemsButton: true
                        });
                      }
                    }}
                  >
                    Click to Edit Date
                  </Checkbox>
                  <Checkbox
                    checked={this.state.dateItemsUpdate}
                    style={{
                      width: "45%"
                    }}
                    disabled={this.state.disableItemsUpdate}
                    onChange={() => {
                      if (this.state.dateItemsUpdate) {
                        this.setState({
                          dateItemsUpdate: false
                        });
                      } else {
                        this.setState({
                          dateItemsUpdate: true
                        });
                      }
                    }}
                  >
                    Click on Checkbox to update date on all Items
                  </Checkbox>
                </div>
              </Fragment>
            ) : null}

            <OrderCostPage
              startDate={this.props.startDate}
              isEventUpdate={this.state.isUpdateEvent}
              afterClose={this.onCloseModal}
              disableItemsButton={this.state.disableItemsButton}
              enableCustomerInfo={this.onTriggerCustomerInfo}
              dateItemsUpdate={this.state.dateItemsUpdate}
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
                  disabled={this.state.isUpdateEvent}
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
                  disabled={this.state.isUpdateEvent}
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

                <p>
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

                <p>
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
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "3%"
                      }}
                    >
                      <Input
                        id="grossAmount"
                        addonBefore="Gross Amount"
                        value={this.state.grossAmount}
                        style={{
                          width: "33%"
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
                          width: "33%",
                        }}
                        placeholder="Discount"
                      />
                      <Input
                        id="vehicleCharges"
                        addonBefore="Vehicle Charges"
                        value={this.state.vehicleCharges}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "33%",
                        }}
                        placeholder="Vehicle Charges"
                      />
                    </div>
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "3%"
                      }}
                    >
                      <Input
                        id="totalAmount"
                        addonBefore="Total Amount"
                        value={this.state.totalAmount}
                        style={{
                          width: "49%"
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
                          width: "49%"
                        }}
                        placeholder="Received Amount"
                      />
                    </div>

                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "3%"
                      }}
                    >
                      <Input
                        id="serviceExpense"
                        addonBefore="Service Expense"
                        value={this.state.serviceExpense}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "49%"
                        }}
                        placeholder="Service Expenses"
                      />
                      <Input
                        id="itemExpense"
                        addonBefore="Items of Expense"
                        value={this.props.itemExpense}
                        style={{
                          width: "49%"
                        }}
                        placeholder="Items of Expense"
                        disabled
                      />
                    </div>
                    <Input
                      id="balanceAmount"
                      addonBefore="Balance Amount"
                      value={this.state.balanceAmount}
                      style={{
                        width: "100%",
                        marginTop: "3%"
                      }}
                      placeholder="Balance Amount"
                      disabled
                    />
                  </TabPane>
                  <TabPane tab="Per Person Calculation" key="2">
                    <div
                      style={{
                        flexDirection: "row",
                        marginTop: "3%",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <div style={{ width: "49%" }}>
                        <Input
                          id="noOfPerson"
                          addonBefore="No of Person"
                          value={this.state.noOfPerson}
                          onChange={this.handleNumberChange}
                          style={{
                            width: "100%"
                          }}
                          placeholder="No Of Person"
                        />
                        <AlertErrorFieldComponent
                          validateField={alertNoOfPerson}
                          additionalCondition={tabSelect == "2"}
                        />
                      </div>
                      <div style={{ width: "49%" }}>
                        <Input
                          id="perHeadAmount"
                          addonBefore="Per Head"
                          value={this.state.perHeadAmount}
                          onChange={this.handleNumberChange}
                          style={{
                            width: "100%"
                          }}
                          placeholder="Per Head"
                        />
                        <AlertErrorFieldComponent
                          validateField={alertPerHeadAmount}
                          additionalCondition={tabSelect == "2"}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "3%"
                      }}
                    >
                      <Input
                        id="grossAmount"
                        addonBefore="Gross Amount"
                        value={this.state.grossAmount}
                        style={{
                          width: "33%"
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
                          width: "33%"
                        }}
                        placeholder="Discount"
                      />
                      <Input
                        id="vehicleCharges"
                        addonBefore="Vehicle Charges"
                        value={this.state.vehicleCharges}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "33%"
                        }}
                        placeholder="Vehicle Charges"
                      />
                    </div>
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "3%"
                      }}
                    >
                      <Input
                        id="totalAmount"
                        addonBefore="Total Amount"
                        value={this.state.totalAmount}
                        style={{
                          width: "49%"
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
                          width: "49%"
                        }}
                        placeholder="Received Amount"
                      />
                    </div>
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "3%"
                      }}
                    >
                      <Input
                        id="serviceExpense"
                        addonBefore="Service Expense"
                        value={this.state.serviceExpense}
                        onChange={this.handleNumberChange}
                        style={{
                          width: "49%"
                        }}
                        placeholder="Service Expenses"
                      />
                      <Input
                        id="itemExpense"
                        addonBefore="Items of Expense"
                        value={0}
                        style={{
                          width: "49%"
                        }}
                        placeholder="Items of Expense"
                        disabled
                      />
                    </div>
                    <Input
                      id="balanceAmount"
                      addonBefore="Balance Amount"
                      value={this.state.balanceAmount}
                      style={{
                        width: "100%",
                        marginTop: "3%"
                      }}
                      placeholder="Balance Amount"
                      disabled
                    />
                  </TabPane>
                </Tabs>
                <Input
                  id="orderTitle"
                  addonBefore="Order Title"
                  value={this.state.orderTitle}
                  style={{ width: "100%", marginTop: "3%" }}
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
                  style={{ width: "100%", marginTop: "3%" }}
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
                  type="warn"
                  style={{
                    width: "100%",
                    marginTop: "3%",
                    justifyContent: "center",
                    backgroundColor: "#FFCC00"
                  }}
                >
                  <Link to={routes.EVENTITEMPAGE} style={{ color: "#FFFFFF" }}>
                    Back
                  </Link>
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
    itemExpense: state.eventItems ? state.eventItems.itemExpense : 0,
    orderCost: state.eventItems ? state.eventItems.orderCost : 0,
    orderedData: state.eventItems.orderedData
      ? state.eventItems.orderedData
      : [],
    isOrderProcessModal: state.createEvent.isOrderProcessModal,
    isPendingOrderCreation: state.createEvent
      ? state.createEvent.isPendingOrderCreation
      : false,
    isOrderProcessDraftModal: state.drafts.isOrderProcessModal,
    isDraft: state.drafts.isDraft,
    isPendingOrderDraftCreation: state.drafts
      ? state.drafts.isPendingOrderCreation
      : false,
    printURL: state.print ? state.print.url : { filename: "" },
    isDraftError: state.drafts ? state.drafts.isError : "",
    isError: state.createEvent ? state.createEvent.isError : "",
    isEventUpdate: state.prepareUpdateEvent.isEventUpdate,
    updateOrderDetail: state.prepareUpdateEvent.orderDetail,
    customerObj: state.prepareUpdateEvent.customer,
    order: state.createEvent.order ? state.createEvent.order : null,
    draft: state.drafts.draft ? state.drafts.draft : null
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createEvent: createEvent,
      createDraft: createDraft,
      prepareUpdateEvent: prepareUpdateEvent,
      printOrders: printOrders,
      resetSate: resetSate,
      resetPrintState: resetPrintState,
      resetSateEvent: resetSateEvent,
      resetSateDraft: resetSateDraft
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCustomerPage);
