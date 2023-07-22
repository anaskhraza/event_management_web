import axios from "axios";
import _ from "lodash";
import moment from "moment";

import * as types from "./types";

export function fetchTargets(year, auth, username, password) {
  return {
    type: types.FETCH_TARGETS_PENDING,
    year,
    auth,
    username,
    password
  };
}

export const fetchTargetFulfilled = (response, auth) => {
  return {
    type: types.FETCH_TARGETS_FULFILLED,
    response,
    auth
  };
};

export const updateDataTarget = (
  closeOrdStats,
  nonClosedOrdStats,
  overDueOrdStats,
  yearlyOrdStats
) => {
  return {
    type: "UPDATE_DATA_TARGET",
    closeOrdStats,
    nonClosedOrdStats,
    overDueOrdStats,
    yearlyOrdStats
  };
};

export const fetchTargetRejected = signInError => {
  return {
    type: types.FETCH_TARGETS_REJECTED,
    signInError
  };
};

export const backupDatabase = () => {
  return {
    type: "BACK_UP_DATABASE"
  };
};

export const backupDatabaseCompleted = () => {
  return {
    type: "BACK_UP_DATABASE_DONE"
  };
};

export const updateItemExpense = () => {
  return {
    type: "ITEM_EXPENSE_PENDING"
  };
};

export const updateItemExpenseCompleted = () => {
  return {
    type: "ITEM_EXPENSE_DONE"
  };
};

export function deleteTarget(targetId, auth, year) {
  return {
    type: types.DELETE_TARGETS_PENDING,
    targetId,
    auth,
    year
  };
}

export const deleteTargetFulfilled = response => {
  return {
    type: types.DELETE_TARGETS_FULFILLED,
    response
  };
};

export const deleteTargetRejected = () => {
  return {
    type: types.DELETE_TARGETS_REJECTED
  };
};

export function createTarget(postObj, auth, year) {
  var data = {
    month_year: postObj.month_year,
    year: postObj.isEdit ? postObj.year : postObj.yearPicker,
    amount: postObj.targetAmount
  };

  if (postObj.targetId) {
    data.id = postObj.targetId;
  }

  return {
    type: types.CREATE_TARGETS_PENDING,
    data,
    auth,
    year
  };
}

export const createTargetFulfilled = response => {
  return {
    type: types.CREATE_TARGETS_FULFILLED,
    response
  };
};

export const createTargetRejected = () => {
  return {
    type: types.CREATE_TARGETS_REJECTED
  };
};

export function resetSateEvent() {
  return {
    type: "RESET_STATE",
    payload: null
  };
}
