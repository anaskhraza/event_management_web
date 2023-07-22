/**
 *  Redux saga class init
 */
import { takeEvery, all } from "redux-saga/effects";
import * as types from "../actions/types";
import EventItemSaga from "./EventItemSaga";
import EventItemQuantitySaga from "./EventItemQuantitySaga";
import CreateEventSaga from "./CreateEventSaga";
import OrderListSaga from "./OrderListSaga";
import UpdateOrderSage from "./UpdateOrderSaga";
import PreapreUpdateEventSaga from "./PreapreUpdateEventSaga";
import UpdateOrderSaga from "./UpdateOrderSaga";
import DraftListSaga from "./DraftListSaga";
import CreateDraftSaga from "./CreateDraftSaga";
import DeleteDraftSaga from "./DeleteDraftSaga";
import DeleteCategorySaga from "./DeleteCategorySaga";
import DeleteItemsSaga from "./DeleteItemsSaga";
import CreateCategorySaga from "./CreateCategorySaga";
import CreateItemSaga from "./CreateItemSaga";
import CategorySaga from "./CategorySaga";
import TargetSaga from "./TargetSaga";
import CreateTargetSaga from "./CreateTargetSaga";
import DeleteTargetSaga from "./DeleteTargetSaga";
import HomeOrderSaga from "./HomeOrderSaga";
import UpcomingOrderSaga from "./UpcomingOrderSaga";
import PrintSaga from "./PrintSaga";
import BackupSaga from "./BackupSaga";
import CustomerSaga from "./CustomerSaga";
import CreateCustomerSaga from "./CreateCustomerSaga";
import ItemExpenseSaga from "./ItemExpenseSaga";

export default function* watch() {
  console.log("hre");
  const watchersRequest = [
    takeEvery(types.FETCH_ITEMS_PENDING, EventItemSaga),
    takeEvery(types.FETCH_ITEMS_QUANTITY_PENDING, EventItemQuantitySaga),
    takeEvery(types.CREATE_EVENT_PENDING, CreateEventSaga),
    takeEvery(types.FETCH_ORDER_PENDING, OrderListSaga),
    takeEvery(types.PREPARE_UPDATE_EVENT_PENDING, PreapreUpdateEventSaga),
    takeEvery(types.UPDATE_ORDER_PENDING, UpdateOrderSaga),
    takeEvery(types.FETCH_DRAFT_PENDING, DraftListSaga),
    takeEvery(types.CREATE_DRAFT_PENDING, CreateDraftSaga),
    takeEvery(types.DELETE_DRAFT_PENDING, DeleteDraftSaga),
    takeEvery(types.DELETE_CATEGORIES_PENDING, DeleteCategorySaga),
    takeEvery(types.DELETE_ITEMS_PENDING, DeleteItemsSaga),
    takeEvery(types.CREATE_ITEMS_PENDING, CreateItemSaga),
    takeEvery(types.CREATE_CATEGORIES_PENDING, CreateCategorySaga),
    takeEvery(types.FETCH_CATEGORIES_PENDING, CategorySaga),
    takeEvery(types.FETCH_TARGETS_PENDING, TargetSaga),
    takeEvery(types.CREATE_TARGETS_PENDING, CreateTargetSaga),
    takeEvery(types.DELETE_TARGETS_PENDING, DeleteTargetSaga),
    takeEvery(types.FETCH_HOME_ORDER_PENDING, HomeOrderSaga),
    takeEvery(types.FETCH_UPCOMING_ORDER_PENDING, UpcomingOrderSaga),
    takeEvery(types.PRINT_ORDER_PENDING, PrintSaga),
    takeEvery(types.FETCH_CUSTOMER_PENDING, CustomerSaga),
    takeEvery(types.CREATE_CUSTOMER, CreateCustomerSaga),
    takeEvery(types.ITEM_EXPENSE_PENDING, ItemExpenseSaga),
    takeEvery("BACK_UP_DATABASE", BackupSaga)
  ];

  yield all(watchersRequest);
}
