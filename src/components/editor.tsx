import useCodemirror from "@/hooks/use-codemirror";
import type { EditorState } from "@codemirror/state";
import { useCallback } from "react";

interface Props {
	initialDoc: string;
	onChange: (doc: string) => void;
}

export default function Editor(props: Props) {
	const handleChange = useCallback(
		(state: EditorState) => props.onChange(state.doc.toString()),
		[props.onChange],
	);

	const [refContainer] = useCodemirror<HTMLDivElement>({
		initialDoc: props.initialDoc,
		onChange: handleChange,
	});

	return <div className="h-full" ref={refContainer} />;
}
