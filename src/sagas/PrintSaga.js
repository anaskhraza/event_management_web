/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { printOrder } from "../api/methods/Order";
import * as orderAction from "../actions/orders";

import moment from "moment";

// Our worker Saga that logins the user
export default function* printSync(action) {
  let response;
  try {
    response = yield call(printOrder, action.data);

    if (response.status === 200) {
      const data = response.body;
      yield put(orderAction.printOrderFulfilled(data));
    }
  } catch (ex) {
    console.log("error ", ex);
    yield put(orderAction.printOrderRejected());
  }
}
