import initialState from "./initialState";

export default function(state = initialState.createEvent, action) {
  switch (action.type) {
    case "SET_CREATE_DATE": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      var newState = Object.assign({}, state);

      newState.eventDate =
        action.payload.eventStartDate && action.payload.eventEndDate
          ? action.payload.eventStartDate + " " + action.payload.eventEndDate
          : "";
      newState.eventStartDate = action.payload.eventStartDate;
      newState.eventEndDate = action.payload.eventEndDate;

      return newState;

      break;
    }
    case "CREATE_EVENT": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isOrderProcessModal: true,
        isPendingOrderCreation: true,
        isError: false,
        orderNo: null
      };
      break;
    }
    case "CREATE_EVENT_REJECTED": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        isOrderProcessModal: true,
        isPendingOrderCreation: false,
        isError: true,
        orderNo: null
      };
      break;
    }
    case "CREATE_EVENT_FULFILLED": {
      ////console.log("newState", state);
      //console.log("newState", action);
      return {
        ...state,
        isOrderProcessModal: true,
        isPendingOrderCreation: false,
        isError: false,
        order: action.response
      };
      break;
    }
    case "RESET_STATE": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        ...state,
        eventDate: "",
        order: null,
        eventStartDate: "",
        isOrderProcessModal: false,
        isPendingOrderCreation: false,
        eventEndDate: "",
        processedOrderNo: null,
        orderNo: null,
        isPendingCreation: null,
        isError: null
      };
      break;
    }
    default: {
      return state;
    }
  }
}
