// @flow
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import counter from "./counter";
import createEvent from "./createEvent";
import eventItems from "./eventItems";
import orders from "./orders";
import drafts from "./drafts";
import categories from "./categoryReducer";
import prepareUpdateEvent from "./prepareUpdateEvent";
import targets from "./targets";
import upcoming from "./upcomingOrder";
import print from "./printReducer";
import home from "./homeOrders";
import backup from "./backupReducer";
import customers from "./customerReducer";
import itemExpense from "./itemExpenseReducer";

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter,
    createEvent,
    eventItems,
    orders,
    drafts,
    categories,
    prepareUpdateEvent,
    targets,
    upcoming,
    print,
    backup,
    home,
    customers,
    itemExpense
  });
}
