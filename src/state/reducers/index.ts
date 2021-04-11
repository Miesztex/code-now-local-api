import cellsReducer from './cellsReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
	cells: cellsReducer,
});

export default reducers;

// information what does useSelector return
export type RootState = ReturnType<typeof reducers>;
