/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { backup } from "../api/methods/Target";
import * as backupAction from "../actions/targets";

import moment from "moment";

// Our worker Saga that logins the user
export default function* printSync(action) {
  let response;
  response = yield call(backup);
  console.log("response -> ", response);
  if (response.status === 200) {
    const data = response.body;
    yield put(backupAction.backupDatabaseCompleted());
  }
}
