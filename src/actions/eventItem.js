import axios from "axios";
import _ from "lodash";
import moment from "moment";

import * as types from "./types";

export function fetchItems(data, isUpdateEvent, orderId, draftId, isDuplicate) {
  return {
    type: types.FETCH_ITEMS_PENDING,
    data,
    isUpdateEvent,
    orderId,
    draftId,
    isDuplicate
  };
}

export const fetchItemFulfilled = (
  response,
  orderedData,
  modifiedItems,
  selectedRowKeys
) => {
  return {
    type: types.FETCH_ITEMS_FULFILLED,
    response,
    orderedData,
    modifiedItems,
    selectedRowKeys
  };
};

export const fetchItemRejected = () => {
  return {
    type: types.FETCH_ITEMS_REJECTED
  };
};

export function deleteProducts(ProductId, isList) {
  return {
    type: types.DELETE_ITEMS_PENDING,
    ProductId,
    isList
  };
}

export const deleteProductsFulfilled = response => {
  return {
    type: types.DELETE_ITEMS_FULFILLED,
    response
  };
};

export const deleteProductsRejected = () => {
  return {
    type: types.DELETE_ITEMS_REJECTED
  };
};

export function createProducts(postObj) {
  //console.log("createProducts -> ", postObj);
  var data = {
    category_id: postObj.itemCategory,
    name: postObj.itemName,
    rate: postObj.rate,
    quantity: postObj.quantity,
    sku: postObj.itemSKU
  };
  if (postObj.itemId) {
    data.id = postObj.itemId;
  }
  return {
    type: types.CREATE_ITEMS_PENDING,
    data
  };
}

export const createProductsFulfilled = response => {
  return {
    type: types.CREATE_ITEMS_FULFILLED,
    response
  };
};

export const createProductsRejected = () => {
  return {
    type: types.CREATE_ITEMS_REJECTED
  };
};

export function fetchUpdatedQuantity(orderedData, modifiedData) {
  const data = {
    selectedProducts: orderedData,
    modifiedProducts: modifiedData
  };
  return {
    type: types.FETCH_ITEMS_QUANTITY_PENDING,
    data
  };
}

export const fetchUpdatedQuantityFulfilled = response => {
  return {
    type: types.FETCH_ITEMS_QUANTITY_FULFILLED,
    response
  };
};

export const fetchUpdatedQuantityRejected = () => {
  return {
    type: types.FETCH_ITEMS_QUANTITY_REJECTED
  };
};

export function updateData(items) {
  items = _.map(items, obj => {
    obj.price = obj.quantity_ordered * obj.no_of_days * obj.rate;
    return obj;
  });

  return {
    type: "UPDATE_DATA",
    payload: items
  };
}

export function setEventUpdateItems(response) {
  return {
    type: "PREPARE_UPDATE_EVENT_ITEMS",
    response
  };
}

export const updateItemsDate = (itemObj, itemsData) => {
  let modifiedItems = [];

  const newItemsData = itemsData.map(obj => {
    if (obj.id === itemObj.id) {
      const eDate = moment(itemObj.eventDateEnd);
      const sDate = moment(itemObj.eventDateStart);
      let diffDays = eDate.diff(sDate, "days");
      if (diffDays == 0) {
        diffDays = 1;
      }
      const changedPrice = obj.quantity_ordered * diffDays * obj.rate;
      let newObj = {
        ...obj,
        eventDate: itemObj.eventDate,
        event_booking_start: itemObj.eventDateStart,
        event_booking_end: itemObj.eventDateEnd,
        price: changedPrice,
        no_of_days: diffDays
      };

      if (
        obj.event_booking_start != itemObj.eventDateStart ||
        obj.event_booking_end != itemObj.eventDateEnd
      ) {
        modifiedItems.push(newObj);
      }
      return newObj;
    } else {
      return obj;
    }
  });
  const payload = { items: newItemsData, modifiedItems: modifiedItems };
  return {
    type: "UPDATE_DATA_DATE_CHANGED",
    payload
  };
};

export function updateSelectedRowKeys(rowKeys, itemsData) {
  let orderedDataAraray = [];
  let newItemsData = [...itemsData];
  _.each(rowKeys, key => {
    let filterArray = _.filter(newItemsData, { key: key });
    if (filterArray.length > 0) {
      let obj = filterArray[0];

      if (obj.quantity_ordered == 0) {
        obj.quantity_ordered = 1;
        obj.price = obj.quantity_ordered * obj.no_of_days * obj.rate;
      } else {
        obj.price = obj.quantity_ordered * obj.no_of_days * obj.rate;
      }

      orderedDataAraray.push(obj);

      newItemsData = newItemsData.map(itemObj =>
        obj.key === itemObj.key ? obj : itemObj
      );
    }
  });
  const payload = {
    selectedRowKeys: rowKeys,
    items: newItemsData,
    orderedData: orderedDataAraray
  };
  return {
    type: "UPDATE_DATA_ROW_KEY_SELECTED",
    payload
  };
}

export function resetSate() {
  return {
    type: "RESET_STATE"
  };
}
