import initialState from "./initialState";

export default function(state = initialState.print, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "PRINT_ORDER_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "PRINT_ORDER_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        url: action.response,
        fetching: false
      };
      break;
    }

    case "PRINT_ORDER_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        fetching: false,
        isError: true
      };

      break;
    }

    case "RESET_PRINT_STATE": {
      ////console.log('newState action', action);

      return {
        ...state,
        url: "",
        fetching: false,
      };

      break;
    }

    default: {
      return state;
    }
  }
}
