import {Add_Filters, Remove_Filters} from './constants';

const initialState = [];

export const FilterReducer = (state = initialState, action) => {
  // console.log(...state,'bbb')
  switch (action.type) {
    case Add_Filters:
      if (!action.payload) {
        return state;
      }
      return [action.payload];

    case Remove_Filters:
      return [];
    default:
      return state;
  }
};
