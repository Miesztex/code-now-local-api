import { useEffect } from 'react';

import Resizable from './resizable';

import './code-cell.css';
import CodeEditor from './code-editor';
import Preview from './preview';

import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
	cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
	const { updateCell, createBundle } = useActions();
	const bundle = useTypedSelector(state => state.bundles[cell.id]);

	const cumulativeCode = useCumulativeCode(cell.id);
	useEffect(() => {
		if (!bundle) {
			createBundle(cell.id, cumulativeCode);
			return;
		}

		const bundleTO = setTimeout(async () => {
			createBundle(cell.id, cumulativeCode);
		}, 1000);
		return () => {
			clearTimeout(bundleTO);
		};
		// eslint-disable-next-line
	}, [cumulativeCode, cell.id, createBundle]);

	return (
		<Resizable direction='vertical'>
			<div style={{ height: 'calc(100% - 10px)', display: 'flex' }}>
				<Resizable direction='horizontal'>
					<CodeEditor
						initialValue={cell.content}
						onChange={value => updateCell(cell.id, value)}
					/>
				</Resizable>
				<div className='loader-background'>
					{!bundle || bundle.loading ? (
						<div className='loader-container'>
							<div className='loader'>Loading...</div>
						</div>
					) : (
						<Preview code={bundle.code} error={bundle.error} />
					)}
				</div>
			</div>
		</Resizable>
	);
};

export default CodeCell;
