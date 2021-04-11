import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
	loading: boolean;
	error: string | null;
	order: string[];
	data: {
		[key: string]: Cell;
		// '123': { id: '123', ...}
	};
}

const initialState: CellsState = {
	loading: false,
	error: null,
	order: [],
	data: {},
};
// (
//state -> ..., cells-state interface-> ..., cell -> cell type
//action -> one of: action inteface -> action type, payload
// ) :
// return: CellsState
const reducer = produce((state: CellsState = initialState, action: Action) => {
	switch (action.type) {
		case ActionType.UPDATE_CELL:
			const { id, content } = action.payload;
			state.data[id].content = content;
			return state;

		case ActionType.DELETE_CELL:
			delete state.data[action.payload];
			state.order = state.order.filter(id => id !== action.payload);
			return state;

		case ActionType.MOVE_CELL:
			const { direction } = action.payload;
			const { order } = state;
			const idx = order.findIndex(id => id === action.payload.id);
			const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
			if (targetIdx < 0 || targetIdx > state.order.length - 1) return;
			//swap operation
			[order[idx], order[targetIdx]] = [order[targetIdx], order[idx]];
			return state;

		case ActionType.INSERT_CELL_BEFORE:
			const cell: Cell = {
				id: getRandomId(),
				type: action.payload.type,
				content: '',
			};
			// add to data
			state.data[cell.id] = cell;
			// change order
			const index = state.order.findIndex(id => id === action.payload.id);
			if (index < 0) state.order.push(cell.id);
			else state.order.splice(index, 0, cell.id);
			return state;

		default:
			return state;
	}
});

const getRandomId = () => {
	return Math.random().toString(36).substr(2, 5);
};

export default reducer;
