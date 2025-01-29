import {
  draftRemove_All_Cart,
  draftRemove_To_Cart,
  draftAdd_To_Cart,
} from './constants';

const initialState = [];

export const mainDraftReducer = (state = initialState, action) => {
  // console.log(...state,'bbb')
  switch (action.type) {
    case draftAdd_To_Cart:
      if (!action.payload) {
        return state;
      }
      console.log(action.payload, 'red');
      // return [action.payload];
      return [...state, action.payload];

    case draftRemove_To_Cart:
      return state.filter(order => order?.lineid !== action.payload);

    case draftRemove_All_Cart:
      return [];
    default:
      return state;
  }
};
