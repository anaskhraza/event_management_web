/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import {
  createEventItems,
  deleteEventItems
} from "../api/methods/EventItem";
import { createCustomer } from "../api/methods/Customer";
import { createOrder, deleteOrder } from "../api/methods/Order";
import * as createEventAction from "../actions/createEvent";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* createEventSync(action) {
  let isCustomerCreated = false;
  let isOrderCreated = false;
  let orderId;
  let response, responseOrder, responseEventDetail;
  try {
    console.log("action -> ", action);
    response = yield call(createCustomer, action.data.customer);

    if (response.status === 200) {
      const customerObj = response.body;
      //console.log("customerObj Saga -> ", customerObj);
      if (customerObj.length > 0) {
        isCustomerCreated = true;
        let orderReqObj = action.data.order;
        orderReqObj.customer_id = customerObj[0].id;

        responseOrder = yield call(createOrder, orderReqObj);
        const orderObj = responseOrder.body;
        //console.log("orderObj Saga -> ", orderObj);
        if (orderObj.length > 0) {
          isOrderCreated = true;
          orderId = orderObj[0].id;
          const dataObj = {
            orderId: orderObj[0].id,
            customerId: customerObj[0].id,
            eventItems: action.data.eventItems
          };
          yield call(deleteEventItems, orderId);
          responseEventDetail = yield call(createEventItems, dataObj);
          const eventDetails = responseEventDetail.body;
          //console.log("eventDetails Saga -> ", eventDetails);
          if (eventDetails.length > 0) {
            let data = {
              customer: customerObj[0],
              order: orderObj[0]
            };

            yield put(createEventAction.createEventFulfilled(data));
          }
        } else {
          throw "error in creating order";
        }
      } else {
        throw "error in creating customer";
      }
    } else {
      throw "error in creating customer";
    }
  } catch (ex) {
    //console.log("error ", ex);
    if (isOrderCreated) {
      yield call(deleteEventItems, orderId);
      yield call(deleteOrder, orderId);
    }
    yield put(createEventAction.createEventRejected());
  }
}
