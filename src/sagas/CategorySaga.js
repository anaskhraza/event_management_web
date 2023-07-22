/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getAllCategories } from "../api/methods/Categories";
import * as categoryAction from "../actions/categories";

import moment from "moment";

// Our worker Saga that logins the user
export default function* categoryListSync(action) {
  let response;
  try {
    response = yield call(getAllCategories);
    //console.log("response -> ", response);
    if (response.status === 200) {
      const data = response.body;
      yield put(categoryAction.fetchCategoryFulfilled(data));
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(categoryAction.fetchCategoryRejected());
  }
}
