import { object } from "webidl-conversions";
import initialState from "./initialState";

export default function(state = initialState.eventItem, action) {
  ////console.log('newState state', state);

  switch (action.type) {
    case "FETCH_ITEMS": {
      return { ...state };
      break;
    }
    case "FETCH_ITEMS_PENDING": {
      return { ...state, fetching: true };
      break;
    }
    case "FETCH_ITEMS_FULFILLED": {
      ////console.log('newState action', action);
      //console.log("items >> reducer", action.response);
      return {
        ...state,
        data: action.response,
        orderedData: action.orderedData || [],
        modifiedItems: action.modifiedItems || [],
        selectedRowKeys: action.selectedRowKeys || [],
        diableOkButton: true,
        orderCost: getOrderDataCost(action.orderedData) || 0,
        itemExpense: getItemExpenseCost(action.orderedData) || 0,
        fetching: false
      };
      break;
    }
    case "CREATE_ITEMS": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isError: false,
        orderNo: null
      };
      break;
    }
    case "CREATE_ITEMS_REJECTED": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isError: true,
        orderNo: null
      };
      break;
    }
    case "CREATE_ITEMS_FULFILLED": {
      ////console.log("newState", state);
      //console.log("newState", action);
      return {
        ...state,
        isError: false,
        category: action.response
      };
      break;
    }

    case "DELETE_ITEMS_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "DELETE_ITEMS_FULFILLED": {
      ////console.log('newState action', action);

      return {
        ...state,
        data: action.response,
        fetching: false,
        isError: false
      };

      break;
    }

    case "DELETE_ITEMS_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        fetching: false,
        isError: true
      };

      break;
    }

    case "FETCH_ITEMS_QUANTITY": {
      return { ...state };
      break;
    }
    case "FETCH_ITEMS_QUANTITY_PENDING": {
      return { ...state, fetchingUpdatedQuantity: true };
      break;
    }
    case "FETCH_ITEMS_QUANTITY_FULFILLED": {
      ////console.log('newState action', action);
      //console.log("items >> reducer", action.response);
      return {
        ...state,
        orderedData: action.response,
        fetchingUpdatedQuantity: false,
        diableOkButton: false
      };

      break;
    }

    case "UPDATE_DATA": {
      ////console.log('newState action State', state);
      ////console.log('newState action UPDATE_DATA', action);
      return {
        ...state,
        data: action.payload,
        diableOkButton: true,
        fetching: false
      };
      break;
    }
    case "UPDATE_DATA_ROW_KEY_SELECTED": {
      return {
        ...state,
        selectedRowKeys: action.payload.selectedRowKeys,
        data: action.payload.items,
        orderedData: action.payload.orderedData,
        modifiedItems: action.payload.modifiedItems,
        diableOkButton: true,
        orderCost: getOrderDataCost(action.payload.orderedData),
        itemExpense: getItemExpenseCost(action.payload.orderedData) || 0
      };
      break;
    }
    case "UPDATE_DATA_DATE_CHANGED": {
      return {
        ...state,
        data: action.payload.items,
        orderedData: action.payload.items,
        modifiedItems: action.payload.modifiedItems,
        diableOkButton: true,
        orderCost: getOrderDataCost(action.payload.items),
        itemExpense: getItemExpenseCost(action.payload.orderedData) || 0
      };
      break;
    }
    case "PREPARE_UPDATE_EVENT_ITEMS": {
      //console.log("newState", action);
      return {
        ...state,
        data: action.response.eventItems,
        orderedData: action.response.orderedData,
        modifiedItems: action.response.modifiedItems,
        selectedRowKeys: action.response.selectedRowKeys,
        diableOkButton: true,
        orderCost: getOrderDataCost(action.response.orderedData),
        itemExpense: getItemExpenseCost(action.payload.orderedData) || 0,
        fetching: false,
        error: null,
        fetchingUpdatedQuantity: false
      };
      break;
    }
    case "RESET_STATE": {
      ////console.log('newState', state);
      ////console.log('newState', action);
      return {
        state
      };
      break;
    }
    default: {
      return state;
    }
  }
}

function getOrderDataCost(orderedData) {
  if (orderedData) {
    return _.sumBy(orderedData, function(o) {
      return o.price;
    });
  }
}

function getItemExpenseCost(orderedData) {
  console.log("ordered Data Item Expense", orderedData);
  let expenseCost = 0;
  if (orderedData && orderedData.length > 0) {
    orderedData.forEach(object => {
      if (object.Category && object.Category.category_name == "itemExpense") {
        expenseCost = expenseCost + object.price;
      }
    });
  }
  return expenseCost;
}
