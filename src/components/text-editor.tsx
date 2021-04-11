import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import './text-editor.css';

const TextEditor: React.FC = () => {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(' # Header ');
	const editorDiv = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const listener = (e: MouseEvent) => {
			if (
				e.target &&
				editorDiv.current &&
				editorDiv.current.contains(e.target as Node)
			)
				return;
			setEditing(false);
		};
		document.addEventListener('click', listener, { capture: true });
		return () => {
			document.removeEventListener('click', listener, { capture: true });
		};
	}, []);

	// edit mode
	if (editing)
		return (
			<div ref={editorDiv} className='text-editor'>
				<MDEditor onChange={val => setValue(val || '')} value={value} />
			</div>
		);

	// preview mode
	return (
		<div onClick={() => setEditing(true)} className='text-editor card'>
			<MDEditor.Markdown source={value} className='card-content' />
		</div>
	);
};

export default TextEditor;
