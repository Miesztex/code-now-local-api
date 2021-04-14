import { FaPlus } from 'react-icons/fa';
import { useActions } from '../hooks/use-actions';
import './add-cell.css';

interface AddCellProps {
	nextCellId: string | null;
	forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId, forceVisible }) => {
	const { insertCellAfter } = useActions();
	return (
		<div className={`add-cell ${forceVisible && 'force-visible'}`}>
			<div className='add-btns'>
				<button
					className='button is-primary is-small is-rounded'
					onClick={() => insertCellAfter(nextCellId, 'code')}>
					<div className='icon'>
						<FaPlus />
					</div>
					Code
				</button>
				<button
					className='button is-primary is-small is-rounded'
					onClick={() => insertCellAfter(nextCellId, 'text')}>
					<div className='icon'>
						<FaPlus />
					</div>
					Note
				</button>
			</div>
			<div className='divider'></div>
		</div>
	);
};

export default AddCell;
