import axios from "axios";
import _ from "lodash";
import moment from "moment";

import * as types from "./types";

export function fetchDrafts(data) {
  return {
    type: types.FETCH_DRAFT_PENDING,
    data
  };
}

export const fetchDraftFulfilled = response => {
  return {
    type: types.FETCH_DRAFT_FULFILLED,
    response
  };
};

export const fetchDraftRejected = () => {
  return {
    type: types.FETCH_DRAFT_REJECTED
  };
};

export function deleteDraft(draftId, isList) {
  return {
    type: types.DELETE_DRAFT_PENDING,
    draftId,
    isList
  };
}

export const deleteDraftFulfilled = response => {
  return {
    type: types.DELETE_DRAFT_FULFILLED,
    response
  };
};

export const deleteDraftRejected = () => {
  return {
    type: types.DELETE_DRAFT_REJECTED
  };
};

export function createDraft(eventItems, startDate, endDate, dataState) {
  var eventStartDate = "";
  var eventEndDate = "";
  var postObj = {};
  //console.log("createEvent dataState -> ", dataState);
  // let itemMapData = dataProps.eventItems.orderedData;
  // postObj.itemOrderMap = getItemsArrayMap(itemMapData, dataProps.createEvent.eventStartDate);

  //console.log("createEvent dataProps -> ", eventItems);
  const customerObj = getCustomerDetail(dataState);
  let draftDetailObj = getDraftDetail(dataState, startDate, endDate);
  let data = {
    customer: customerObj,
    draft: draftDetailObj,
    eventItems: eventItems
  };
  return {
    type: types.CREATE_DRAFT_PENDING,
    data
  };
}

export const createDraftFulfilled = response => {
  return {
    type: types.CREATE_DRAFT_FULFILLED,
    response
  };
};

export const createDraftRejected = () => {
  return {
    type: types.CREATE_DRAFT_REJECTED
  };
};

export function resetSateDraft() {
  return {
    type: "RESET_STATE",
    payload: null
  };
}

const getCustomerDetail = dataObj => {
  let customerObj = {};

  customerObj.customer_name = dataObj.customerName;
  customerObj.customer_number = "0" + dataObj.mobileNumber;
  if (
    dataObj.mobileNumber.toString().charAt(0) == "0" &&
    dataObj.mobileNumber.length > 10
  ) {
    customerObj.customer_number = dataObj.mobileNumber;
  }

  customerObj.alternate_number = "0" + dataObj.altNumber;
  if (
    dataObj.altNumber.toString().charAt(0) == "0" &&
    dataObj.altNumber.length > 10
  ) {
    customerObj.alternate_number = dataObj.altNumber;
  }

  if (dataObj.customerId) {
    customerObj.id = dataObj.customerId;
  }
  return customerObj;
};

const getDraftDetail = (dataObj, startDate, endDate) => {
  let draftObj = {};

  draftObj.draft_title = dataObj.draftTitle;
  draftObj.event_date = `${startDate} ${endDate}`;
  draftObj.event_date_start = moment(new Date(startDate)).format("YYYY-MM-DD");
  draftObj.gross_amount = dataObj.grossAmount;
  draftObj.received_amount = dataObj.receivedAmount;
  draftObj.service_expense = dataObj.serviceExpense;
  draftObj.total_amount = dataObj.totalAmount;
  draftObj.balance_amount = dataObj.balanceAmount;
  draftObj.expense_items = dataObj.itemExpense;
  draftObj.discount = dataObj.discount;
  draftObj.per_head_amount = dataObj.perHeadAmount;
  draftObj.no_of_person = dataObj.noOfPerson;
  draftObj.vehicle_charges = dataObj.vehicleCharges;
  draftObj.is_due_amount = dataObj.balanceAmount;
  draftObj.complete =
    parseInt(dataObj.receivedAmount) == parseInt(dataObj.totalAmount)
      ? true
      : false;
  if (dataObj.draftId) {
    draftObj.id = dataObj.draftId;
  }

  return draftObj;
};
