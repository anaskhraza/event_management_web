/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getOrdersList, updateOrder } from "../api/methods/Order";
import * as orderAction from "../actions/orders";

import moment from "moment";

// Our worker Saga that logins the user
export default function* updateOrderSync(action) {
  let response;
  try {
    const data = action.data;
    const orderId = action.orderId;
    const isOrderFetch = action.isList;
    let updateOrderResp = "";

    updateOrderResp = yield call(updateOrder, orderId, data);
    //console.log("response -> ", response);
    if (updateOrderResp.status === 200) {
      if (isOrderFetch) {
        response = yield call(getOrdersList);
        //console.log("response -> ", response);
        if (response.status === 200) {
          const data = response.body;
          data = data.map(obj => {
            return {
              ...obj,
              today: moment(obj.event_date_start).isSame(Date.now(), "day"),
              time: obj.id
            };
          });
          data = _.orderBy(data, ["time"], ["desc"]);
          yield put(orderAction.fetchOrderFulfilled(data));
        } else {
          yield put(orderAction.fetchOrderRejected());
        }
      } else {
        const data = updateOrderResp.body;
        yield put(orderAction.updateOrderFulfilled(data));
      }
    } else {
      yield put(orderAction.updateOrderRejected());
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(orderAction.updateOrderRejected());
  }
}
