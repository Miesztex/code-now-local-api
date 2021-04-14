import React, { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
	code: string;
	error: string;
}

// html and js of iframe with listener of message post
const html = `
	<html>
		<head>
		<style>	body { background-color: white; }	</style>
		</head>
		<body>
			<div id="root">
				<script>
				const handleError = (error) =>{
					const root = document.querySelector('#root');
					root.innerHTML = '<div style="color: red;"><h4>Runtime Error</	h4>' + error + '</div>';
					console.error(error);
				};

				window.addEventListener('error', event=>{
					event.preventDefault();
					handleError(event.error);
				})

				window.addEventListener('message', (event)=>{
						try{
							eval(event.data)
						} catch(error) {
							handleError(error)
						}
					}, false)
				</script>
			</div>
		</body>
	</html>
	`;

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
	const iframe = useRef<any>();

	useEffect(() => {
		// reset
		iframe.current.srcDoc = html;
		// post to iframe
		setTimeout(() => {
			iframe.current.contentWindow.postMessage(code, '*');
		}, 50);
	}, [code]);

	return (
		<div className='preview-wrapper'>
			<iframe
				title='preview'
				ref={iframe}
				srcDoc={html}
				sandbox='allow-scripts'
			/>
			{error && <div className='preview-error'>{error}</div>}
		</div>
	);
};

export default Preview;
