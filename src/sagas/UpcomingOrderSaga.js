/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getOrdersList, getUpcomingOrdersList } from "../api/methods/Order";
import * as orderAction from "../actions/orders";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* upcomingOrderListSync(action) {
  let response;
  try {
    response = yield call(getUpcomingOrdersList);

    //console.log("response -> ", response);
    if (response.status === 200) {
      let data = response.body;
      data = data.map(obj => {
        return {
          ...obj,
          today: moment(obj.event_date_start).isSame(Date.now(), "day"),
          time: new Date(obj.event_date_start).getTime()
        };
      });
      data = _.orderBy(data, ["time"], ["asc"]);
      
      yield put(orderAction.fetchUpcomingOrderFulfilled(data));
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(orderAction.fetchUpcomingOrderRejected());
  }
}
