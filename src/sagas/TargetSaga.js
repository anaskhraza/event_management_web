/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getAllTargets, signIn } from "../api/methods/Target";
import {
  closedOrderByYear,
  closedOrderStats,
  getOrdersList,
  nonClosedOrderStats,
  overDueOrderStats
} from "../api/methods/Order";
import * as targetAction from "../actions/targets";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* targetListSync(action) {
  let response;
  let signInResp;
  let closedOrdStResp, nonClosedOrdStResp, overDueOrdStResp, closedYrOrdRsp;
  let errorUnauthorized = false;
  try {
    //console.log("action -> ", action);
    let auth = action.auth;

    response = yield call(getAllTargets, action.year, auth);
    //console.log("response -> " + JSON.stringify(response));
    if (action.username && action.password) {
      if (response.status === 404 && response.error == "Unauthorized") {
        errorUnauthorized = true;
        signInResp = yield call(signIn, {
          username: action.username,
          password: action.password
        });
        if (signInResp.status === 200) {
          auth = signInResp.body.token;
          //console.log("auth -> ", signInResp);
          response = yield call(getAllTargets, action.year, auth);
        }
      }
    }
    if (response.status === 200) {
      const data = response.body;
      let allOrdersResp = yield call(getOrdersList);
      closedOrdStResp = yield call(closedOrderStats, auth);
      console.log("closedOrdStResp => ", closedOrdStResp);
      nonClosedOrdStResp = yield call(nonClosedOrderStats, auth);
      overDueOrdStResp = yield call(overDueOrderStats, auth);
      closedYrOrdRsp = yield call(closedOrderByYear, action.year, auth);
      const closOrderStats = getProcessedData(closedOrdStResp);
      const nonClosOrderStats = getNonClosedProcessedData(nonClosedOrdStResp);
      const ovDuOrderStats = getOverDueProcessedData(overDueOrdStResp);
      const yearlyOrdStats = getYearlyProcessedData(closedYrOrdRsp, data);

      const orderData = yield put(
        targetAction.fetchTargetFulfilled(data, auth)
      );
      yield put(
        targetAction.updateDataTarget(
          closOrderStats,
          nonClosOrderStats,
          ovDuOrderStats,
          yearlyOrdStats
        )
      );
    } else {
      yield put(targetAction.fetchTargetRejected(errorUnauthorized));
    }
  } catch (ex) {
    console.log("error ", ex);
    yield put(targetAction.fetchTargetRejected());
  }
}

const getYearlyProcessedData = (resp, targetData) => {
  const data = resp.body;
  let processedData = [];
  const processedObj = parsedYearlyStats(data, targetData);

  return processedObj;
};

const parsedYearlyStats = (data, targetData) => {
  const monthArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  let totalAmount = 0;
  let totalService = 0;
  let processedData = [];
  let respArray = [];
  let processedTargetData;

  let previousMonth = new Date().getMonth() - 1;
  if (previousMonth < 0) {
    previousMonth = 11;
  }
  let processedDataObj = parsedSimplifiedData(data);
  let processedTargetDataObj = parsedSimplifiedData(targetData, true);

  const byMonthData = _.groupBy(processedDataObj.processedData, "month");
  const byMonthTargetData = _.groupBy(
    processedTargetDataObj.processedData,
    "month"
  );
  respArray.push([
    "Total Amount",
    "Service Charges",
    "Item Expense",
    "OverDue Amount",
    "Target"
  ]);
  _.forEach(monthArr, month => {
    let targetAmount = 0;
    let data = byMonthData[month];
    let targetAmountObj = byMonthTargetData[month];
    if (targetAmountObj && targetAmountObj.length > 0) {
      targetAmount = parseFloat(targetAmountObj[0].amount);
    }
    respArray.push(getMonthlyParsedStats(data, month, targetAmount));
  });

  return {
    respArray,
    totalAmount: processedDataObj.totalAmount,
    totalService: processedDataObj.totalService
  };
};

const getMonthlyParsedStats = (data, month, target) => {
  let totalAmount = 0;
  let totalService = 0;
  let itemExpense = 0;
  let overDueAmount = 0;
  let processedData = [];
  console.log("data ", data);
  if (data && data.length > 0) {
    processedData = data.map(obj => {
      let dueAmount = obj.is_due_amount || 0;
      totalAmount = parseFloat(obj.received_amount) + totalAmount;
      totalService = parseFloat(obj.service_expense) + totalService;
      itemExpense = parseFloat(obj.expense_items) + itemExpense;
      overDueAmount = parseFloat(dueAmount) + overDueAmount;
    });
  }

  return [month, totalAmount, totalService, itemExpense, overDueAmount, target];
};

const parsedSimplifiedData = (data, isTarget) => {
  let totalAmount = 0;
  let totalService = 0;
  let processedData = [];
  if (data && data.length > 0) {
    if (!isTarget) {
      processedData = data.map(obj => {
        totalAmount = parseFloat(obj.received_amount) + totalAmount;
        totalService = parseFloat(obj.service_expense) + totalService;

        return {
          ...obj,
          month: moment(obj.booking_date).format("MMM"),
          year: new Date(obj.booking_date).getFullYear()
        };
      });
    } else {
      processedData = data.map(obj => {
        let monthYear = obj.month_year.split("-");
        monthYear = monthYear[1] + "-" + monthYear[0];
        return {
          ...obj,
          month: moment(monthYear).format("MMM")
        };
      });
    }
  }

  return { processedData, totalAmount, totalService };
};

