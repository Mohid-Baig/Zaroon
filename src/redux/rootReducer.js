import {combineReducers} from 'redux';
import {reducer} from '../redux/reducer';
import {mainDraftReducer} from './mainDraftReducer';
import {headerReducer} from './headerReducer';
import {FilterReducer} from './FiltersReducer';

export default combineReducers({
  reducer,
  mainDraftReducer,
  headerReducer,
  FilterReducer,
});
