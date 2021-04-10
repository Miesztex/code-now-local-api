import React, { useEffect, useRef } from 'react';

interface PreviewProps {
	code: string;
}

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
	</html>
	`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
	const iframe = useRef<any>();
	useEffect(() => {
		iframe.current.srcDoc = html;
		// post to iframe
		iframe.current.contentWindow.postMessage(code, '*');
	}, [code]);
	return (
		<iframe
			title='preview'
			ref={iframe}
			srcDoc={html}
			sandbox='allow-scripts'
		/>
	);
};

export default Preview;
