import { type MutableRefObject, useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
	foldGutter,
	defaultHighlightStyle,
	syntaxHighlighting,
	indentOnInput,
	bracketMatching,
	foldKeymap,
	HighlightStyle,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import {
	autocompletion,
	completionKeymap,
	closeBrackets,
	closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { markdown } from "@codemirror/lang-markdown";

interface Props {
	initialDoc: string;
	onChange?: (state: EditorState) => void;
}

const syntaxHighlightingTheme = HighlightStyle.define([
	{
		tag: tags.heading1,
		fontSize: "1.6em",
		fontWeight: "bold",
	},
	{
		tag: tags.heading2,
		fontSize: "1.4em",
		fontWeight: "bold",
	},
	{
		tag: tags.heading3,
		fontSize: "1.2em",
		fontWeight: "bold",
	},
]);

const useCodemirror = <T extends Element>(
	props: Props,
): [MutableRefObject<T | null>, EditorView?] => {
	const parentRef = useRef<T>(null);
	const [editorView, setEditorView] = useState<EditorView>();

	const { onChange, initialDoc } = props;

	useEffect(() => {
		if (!parentRef.current) return;

		const startState = EditorState.create({
			doc: initialDoc,
			extensions: [
				lineNumbers(),
				foldGutter(),
				history(),
				indentOnInput(),
				syntaxHighlighting(defaultHighlightStyle),
				bracketMatching(),
				closeBrackets(),
				autocompletion(),
				markdown(),
				syntaxHighlighting(syntaxHighlightingTheme),
				keymap.of([
					...defaultKeymap,
					...historyKeymap,
					...foldKeymap,
					...completionKeymap,
					...closeBracketsKeymap,
				]),
				EditorView.lineWrapping,
				EditorView.updateListener.of((update) => {
					if (update.changes) {
						onChange?.(update.state);
					}
				}),
			],
		});
		const view = new EditorView({
			state: startState,
			parent: parentRef.current,
		});
		setEditorView(view);
	}, [onChange, initialDoc]);

	return [parentRef, editorView];
};

export default useCodemirror;
