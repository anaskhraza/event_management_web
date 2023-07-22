import initialState from "./initialState";

export default function(state = initialState.categories, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "RESET_STATE": {
      return {
        ...state,
        isError: false,
      };
    }
    case "CREATE_CATEGORIES": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isError: false,
        orderNo: null
      };
      break;
    }
    case "CREATE_CATEGORIES_REJECTED": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isError: true,
        orderNo: null
      };
      break;
    }
    case "CREATE_CATEGORIES_FULFILLED": {
      ////console.log("newState", state);
      //console.log("newState", action);
      return {
        ...state,
        isError: false,
        category: action.response
      };
      break;
    }
    case "FETCH_CATEGORIES": {
      return { ...state };
      break;
    }

    case "FETCH_CATEGORIES_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "FETCH_CATEGORIES_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        data: action.response,
        fetching: false
      };
      break;
    }

    case "FETCH_CATEGORIES_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        isError: true
      };

      break;
    }

    case "DELETE_CATEGORIES_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "DELETE_CATEGORIES_FULFILLED": {
      ////console.log('newState action', action);

      return {
        ...state,
        data: action.response,
        fetching: false,
        isError: false
      };

      break;
    }

    case "DELETE_CATEGORIES_REJECTED": {
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
