import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';

// unpkg bundling plugin
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
	const [input, setInput] = useState('');
	const [code, setCode] = useState('');
	const ref = useRef<any>();

	const startService = async () => {
		// webassembly reference
		ref.current = await esbuild.startService({
			worker: true,
			wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
		});
	};

	useEffect(() => {
		startService();
		return () => {};
	}, []);

	const onClick = async () => {
		if (!ref.current) return;

		// ESBuild: transpile + bundle
		const result = await ref.current.build({
			entryPoints: ['index.js'],
			bundle: true,
			write: false,
			// warnings fix
			define: {
				'process.env.NODE_ENV': '"production"',
				global: 'window',
			},
			plugins: [unpkgPathPlugin(), fetchPlugin(input)],
		});
		setCode(result.outputFiles[0].text);
	};

	return (
		<div>
			<textarea
				name=''
				id=''
				onChange={e => setInput(e.target.value)}
				value={input}></textarea>
			<div>
				<button onClick={onClick}>Submit</button>
			</div>
			<pre>{code}</pre>
		</div>
	);
};

ReactDOM.render(<App />, document.querySelector('#root'));
