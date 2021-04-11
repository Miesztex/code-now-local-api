import { useEffect, useState } from 'react';

import Resizable from './resizable';
import CodeEditor from './code-editor';
import bundle from '../bundler';
import Preview from './preview';

const CodeCell = () => {
	const [input, setInput] = useState('');
	const [code, setCode] = useState('');
	const [err, setErr] = useState('');

	const onInputStop = async () => {
		const output = await bundle(input);
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
	}, [input]);

	return (
		<Resizable direction='vertical'>
			<div style={{ height: '100%', display: 'flex' }}>
				<Resizable direction='horizontal'>
					<CodeEditor
						initialValue='const a = 1;'
						onChange={value => setInput(value)}
					/>
				</Resizable>
				<Preview code={code} err={err} />
			</div>
		</Resizable>
	);
};

export default CodeCell;
