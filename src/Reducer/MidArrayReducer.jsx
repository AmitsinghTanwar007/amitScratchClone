// src/reducers/midArrayReducer.jsx
const initialState = {};

const midArrayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INSERT_INTO_MID_ARRAY":
      return {
        ...state,
        [action.payload.id]: [
          ...(state[action.payload.id] || []),
          {
            componentId: action.payload.componentId,
            instanceId: action.payload.instanceId,
          },
        ],
      };

    case "DELETE_FROM_MID_ARRAY":
      return {
        ...state,
        [action.payload.id]: state[action.payload.id]
          ? state[action.payload.id].filter(
              (item) => item.instanceId !== action.payload.instanceId
            )
          : [],
      };

    default:
      return state;
  }
};

export default midArrayReducer;
