/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getDraftList } from "../api/methods/Draft";
import * as draftAction from "../actions/drafts";

import moment from "moment";

// Our worker Saga that logins the user
export default function* draftListSync(action) {
  let response;
  try {
    response = yield call(getDraftList);
    console.log("response -> ", response);
    if (response.status === 200) {
      const data = response.body;
      yield put(draftAction.fetchDraftFulfilled(data));
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(draftAction.fetchDraftRejected());
  }
}
