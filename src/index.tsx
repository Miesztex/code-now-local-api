import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import CodeEditor from './components/code-editor';

import 'bulmaswatch/superhero/bulmaswatch.min.css';

// unpkg bundling plugin
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
	const [input, setInput] = useState('');
	const ref = useRef<any>();
	const iframe = useRef<any>();

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

		iframe.current.srcDoc = html;

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

		// post to iframe
		iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
	};

	// html and js of iframe with listener of message post
	const html = `
	<html>
		<head></head>
		<body>
			<div id="root">
				<script>
				window.addEventListener('message', (event)=>{
						try{
							eval(event.data)
						} catch(error) {
							const root = document.querySelector('#root');
							root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
							throw error;
						}
					}, false)
				</script>
			</div>
		</body>
	</html>>
	`;

	return (
		<div>
			<CodeEditor
				initialValue='const a = 1;'
				onChange={value => setInput(value)}
			/>
			<textarea
				name=''
				id=''
				onChange={e => setInput(e.target.value)}
				value={input}></textarea>
			<div>
				<button onClick={onClick}>Submit</button>
			</div>
			<iframe
				title='preview'
				ref={iframe}
				srcDoc={html}
				sandbox='allow-scripts'
			/>
		</div>
	);
};

ReactDOM.render(<App />, document.querySelector('#root'));
