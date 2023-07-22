/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import {
  getOrdersList,
  getOrdersListMonth,
  overDueOrderMonth,
  overDueOrder,
  closedOrder,
  closedOrderMonth,
  completedOrder,
  completedOrderMonth,
  updateBulkOrders,
  voidOrder,
  voidOrderMonth,
  completedCloseOrderMonth
} from "../api/methods/Order";
import * as orderAction from "../actions/orders";
import _ from "lodash";
import moment from "moment";

// Our worker Saga that logins the user
export default function* homeOrderListSync(action) {
  let compCloseMonth;
  let finalResp = {
    totalOrderCount: 0,
    totalOverdueCount: 0,
    totalClosedCount: 0,
    totalCompleteCount: 0,
    monthOrderCount: 0,
    monthOverdueCount: 0,
    monthClosedCount: 0,
    monthCompleteCount: 0
  };
  try {
    compCloseMonth = yield call(completedCloseOrderMonth);
    const monthYearGroup = action.data.monthYear;

    if (action.data.runClosed) {
      let data = compCloseMonth.body;
      data = data.map(obj => {
        return {
          ...obj,
          is_closed: true
        };
      });
      let resp = yield call(updateBulkOrders, data);
      compCloseMonth = yield call(completedCloseOrderMonth);
    }
    let completeResponse = yield call(completedOrder);
    let completedData = completeResponse.body;
    let overdueResponse = yield call(overDueOrder);
    const overDueData = overdueResponse.body;
    let closedResponse = yield call(closedOrder);
    const closedData = closedResponse.body;
    let totalResponse = yield call(getOrdersList);
    const totalData = totalResponse.body;
    let overdueResponseMonth = yield call(overDueOrderMonth);
    const overdueDataMonth = overdueResponseMonth.body;
    let closedResponseMonth = yield call(closedOrderMonth);
    const closedDataMonth = closedResponseMonth.body;
    let totalResponseMonth = yield call(getOrdersListMonth);
    const totalDataMonth = totalResponseMonth.body;
    let completedResponseMonth = yield call(completedOrderMonth);
    const completedDataMonth = completedResponseMonth.body;
    let voidResponse = yield call(voidOrder);
    const voidData = voidResponse.body;
    let voidResponseMonth = yield call(voidOrderMonth);
    const voidDataMonth = voidResponseMonth.body;
    const compCloseData = compCloseMonth.body;

    const group1 = _.groupBy(totalData, "group1");
    const group2 = _.groupBy(totalData, "group2");
    const currentMonthData = group1[monthYearGroup] || [];
    const currentMonthData2 = group2[monthYearGroup] || [];
    console.log(" mergedArray ", currentMonthData);
    console.log(" mergedArray ", currentMonthData2);
    const mergedArray = [...currentMonthData, ...currentMonthData2];
    const uniqueData = [
      ...mergedArray
        .reduce((map, obj) => map.set(obj.id, obj), new Map())
        .values()
    ];

    console.log(" mergedArray ", uniqueData);
    finalResp = {
      totalOrderCount: totalData.length || 0,
      totalOverdueCount: overDueData.length || 0,
      totalClosedCount: closedData.length || 0,
      totalCompleteCount: completedData.length || 0,
      monthOrderCount: totalDataMonth.length || 0,
      monthOverdueCount: overdueDataMonth.length || 0,
      monthClosedCount: closedDataMonth.length || 0,
      monthCompleteCount: completedDataMonth.length || 0,
      voidCount: voidData.length || 0,
      monthVoidCount: voidDataMonth.length || 0,
      compCloseCount: compCloseData.length || 0,
      calendarData: uniqueData
    };
    yield put(orderAction.fetchHomeOrderFulfilled(finalResp));
  } catch (ex) {
    console.log("error ", ex);
    yield put(orderAction.fetchHomeOrderRejected());
  }
}
