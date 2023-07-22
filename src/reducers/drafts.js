import initialState from "./initialState";

export default function(state = initialState.drafts, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "RESET_STATE": {
      return {
        state,
        isError: false,
        orderNo: null,
        isPendingOrderCreation: false,
      }
    }
    case "CREATE_DRAFT": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isOrderProcessModal: true,
        isPendingOrderCreation: true,
        isPendingOrderCreation: false,
        isError: false,
        orderNo: null
      };
      break;
    }
    case "CREATE_DRAFT_REJECTED": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isOrderProcessModal: true,
        isDraft: true,
        isPendingOrderCreation: false,
        isError: true,
        orderNo: null
      };
      break;
    }
    case "CREATE_DRAFT_FULFILLED": {
      ////console.log("newState", state);
      //console.log("newState", action);
      return {
        ...state,
        isOrderProcessModal: true,
        isDraft: true,
        isPendingOrderCreation: false,
        isError: false,
        draft: action.response
      };
      break;
    }
    case "FETCH_DRAFT": {
      return { ...state };
      break;
    }

    case "FETCH_DRAFT_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "FETCH_DRAFT_FULFILLED": {
      ////console.log('newState action', action);
      ////console.log('customer >> reducer', action.payload.data.data);
      return {
        ...state,
        data: action.response,
        fetching: false
      };
      break;
    }

    case "FETCH_DRAFT_REJECTED": {
      ////console.log('newState action', action);

      return {
        ...state,
        isError: true
      };

      break;
    }

    case "DELETE_DRAFT_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "DELETE_DRAFT_FULFILLED": {
      ////console.log('newState action', action);

      return {
        ...state,
        data: action.response,
        fetching: false,
        isError: false
      };

      break;
    }

    case "DELETE_DRAFT_REJECTED": {
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
