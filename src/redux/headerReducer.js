import {Add_header_States, Remove_header_States} from './constants';

const initialState = [];

export const headerReducer = (state = initialState, action) => {
  // console.log(...state,'bbb')
  switch (action.type) {
    case Add_header_States:
      if (!action.payload) {
        return state;
      }
      return [action.payload];

    case Remove_header_States:
      return [];
    default:
      return state;
  }
};
