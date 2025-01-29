import {Add_To_Cart, Remove_All_Cart, Remove_To_Cart} from './constants';

const initialState = [];

export const reducer = (state = initialState, action) => {
  // console.log(...state,'bbb')
  switch (action.type) {
    case Add_To_Cart:
      if (!action.payload) {
        return state;
      }
      return [...state, action.payload];

    case Remove_To_Cart:
      return state.filter(order => order?.lineid !== action.payload);
    case Remove_All_Cart:
      return [];
    default:
      return state;
  }
};
