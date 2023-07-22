import initialState from "./initialState";
import { act } from "react-test-renderer";

export default function(state = initialState, action) {
  //console.log("state ", state);
  const createEvent = state.createEvent || {};
  const eventItem = state.eventItem || {};
  const customer = state.customer || {};
  const orderDetail = state.orderDetail || {};

  switch (action.type) {
    case "PREPARE_UPDATE_EVENT": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        isEventUpdate: false,
        orderDetail
      };
      break;
    }

    case "PREPARE_UPDATE_EVENT_PENDING": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        isEventUpdate: true,
        orderDetail
      };
      break;
    }
    case "PREPARE_UPDATE_EVENT_REJECTED": {
      ////console.log("newState", state);
      ////console.log("newState", action);
      return {
        customer,
        isEventUpdate: true,
        orderDetail
      };
      break;
    }
    case "PREPARE_UPDATE_EVENT_FULFILLED": {
      //console.log("newState", action);
      return {
        customer: { ...action.response.customer[0] },
        isEventUpdate: true,
        orderDetail: { ...action.response.orderDetail }
      };
      break;
    }
    default: {
      return { createEvent, eventItem };
    }
  }
}

function getOrderDataCost(orderedData) {
  return _.sumBy(orderedData, function(o) {
    return o.price;
  });
}
