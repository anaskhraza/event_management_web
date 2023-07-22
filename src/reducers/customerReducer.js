import initialState from "./initialState";

export default function(state = initialState.customers, action) {
  ////console.log('newState state', state);
  console.log("newState state", action);
  switch (action.type) {
    case "RESET_STATE": {
      return {
        ...state,
        isError: false
      };
    }

    case "FETCH_CUSTOMER": {
      return { ...state };
      break;
    }

    case "FETCH_CUSTOMER_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "FETCH_CUSTOMER_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        data: action.response,
        fetching: false
      };
      break;
    }
    case "CREATE_CUSTOMER": {
      console.log("action ", "aa");
      return {
        ...state,
        isError: false
      };
      break;
    }
    case "FETCH_CUSTOMER_REJECTED": {
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
