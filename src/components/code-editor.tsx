import MonacoEditor, { OnMount } from '@monaco-editor/react';
import prettier, { format } from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import HighLighter from 'monaco-jsx-highlighter';

import { useRef } from 'react';

import './code-editor.css';

interface CodeEditorProps {
	initialValue: string;
	onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
	const editorRef = useRef<any>(null);
	const onEditorDidMount: OnMount = monacoEditor => {
		editorRef.current = monacoEditor;
		monacoEditor.onDidChangeModelContent(() => {
			onChange(monacoEditor.getValue());
		});

		monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

		// ===================================
		// highlighting fix;
		const highlighter = new HighLighter(
			// @ts-ignore
			window.monaco,
			codeShift,
			monacoEditor
		);
		highlighter.highLightOnDidChangeModelContent(
			() => {},
			() => {},
			undefined,
			() => {}
		);
	};

	const onFormatClick = () => {
		const unformatted = editorRef.current.getModel().getValue();

		const formatted = prettier.format(unformatted, {
			parser: 'babel',
			plugins: [parser],
			useTabs: false,
			semi: true,
			singleQuote: true,
		});

		editorRef.current.setValue(formatted);
	};

	return (
		<div className='editor-wrapper'>
			<button
				className='button button-format is-primary is-small'
				onClick={onFormatClick}>
				Prettier
			</button>
			<MonacoEditor
				onMount={onEditorDidMount}
				theme='vs-dark'
				value={initialValue}
				height='500px'
				language='javascript'
				options={{
					wordWrap: 'on',
					formatOnPaste: true,
					minimap: { enabled: false },
					showUnused: false,
					folding: false,
					lineNumbersMinChars: 3,
					fontSize: 16,
					scrollBeyondLastLine: false,
					automaticLayout: true,
				}}
			/>
		</div>
	);
};

export default CodeEditor;
