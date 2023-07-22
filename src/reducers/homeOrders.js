import initialState from "./initialState";

export default function(state = initialState.homeOrders, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "FETCH_HOME_ORDER_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "FETCH_HOME_ORDER_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        response: action.response,
        fetching: false,
        isError: false
      };
      break;
    }

    case "FETCH_HOME_ORDER_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        fetching: false,
        isError: true
      };

      break;
    }

    default: {
      return state;
    }
  }
}
