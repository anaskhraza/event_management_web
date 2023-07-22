/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

import _ from "lodash";
// import loginUser from 'app/api/methods/loginUser';
import {
  getEventItemsForOrders,
  fetchItemByOrderId
} from "../api/methods/EventItem";
import { getCustomerFromId } from "../api/methods/Customer";
import * as createEventAction from "../actions/createEvent";
import * as eventItemAction from "../actions/eventItem";

import { setEventDate } from "../actions/eventDate";

import moment from "moment";

// Our worker Saga that logins the user
export default function* prepareUpdateEventSync(action) {
  let response, responseOrderedItems, responseCustomer;
  let items,
    orderedItems,
    modifiedItems,
    selectedRowKeys = [];

  try {
    //console.log("action prepareUpdateEventSync -> ", action);
    let data = action.orderData;
    let orderId = data.id;
    let customerId = data.customer_id;
    let eventDateArray = data.event_date ? data.event_date.split(" ") : [];
    console.log("end endDateFormat => ", eventDateArray)
    let startDate = eventDateArray[0];
    let endDate = eventDateArray[1];
    console.log("end Date => ", endDate)
    let startDateFormat = moment(eventDateArray[0]).format("YYYY-MM-DD");
    let endDateFormat = moment(eventDateArray[1]).format("YYYY-MM-DD");
    console.log("end endDateFormat => ", endDateFormat)
    const date = `${startDateFormat} ${endDateFormat}`;
    console.log("end date => ", date)
    responseCustomer = yield call(getCustomerFromId, customerId);

    //console.log("endDateFormat -> ", endDateFormat);
    //console.log("startDateFormat -> ", startDateFormat);
    responseCustomer = responseCustomer.body;

    let eventDate = {
      eventDate: date,
      eventStartDate: startDate,
      eventEndDate: endDate
    };

    let order = dataObjectForOrders(data);

    const respData = {
      orderDetail: order,
      customer: responseCustomer,
      eventDate: eventDate
    };

    yield put(setEventDate(eventDateArray));

    yield put(createEventAction.prepareUpdateEventFulfilled(respData));
  } catch (ex) {
    //console.log("error ", ex);
    yield put(createEventAction.prepareUpdateEventRejected());
  }
}

const dataObjectForOrders = orderData => {
  return { ...orderData };
};