const getNonClosedProcessedData = (resp, stats) => {
  const data = resp.body;
  let processedData = [];
  const processedObj = parsedStats(data);

  return {
    totalAmount: processedObj.totalAmount,
    totalService: processedObj.totalService,
    totalOrders: processedObj.processedData.length
  };
};

const getOverDueProcessedData = (resp, stats) => {
  const data = resp.body;
  let processedData = [];
  const processedObj = parsedOverDueStats(data);

  let currentMonth = _.groupBy(processedObj.processedData, "currentMonth");
  let previousMonth = _.groupBy(processedObj.processedData, "previousMonth");

  const currentMonthObj = parsedOverDueStats(currentMonth[true]);
  const previousMonthObj = parsedOverDueStats(previousMonth[true]);

  return {
    overDueAmount: processedObj.overDueAmount,
    totalService: processedObj.totalService,
    totalOrders: processedObj.processedData.length,
    currentMonthOverDueAmount: currentMonthObj.overDueAmount,
    currentMonthService: currentMonthObj.totalService,
    currentMonthOrders: currentMonthObj.processedData.length,
    prevMonthOverDueAmount: previousMonthObj.overDueAmount,
    prevMonthOrders: previousMonthObj.processedData.length,
    prevMonthService: previousMonthObj.totalService
  };
};

const parsedOverDueStats = data => {
  let overDueAmount = 0;
  let totalService = 0;
  let processedData = [];
  let previousYear = new Date().getFullYear();
  let previousMonth = new Date().getMonth() - 1;

  if (previousMonth < 0) {
    previousMonth = 11;
    previousYear = previousYear - 1;
  }
  if (data && data.length > 0) {
    processedData = data.map(obj => {
      let dueAmount = obj.is_due_amount || 0;
      let serviceExpense = obj.service_expense || 0;
      overDueAmount = parseFloat(dueAmount) + overDueAmount;
      totalService = parseFloat(serviceExpense) + totalService;

      return {
        ...obj,
        month: new Date(obj.booking_date).getMonth(),
        year: new Date(obj.booking_date).getFullYear(),
        currentMonth:
          new Date(obj.booking_date).getMonth() === new Date().getMonth() &&
          new Date(obj.booking_date).getFullYear() === new Date().getFullYear(),
        previousMonth:
          new Date(obj.booking_date).getMonth() === previousMonth &&
          new Date(obj.booking_date).getFullYear() === previousYear
      };
    });
  }

  return { processedData, overDueAmount, totalService };
};

const getProcessedData = (resp, stats) => {
  const data = resp.body;
  let processedData = [];
  const processedObj = parsedStats(data);

  let currentMonth = _.groupBy(processedObj.processedData, "currentMonth");
  let previousMonth = _.groupBy(processedObj.processedData, "previousMonth");

  const currentMonthObj = parsedStats(currentMonth[true]);
  const previousMonthObj = parsedStats(previousMonth[true]);

  return {
    totalAmount: processedObj.totalAmount,
    totalService: processedObj.totalService,
    totalOrders: processedObj.processedData.length,
    currentMonthAmount: currentMonthObj.totalAmount,
    currentMonthService: currentMonthObj.totalService,
    currentMonthOrders: currentMonthObj.processedData.length,
    prevMonthAmount: previousMonthObj.totalAmount,
    prevMonthService: previousMonthObj.totalService,
    prevMonthOrders: previousMonthObj.processedData.length
  };
};

const parsedStats = data => {
  let totalAmount = 0;
  let totalService = 0;
  let processedData = [];
  let previousYear = new Date().getFullYear();
  let previousMonth = new Date().getMonth() - 1;
  if (previousMonth < 0) {
    previousMonth = 11;
    previousYear = previousYear - 1;
  }
  if (data && data.length > 0) {
    processedData = data.map(obj => {
      if (obj.received_amount) {
        var expenseItems =
          obj.expense_items && obj.expense_items != "NAN"
            ? parseFloat(obj.expense_items)
            : 0;
        totalAmount = parseFloat(obj.received_amount) + totalAmount;
        totalService =
          parseFloat(obj.service_expense) + totalService + expenseItems;
      }

      return {
        ...obj,
        month: new Date(obj.booking_date).getMonth(),
        year: new Date(obj.booking_date).getFullYear(),
        currentMonth:
          new Date(obj.booking_date).getMonth() === new Date().getMonth() &&
          new Date(obj.booking_date).getFullYear() === new Date().getFullYear(),
        previousMonth:
          new Date(obj.booking_date).getMonth() === previousMonth &&
          new Date(obj.booking_date).getFullYear() === previousYear
      };
    });
  }

  return { processedData, totalAmount, totalService };
};
