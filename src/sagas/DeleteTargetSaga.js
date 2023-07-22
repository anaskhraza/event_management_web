/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { deleteTarget, getAllTargets } from "../api/methods/Target";
import * as targetAction from "../actions/targets";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* deleteTargetSync(action) {
  let response;
  try {
    //console.log("action -> ", action);
    let auth = action.auth;
    response = yield call(deleteTarget, action.targetId, auth);
    //console.log("action -> ", response);
    if (response.status === 200) {
      response = yield call(getAllTargets, action.year, auth);
      const data = response.body;
      yield put(targetAction.fetchTargetFulfilled(data, auth));
    } else {
      throw "error in creating customer";
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(targetAction.fetchTargetRejected());
  }
}
