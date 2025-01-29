import {
  Add_To_Cart,
  Remove_To_Cart,
  Remove_All_Cart,
  Add_header_States,
  Remove_header_States,
  draftAdd_To_Cart,
  draftRemove_To_Cart,
  draftRemove_All_Cart,
  Add_Filters,
  Remove_Filters,
} from './constants';

export const addToCart = order => ({
  type: Add_To_Cart,
  payload: order,
});

export const removeFromCart = orderId => ({
  type: Remove_To_Cart,
  payload: orderId,
});
export const removeallcart = () => ({
  type: Remove_All_Cart,
});

export const draftaddToCart = order => ({
  type: draftAdd_To_Cart,
  payload: order,
});

export const draftremoveFromCart = orderId => ({
  type: draftRemove_To_Cart,
  payload: orderId,
});
export const draftremoveallcart = () => ({
  type: draftRemove_All_Cart,
});

export const addHeaderState = order => ({
  type: Add_header_States,
  payload: order,
});

export const removeHeaderState = () => ({
  type: Remove_header_States,
});

export const addFilter = order => ({
  type: Add_Filters,
  payload: order,
});

export const removeFilter = () => ({
  type: Remove_Filters,
});
