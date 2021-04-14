import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';

const reducers = combineReducers({
	cells: cellsReducer,
	bundles: bundlesReducer,
});

export default reducers;

// information what does useSelector return
export type RootState = ReturnType<typeof reducers>;
