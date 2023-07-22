/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { createCategory, getAllCategories } from "../api/methods/Categories";
import * as categoryAction from "../actions/categories";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* createCategorySync(action) {
  let response;
  try {
    //console.log("action -> ", action);
    response = yield call(createCategory, action.data);

    if (response.status === 200) {
      response = yield call(getAllCategories);
      const data = response.body;
      yield put(categoryAction.fetchCategoryFulfilled(data));
    } else {
      throw "error in creating customer";
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(categoryAction.fetchCategoryRejected());
  }
}
