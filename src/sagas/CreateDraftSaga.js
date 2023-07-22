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
  createDraftItems,
  deleteDraftItems
} from "../api/methods/EventItem";
import { createCustomer } from "../api/methods/Customer";
import { createDraft, deleteDraft } from "../api/methods/Draft";
import * as draftAction from "../actions/drafts";

import moment from "moment";
import { act } from "react-test-renderer";

// Our worker Saga that logins the user
export default function* createDraftSync(action) {
  let isCustomerCreated = false;
  let isOrderCreated = false;
  let draftId;
  let response, responseDraft, responseEventDetail;
  try {
    //console.log("action -> ", action);
    response = yield call(createCustomer, action.data.customer);

    if (response.status === 200) {
      const customerObj = response.body;
      //console.log("customerObj Saga -> ", customerObj);
      if (customerObj.length > 0) {
        isCustomerCreated = true;
        let orderReqObj = action.data.draft;
        orderReqObj.customer_id = customerObj[0].id;
        console.log("customerObj Saga -> ", orderReqObj);
        responseDraft = yield call(createDraft, orderReqObj);
        const draftObj = responseDraft.body;
        //console.log("draftObj Saga -> ", draftObj);
        if (draftObj.length > 0) {
          isOrderCreated = true;
          draftId = draftObj[0].id;
          const dataObj = {
            draftId: draftObj[0].id,
            customerId: customerObj[0].id,
            eventItems: action.data.eventItems
          };
          yield call(deleteDraftItems, draftId);
          responseEventDetail = yield call(createDraftItems, dataObj);
          const eventDetails = responseEventDetail.body;
          //console.log("eventDetails Saga -> ", eventDetails);
          if (eventDetails.length > 0) {
            let data = {
              customer: customerObj[0],
              draft: draftObj[0]
            };

            yield put(draftAction.createDraftFulfilled(data));
          }
        } else {
          throw "error in creating order";
        }
      } else {
        throw "error in creating customer";
      }
    } else {
      throw "error in creating customer";
    }
  } catch (ex) {
    //console.log("error ", ex);
    if (isOrderCreated) {
      yield call(deleteDraftItems, draftId);
      yield call(deleteDraft, draftId);
    }
    yield put(draftAction.createDraftRejected());
  }
}
