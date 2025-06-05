import fileAtom from "@/atoms/file.atom";
import useCodemirror from "@/hooks/use-codemirror";
import type { EditorState } from "@codemirror/state";
import { useAtomValue } from "jotai";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { useCallback, useEffect } from "react";
import editorViewAtom from "@/atoms/editor-view.atom";

interface Props {
	initialDoc: string;
	onChange: (doc: string) => void;
}

export default function Editor(props: Props) {
	const selectedFile = useAtomValue(fileAtom);
	const editorView = useAtomValue(editorViewAtom);
	const handleChange = useCallback(
		(state: EditorState) => props.onChange(state.doc.toString()),
		[props.onChange],
	);

	const [refContainer] = useCodemirror<HTMLDivElement>({
		initialDoc: props.initialDoc,
		onChange: handleChange,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies(editorView): this hooks should not run on every change to the editorView
	// biome-ignore lint/correctness/useExhaustiveDependencies(editorView.state.doc.length): same as above
	// biome-ignore lint/correctness/useExhaustiveDependencies(editorView?.dispatch): same as above
	useEffect(() => {
		if (!selectedFile) return;
		console.log("file changed", selectedFile);
		readTextFile(selectedFile).then((content) => {
			editorView?.dispatch({
				changes: [
					{
						from: 0,
						to: editorView.state.doc.length,
						insert: content,
					},
				],
			});
		});
	}, [selectedFile]);

	return <div className="h-full" ref={refContainer} />;
}
