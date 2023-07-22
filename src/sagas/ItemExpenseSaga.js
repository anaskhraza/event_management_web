/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { fetchOrderedItems } from "../api/methods/EventItem";
import * as itemExpenseAction from "../actions/targets";

import moment from "moment";
import { updateOrder } from "../api/methods/Order";

// Our worker Saga that logins the user
export default function* itemExpenseSync(action) {
  let response;
  response = yield call(fetchOrderedItems);

  console.log("response -> ", response);
  if (response.status === 200) {
    const data = response.body;

    const data1 = data.map(obj => {
      var rate1 = obj.order_item_price;
      if (!rate1 || rate1 == "NAN" || rate1 == 0) {
        rate1 = obj.Product_Booking_Key.rate;
      }
      var days = Math.abs(
        moment(obj.event_booking_start, "YYYY-MM-DD")
          .startOf("day")
          .diff(
            moment(obj.event_booking_end, "YYYY-MM-DD").startOf("day"),
            "days"
          )
      );

      if (days == 0) {
        days = 1;
      }

      return {
        ...obj,
        category: obj.Product_Booking_Key.Category.category_name,
        categoryId: obj.Product_Booking_Key.Category.id,
        productRate: rate1,
        days: days,
        totalCost: rate1 * obj.order_quantity * days
      };
    });

    const data2 = _.groupBy(data1, "category");
    const itemsExpense = data2["itemExpense"];
    const data3 = _.groupBy(itemsExpense, "order_id");
    const orderIds = _.keys(data3);

    for (var i = 0; i < orderIds.length; i++) {
      const orderId = orderIds[i];
      const data4 = data3[orderId];
      const totalCost = _.sumBy(data4, "totalCost");
      console.log("totalCost ", totalCost, orderId);
      let updateOrderResp = yield call(updateOrder, orderId, {
        expense_items: totalCost
      });

      console.log("updateOrderResp ", updateOrderResp);
    }

    yield put(itemExpenseAction.updateItemExpenseCompleted());
  }
}
