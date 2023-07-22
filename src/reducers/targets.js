import initialState from "./initialState";

export default function(state = initialState.targets, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "RESET_STATE": {
      return {
        state,
        auth: "",
        isError: false
      };
    }
    case "CREATE_TARGETS": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isError: false,
        orderNo: null
      };
      break;
    }
    case "CREATE_TARGETS_REJECTED": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isError: true,
        orderNo: null
      };
      break;
    }
    case "CREATE_TARGETS_FULFILLED": {
      ////console.log("newState", state);
      //console.log("newState", action);
      return {
        ...state,
        isError: false,
        category: action.response
      };
      break;
    }
    case "FETCH_TARGETS": {
      return { ...state };
      break;
    }

    case "FETCH_TARGETS_PENDING": {
      return { ...state, fetching: true, signInModal: false };
      break;
    }

    case "FETCH_TARGETS_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        data: action.response,
        auth: action.auth,
        fetching: false,
        signInModal: false
      };
      break;
    }

    case "FETCH_TARGETS_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        data: [],
        auth: "",
        closeOrdStats: "",
        nonClosedOrdStats: "",
        overDueOrdStats: "",
        yearlyOrdStats: "",
        isError: true,
        signInModal: true,
        signInError: action.signInError ? "Wrong Credentials" : ""
      };

      break;
    }

    case "UPDATE_DATA_TARGET": {
      return {
        ...state,
        closeOrdStats: action.closeOrdStats,
        nonClosedOrdStats: action.nonClosedOrdStats,
        overDueOrdStats: action.overDueOrdStats,
        yearlyOrdStats: action.yearlyOrdStats
      };
    }

    case "DELETE_TARGETS_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "DELETE_TARGETS_FULFILLED": {
      ////console.log('newState action', action);

      return {
        ...state,
        data: action.response,
        fetching: false,
        isError: false
      };

      break;
    }

    case "DELETE_TARGETS_REJECTED": {
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
