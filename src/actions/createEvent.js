import axios from "axios";
import _ from "lodash";
import moment from "moment";

import * as types from "./types";

const getItemsArrayMap = (dataArray, eventDate) => {
  let itemArray = [];
  _.each(dataArray, function(obj) {
    let newObj = {};
    newObj.sku = obj.sku;
    newObj.event_booking_start = moment(new Date(eventDate)).format(
      "YYYY-MM-DD"
    );
    newObj.event_booking_end =
      obj.no_of_days == 1
        ? moment(new Date(eventDate)).format("YYYY-MM-DD")
        : moment(new Date(eventDate))
            .add(obj.no_of_days, "days")
            .format("YYYY-MM-DD");
    newObj.order_quantity = obj.quantity_ordered;
    newObj.order_item_price = obj.price;
    itemArray.push(newObj);
  });

  return itemArray;
};

const getCustomerDetail = dataObj => {
  let customerObj = {};
  console.log("Data obj", dataObj);
  customerObj.customer_name = dataObj.customerName;
  customerObj.customer_number = "0" + dataObj.mobileNumber;
  customerObj.customer_address = dataObj.customerAddress;
  if (
    dataObj.mobileNumber &&
    dataObj.mobileNumber.toString().charAt(0) == "0" &&
    dataObj.mobileNumber.length > 10
  ) {
    customerObj.customer_number = dataObj.mobileNumber;
  }

  customerObj.alternate_number = "0" + dataObj.altNumber;
  if (
    dataObj.altNumber &&
    dataObj.altNumber.toString().charAt(0) == "0" &&
    dataObj.altNumber.length > 10
  ) {
    customerObj.alternate_number = dataObj.altNumber;
  }

  if (dataObj.customerId) {
    customerObj.id = dataObj.customerId;
  }
  console.log("customerObj obj", dataObj);
  return customerObj;
};

const getOrderDetail = (dataObj, startDate, endDate) => {
  let orderObj = {};
  orderObj.event_date = `${startDate} ${endDate}`;
  orderObj.event_date_start = moment(new Date(startDate)).format("YYYY-MM-DD");
  orderObj.location_address = dataObj.locationAddress;
  orderObj.order_title = dataObj.orderTitle;
  orderObj.gross_amount = dataObj.grossAmount;
  orderObj.expense_items = dataObj.itemExpense;
  orderObj.received_amount = dataObj.receivedAmount;
  orderObj.service_expense = dataObj.serviceExpense;
  orderObj.total_amount = dataObj.totalAmount;
  orderObj.balance_amount = dataObj.balanceAmount;
  orderObj.discount = dataObj.discount;
  orderObj.per_head_amount = dataObj.perHeadAmount;
  orderObj.no_of_person = dataObj.noOfPerson;
  orderObj.vehicle_charges = dataObj.vehicleCharges;
  orderObj.is_due_amount = dataObj.balanceAmount;
  orderObj.complete =
    parseInt(dataObj.receivedAmount) == parseInt(dataObj.totalAmount)
      ? true
      : false;
  if (dataObj.orderId) {
    orderObj.id = dataObj.orderId;
  }

  return orderObj;
};

const createOrderItems = async (orderResponse, eventItems) => {
  if (orderResponse.status === 200 && orderResponse.data.length > 0) {
    const customerId = orderResponse.data[0].customer_id;
    const orderId = orderResponse.data[0].id;
    let orderObj = _.map(eventItems, obj => {
      return {
        customer_id: customerId,
        order_id: orderId,
        event_booking_start: obj.event_booking_start,
        event_booking_end: obj.event_booking_end,
        product_id: obj.id,
        sku: obj.sku,
        order_quantity: obj.quantity_ordered,
        order_item_price: obj.rate
      };
    });

    const url = `http://localhost:3002/api/v1/products/createBulkProducts`;
    return await axios.post(url, orderObj);
  } else {
    return { status: 401, error: "error" };
  }
};

export function createEvent(eventItems, startDate, endDate, dataState) {
  var eventStartDate = "";
  var eventEndDate = "";
  var postObj = {};
  //console.log("createEvent dataState -> ", dataState);
  // let itemMapData = dataProps.eventItems.orderedData;
  // postObj.itemOrderMap = getItemsArrayMap(itemMapData, dataProps.createEvent.eventStartDate);

  //console.log("createEvent dataProps -> ", eventItems);
  const customerObj = getCustomerDetail(dataState);
  let orderDetailObj = getOrderDetail(dataState, startDate, endDate);
  let data = {
    customer: customerObj,
    order: orderDetailObj,
    eventItems: eventItems
  };
  return {
    type: types.CREATE_EVENT_PENDING,
    data
  };
}

export function prepareUpdateEvent(orderData) {
  var eventStartDate = "";
  var eventEndDate = "";
  var postObj = {};
  //console.log("createEvent dataProps -> ", orderData);

  return {
    type: types.PREPARE_UPDATE_EVENT_PENDING,
    orderData
  };
}

export const prepareUpdateEventFulfilled = response => {
  return {
    type: types.PREPARE_UPDATE_EVENT_FULFILLED,
    response
  };
};

export const prepareUpdateEventRejected = () => {
  return {
    type: types.PREPARE_UPDATE_EVENT_REJECTED
  };
};

export const createEventFulfilled = response => {
  return {
    type: types.CREATE_EVENT_FULFILLED,
    response
  };
};

export const createEventRejected = () => {
  return {
    type: types.CREATE_EVENT_REJECTED
  };
};

export function resetSateEvent() {
  return {
    type: "RESET_STATE",
    payload: null
  };
}
