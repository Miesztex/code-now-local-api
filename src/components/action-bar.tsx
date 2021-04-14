import { useActions } from '../hooks/use-actions';
import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import './action-bar.css';

interface ActionBarProps {
	id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
	const { moveCell, deleteCell } = useActions();

	return (
		<div className='action-bar'>
			<button
				className='button is-primary is-small'
				onClick={() => moveCell(id, 'up')}>
				<FaArrowUp />
			</button>
			<button
				onClick={() => moveCell(id, 'down')}
				className='button is-primary is-small'>
				<FaArrowDown />
			</button>
			<button
				onClick={() => deleteCell(id)}
				className='button is-primary is-small'>
				<FaTimes />
			</button>
		</div>
	);
};

export default ActionBar;
