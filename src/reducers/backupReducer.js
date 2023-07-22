import initialState from "./initialState";

export default function(state = initialState.print, action) {
  ////console.log('newState state', state);
  ////console.log('newState state', action.type);
  switch (action.type) {
    case "BACK_UP_DATABASE": {
      return { ...state, fetching: true };
      break;
    }

    case "BACK_UP_DATABASE_DONE": {
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
