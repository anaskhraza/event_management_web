/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";

// import loginUser from 'app/api/methods/loginUser';
import { getDraftList, deleteDraft } from "../api/methods/Draft";
import { deleteDraftItems } from "../api/methods/EventItem";
import * as draftAction from "../actions/drafts";

import moment from "moment";

// Our worker Saga that logins the user
export default function* deleteDraftSync(action) {
  let response;
  try {
    const data = action.data;
    const draftId = action.draftId;
    const isDraftFetch = action.isList;
    let draftOrderResp = "";
    draftOrderResp = yield call(deleteDraftItems, draftId);
    draftOrderResp = yield call(deleteDraft, draftId);
    //console.log("response -> ", response);
    if (draftOrderResp.status === 200) {
      if (isDraftFetch) {
        response = yield call(getDraftList);
        //console.log("response -> ", response);
        if (response.status === 200) {
          const data = response.body;
          yield put(draftAction.fetchDraftFulfilled(data));
        } else {
          yield put(draftAction.fetchDraftRejected());
        }
      } else {
        const data = draftOrderResp.body;
        yield put(draftAction.deleteDraftFulfilled(data));
      }
    } else {
      yield put(draftAction.deleteDraftRejected());
    }
  } catch (ex) {
    //console.log("error ", ex);
    yield put(draftAction.deleteDraftRejected());
  }
}
