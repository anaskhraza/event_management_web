import initialState from "./initialState";

export default function(state = initialState.upcomingOrder, action) {
  console.log("newState state", state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "FETCH_UPCOMING_ORDER_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "FETCH_UPCOMING_ORDER_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        data: action.response,
        fetching: false
      };
      break;
    }

    case "FETCH_UPCOMING_ORDER_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        isError: true
      };

      break;
    }

    default: {
      return state;
    }
  }
}
