/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { createProducts, getAllProducts } from "../api/methods/Items";
import * as itemAction from "../actions/eventItem";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* createItemsySync(action) {
  let response;
  try {
    response = yield call(createProducts, action.data);
    console.log("response234 -> ", response);
    if (response.status === 200) {
      response = yield call(getAllProducts);
      //console.log("response234 -> ", response);

      if (response.status === 200) {
        const itemsData = response.body;
        yield put(itemAction.fetchItemFulfilled(itemsData));
      }
    } else {
      throw "error in creating customer";
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(itemAction.fetchItemRejected());
  }
}
