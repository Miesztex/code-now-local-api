import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './text-editor.css';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
	cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
	const [editing, setEditing] = useState(false);
	const editorDiv = useRef<HTMLDivElement | null>(null);
	const { updateCell } = useActions();

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
				<MDEditor
					onChange={val => updateCell(cell.id, val || '')}
					value={cell.content}
				/>
			</div>
		);

	// preview mode
	return (
		<div onClick={() => setEditing(true)} className='text-editor card'>
			<MDEditor.Markdown
				source={cell.content || '## Click to edit...'}
				className='card-content'
			/>
		</div>
	);
};

export default TextEditor;
