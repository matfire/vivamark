import { type MutableRefObject, useEffect, useRef, useState } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import {
	defaultKeymap,
	history,
	historyKeymap,
	indentWithTab,
} from "@codemirror/commands";
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
import { catppuccinLatte, catppuccinMocha } from "@catppuccin/codemirror";
import { useTheme } from "@/components/theme-provider";

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

const themeCompartment = new Compartment();
const syntaxHighlightingCompartment = new Compartment();

const useCodemirror = <T extends Element>(
	props: Props,
): [MutableRefObject<T | null>, EditorView?] => {
	const parentRef = useRef<T>(null);
	const theme = useTheme();
	const [editorView, setEditorView] = useState<EditorView>();

	const { onChange, initialDoc } = props;

	useEffect(() => {
		if (!parentRef.current) return;
		if (!editorView) return;
		editorView.dispatch({
			effects: [
				themeCompartment.reconfigure(
					theme.theme === "dark" ? catppuccinMocha : catppuccinLatte,
				),
				syntaxHighlightingCompartment.reconfigure(
					syntaxHighlighting(defaultHighlightStyle),
				),
			],
		});
	}, [theme.theme, editorView]);

	useEffect(() => {
		if (!parentRef.current) return;
		if (editorView) return;

		const startState = EditorState.create({
			doc: initialDoc,
			extensions: [
				lineNumbers(),
				foldGutter(),
				history(),
				indentOnInput(),
				syntaxHighlightingCompartment.of(
					syntaxHighlighting(defaultHighlightStyle),
				),
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
					indentWithTab,
				]),
				themeCompartment.of(
					theme.theme === "dark" ? catppuccinMocha : catppuccinLatte,
				),
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
	}, [onChange, initialDoc, editorView, theme.theme]);

	return [parentRef, editorView];
};

export default useCodemirror;
