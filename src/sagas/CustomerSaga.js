/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getCustomers } from "../api/methods/Customer";
import * as customerAction from "../actions/customers";

import moment from "moment";

// Our worker Saga that logins the user
export default function* customersListSync(action) {
  let response;
  try {
    response = yield call(getCustomers);
    //console.log("response -> ", response);
    if (response.status === 200) {
      const data = response.body;
      yield put(customerAction.fetchCustomersFulfilled(data));
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(customerAction.fetchCustomersRejected());
  }
}
