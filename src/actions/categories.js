import axios from "axios";
import _ from "lodash";
import moment from "moment";

import * as types from "./types";

export function fetchCategorys() {
  return {
    type: types.FETCH_CATEGORIES_PENDING
  };
}

export const fetchCategoryFulfilled = response => {
  return {
    type: types.FETCH_CATEGORIES_FULFILLED,
    response
  };
};

export const fetchCategoryRejected = () => {
  return {
    type: types.FETCH_CATEGORIES_REJECTED
  };
};

export function deleteCategory(categoryId, isList) {
  return {
    type: types.DELETE_CATEGORIES_PENDING,
    categoryId,
    isList
  };
}

export const deleteCategoryFulfilled = response => {
  return {
    type: types.DELETE_CATEGORIES_FULFILLED,
    response
  };
};

export const deleteCategoryRejected = () => {
  return {
    type: types.DELETE_CATEGORIES_REJECTED
  };
};

export function createCategory(postObj) {
  var data = {
    category_name: postObj.categoryName
  };

  if (postObj.categoryId) {
    data.id = postObj.categoryId;
  }

  return {
    type: types.CREATE_CATEGORIES_PENDING,
    data
  };
}

export const createCategoryFulfilled = response => {
  return {
    type: types.CREATE_CATEGORIES_FULFILLED,
    response
  };
};

export const createCategoryRejected = () => {
  return {
    type: types.CREATE_CATEGORIES_REJECTED
  };
};

export function resetSateEvent() {
  return {
    type: "RESET_STATE",
    payload: null
  };
}
