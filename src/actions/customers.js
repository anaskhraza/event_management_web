import axios from "axios";
import _ from "lodash";
import moment from "moment";

import * as types from "./types";

export function fetchCustomers() {
  return {
    type: types.FETCH_CUSTOMER_PENDING
  };
}

export const fetchCustomersFulfilled = response => {
  return {
    type: types.FETCH_CUSTOMER_FULFILLED,
    response
  };
};

export const fetchCustomersRejected = () => {
  return {
    type: types.FETCH_CUSTOMER_REJECTED
  };
};

export function createCustomer(postObj) {
  console.log("createProducts -> ", postObj);
  var data = {
    ...postObj
  };
  return {
    type: types.CREATE_CUSTOMER,
    data
  };
}
