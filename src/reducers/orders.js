import initialState from "./initialState";

export default function(state = initialState.orderList, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "FETCH_ORDER": {
      return { ...state };
      break;
    }

    case "FETCH_ORDER_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "FETCH_ORDER_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        data: action.response,
        fetching: false
      };
      break;
    }


    case "FETCH_ORDER_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        isError: true
      };

      break;
    }

    case "UPDATE_ORDER": {
      return { ...state };
      break;
    }
    case "UPDATE_ORDER_PENDING": {
      return { ...state, fetching: true, receiveAmount: false };
      break;
    }

    case "UPDATE_ORDER_FULFILLED": {
      ////console.log('newState action', action);

      return {
        ...state,
        data: action.response,
        fetching: false,
        isError: false
      };

      break;
    }


    case "UPDATE_ORDER_REJECTED": {
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
