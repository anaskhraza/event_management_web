/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getOrdersList, getArgOrdersList } from "../api/methods/Order";
import * as orderAction from "../actions/orders";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* orderListSync(action) {
  let response;
  try {
    if (action.data) {
      console.log("action data ", action.data);
      response = yield call(getArgOrdersList, action.data);
    } else {
      response = yield call(getOrdersList);
    }
    //console.log("response -> ", response);
    if (response.status === 200) {
      let data = response.body;
      data = data.map(obj => {
        return {
          ...obj,
          today: moment(obj.event_date_start).isSame(Date.now(), "day"),
          time: obj.id
        };
      });
      data = _.orderBy(data, ["time"], ["desc"]);
      yield put(orderAction.fetchOrderFulfilled(data));
    }
  } catch (ex) {
    console.log("error ", ex);
    yield put(orderAction.fetchOrderRejected());
  }
}
