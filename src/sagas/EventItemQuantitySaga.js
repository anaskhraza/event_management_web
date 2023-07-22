/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

// import loginUser from 'app/api/methods/loginUser';
import { getEventItemsQuantityForOrders } from '../api/methods/EventItem';
import * as eventItemAction from '../actions/eventItem';

import moment from 'moment';

// Our worker Saga that logins the user
export default function* eventItemQuantitySync(action) {
    let response;
    try {
            //console.log("action -> ", action);
            response = yield call(getEventItemsQuantityForOrders, action.data);
        
        if (response.status === 200) {
            const data = response.body;
            yield put(eventItemAction.fetchUpdatedQuantityFulfilled(data));
        }
    } catch (ex) {
        //console.log("error ", ex);
        yield put(eventItemAction.fetchUpdatedQuantityRejected());
    }

}