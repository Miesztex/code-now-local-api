import { useEffect, useState } from 'react';

import Resizable from './resizable';
import CodeEditor from './code-editor';
import bundle from '../bundler';
import Preview from './preview';

import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface CodeCellProps {
	cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
	const [code, setCode] = useState('');
	const [err, setErr] = useState('');
	const { updateCell } = useActions();

	const onInputStop = async () => {
		const output = await bundle(cell.content);
		setCode(output.code);
		setErr(output.err);
	};

	useEffect(() => {
		const bundleTO = setTimeout(() => {
			onInputStop();
		}, 1000);
		return () => {
			clearTimeout(bundleTO);
		};
	}, [cell.content]);

	return (
		<Resizable direction='vertical'>
			<div style={{ height: 'calc(100% - 10px)', display: 'flex' }}>
				<Resizable direction='horizontal'>
					<CodeEditor
						initialValue={cell.content}
						onChange={value => updateCell(cell.id, value)}
					/>
				</Resizable>
				<Preview code={code} err={err} />
			</div>
		</Resizable>
	);
};

export default CodeCell;
