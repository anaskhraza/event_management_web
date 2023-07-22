import axios from "axios";
import _ from "lodash";
import moment from "moment";

import * as types from "./types";

export function fetchOrders(data) {
  return {
    type: types.FETCH_ORDER_PENDING,
    data
  };
}

export const fetchOrderFulfilled = response => {
  return {
    type: types.FETCH_ORDER_FULFILLED,
    response
  };
};

export const fetchOrderRejected = () => {
  return {
    type: types.FETCH_ORDER_REJECTED
  };
};

export function fetchUpcomingOrders() {
  return {
    type: types.FETCH_UPCOMING_ORDER_PENDING
  };
}

export const fetchUpcomingOrderFulfilled = response => {
  return {
    type: types.FETCH_UPCOMING_ORDER_FULFILLED,
    response
  };
};

export const fetchUpcomingOrderRejected = () => {
  return {
    type: types.FETCH_UPCOMING_ORDER_REJECTED
  };
};

export function fetchHomeOrders(data) {
  return {
    type: types.FETCH_HOME_ORDER_PENDING,
    data
  };
}

export const fetchHomeOrderFulfilled = response => {
  return {
    type: types.FETCH_HOME_ORDER_FULFILLED,
    response
  };
};

export const fetchHomeOrderRejected = () => {
  return {
    type: types.FETCH_HOME_ORDER_REJECTED
  };
};

export function printOrders(data) {
  console.log("data => ", data);
  return {
    type: types.PRINT_ORDER_PENDING,
    data
  };
}

export const printOrderFulfilled = response => {
  return {
    type: types.PRINT_ORDER_FULFILLED,
    response
  };
};

export const resetPrintState = response => {
  return {
    type: "RESET_PRINT_STATE"
  };
};

export const printOrderRejected = () => {
  return {
    type: types.PRINT_ORDER_REJECTED
  };
};

export function updateOrder(orderId, data, isList) {
  return {
    type: types.UPDATE_ORDER_PENDING,
    data,
    orderId,
    isList
  };
}

export const updateOrderFulfilled = response => {
  return {
    type: types.UPDATE_ORDER_FULFILLED,
    response
  };
};

export const updateOrderRejected = () => {
  return {
    type: types.UPDATE_ORDER_REJECTED
  };
};
