import initialState from "./initialState";

export default function(state = initialState.itemExpense, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "ITEM_EXPENSE_PENDING": {
      return { ...state, fetching: true };
      break;
    }

    case "ITEM_EXPENSE_DONE": {
      return {
        ...state,
        fetching: false
      };

      break;
    }

    default: {
      return state;
    }
  }
}
