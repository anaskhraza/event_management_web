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
  getEventItemsForOrders,
  fetchItemByOrderId,
  fetchItemByDraftId
} from "../api/methods/EventItem";
import * as eventItemAction from "../actions/eventItem";

import moment from "moment";

// Our worker Saga that logins the user
export default function* eventItemSync(action) {
  let response;
  try {
    let responseOrderedItems;
    //console.log("action -> ", action);
    const isUpdateEvent = action.isUpdateEvent;
    const orderId = action.orderId;
    const draftId = action.draftId;
    const isDuplicate = action.isDuplicate;

    let isDraft = false;
    if (draftId) {
      isDraft = true;
    }

    response = yield call(getEventItemsForOrders, action.data);

    if (isUpdateEvent || isDraft || isDuplicate) {
      if (!isDraft) {
        responseOrderedItems = yield call(fetchItemByOrderId, orderId);
      } else {
        responseOrderedItems = yield call(fetchItemByDraftId, draftId);
        //console.log("responseOrderedItems -> ", responseOrderedItems);
      }

      const itemsData = response.body;
      responseOrderedItems = responseOrderedItems.body;

      const {
        eventItems,
        orderedData,
        modifiedItems,
        selectedRowKeys
      } = dataObjectForItems(
        itemsData,
        responseOrderedItems,
        action.data.startDate,
        action.data.endDate,
        isDraft,
        isDuplicate
      );

      yield put(
        eventItemAction.fetchItemFulfilled(
          eventItems,
          orderedData,
          modifiedItems,
          selectedRowKeys
        )
      );
    } else {
      //console.log("response -> ", response);
      if (response.status === 200) {
        const data = response.body;
        yield put(eventItemAction.fetchItemFulfilled(data));
      }
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(eventItemAction.fetchItemRejected());
  }
}

const dataObjectForItems = (
  itemsData,
  orderedItems,
  startDateFormat,
  endDateFormat,
  isDraft,
  isDuplicate
) => {
  let orderedData = [];
  let sDate, eDate, sDateFormatted, eDateFormatted;
  let modifiedItems = [];
  let selectedRowKeys = [];
  //console.log("orderedItems -> ", orderedItems);
  const responseOrderedItems = _.groupBy(orderedItems, "product_id");
  //console.log("responseOrderedItems -> ", responseOrderedItems);

  const eventItems = _.map(itemsData, obj => {
    let productId = obj.id;
    let isOrderedItem = responseOrderedItems[productId];

    if (isOrderedItem && !_.isEmpty(isOrderedItem)) {
      if (!isDraft && !isDuplicate) {
        eDate = moment(isOrderedItem[0].event_booking_end);
        sDate = moment(isOrderedItem[0].event_booking_start);
        eDateFormatted = moment(isOrderedItem[0].event_booking_end).format(
          "MM/DD/YYYY"
        );
        sDateFormatted = moment(isOrderedItem[0].event_booking_start).format(
          "MM/DD/YYYY"
        );
      } else {
        eDate = moment(endDateFormat);
        sDate = moment(startDateFormat);
        sDateFormatted = startDateFormat;
        eDateFormatted = endDateFormat;
      }

      var diffDays = eDate.diff(sDate, "days");
      if (diffDays == 0) {
        diffDays = 1;
      }
      const eventDate = `${sDateFormatted} ${eDateFormatted}`;
      var customRate = obj.rate;
      if (
        isOrderedItem[0].order_item_price &&
        isOrderedItem[0].order_item_price != "NAN" &&
        isOrderedItem[0].order_item_price != 0
      ) {
        customRate = isOrderedItem[0].order_item_price;
      }
      let orderedObj = {
        ...obj,
        databaseId: isOrderedItem[0].id,
        id: productId,
        order_id: isOrderedItem[0].order_id,
        customer_id: isOrderedItem[0].customer_id,
        quantity_ordered: isOrderedItem[0].order_quantity,
        event_booking_start: sDateFormatted,
        event_booking_end: eDateFormatted,
        rate: customRate,
        price: isOrderedItem[0].order_quantity * diffDays * customRate,
        no_of_days: diffDays,
        eventDate: eventDate
      };
      orderedData.push(orderedObj);
      selectedRowKeys.push(obj.key);
      //console.log("selectedRowKeys -> ", selectedRowKeys);
      //console.log("orderedData -> ", orderedData);

      if (
        sDateFormatted !== startDateFormat ||
        eDateFormatted !== endDateFormat
      ) {
        modifiedItems.push(orderedObj);
        //console.log("modifiedItems -> ", modifiedItems);
      }

      return orderedObj;
    } else {
      return obj;
    }
  });
  // //console.log(
  //   "Arrray of Items -> ",
  //   eventItems,
  //   orderedData,
  //   modifiedItems,
  //   selectedRowKeys
  // );
  return { eventItems, orderedData, modifiedItems, selectedRowKeys };
};
