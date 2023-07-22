/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { deleteProducts, getAllProducts } from "../api/methods/Items";
import * as itemAction from "../actions/eventItem";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* deleteItemsSync(action) {
  let response;
  try {
    //console.log("action -> ", action);
    response = yield call(deleteProducts, action.ProductId);

    if (response.status === 200) {
      response = yield call(getAllProducts);
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
