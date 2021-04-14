import { ActionType } from '../action-types';
import { CellType } from '../cell';

export type Directions = 'up' | 'down';

// action interfaces
export interface MoveCellAction {
	type: ActionType.MOVE_CELL;
	payload: {
		id: string;
		direction: Directions;
	};
}

export interface DeleteCellAction {
	type: ActionType.DELETE_CELL;
	payload: string;
}

export interface InsertCellAfterAction {
	type: ActionType.INSERT_CELL_AFTER;
	payload: {
		id: string | null;
		type: CellType;
	};
}

export interface UpdateCellAction {
	type: ActionType.UPDATE_CELL;
	payload: {
		id: string;
		content: string;
	};
}

// union
export type Action =
	| MoveCellAction
	| DeleteCellAction
	| InsertCellAfterAction
	| UpdateCellAction;
