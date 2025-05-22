import { createFileRoute } from "@tanstack/react-router";
import useCodemirror from "../hooks/use-codemirror";
import Editor from "@/components/editor";
import { useCallback, useState } from "react";
import Preview from "@/components/preview";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [doc, setDoc] = useState("# Hello, World!\n");

	const handleDocChange = useCallback((newDoc: string) => {
		setDoc(newDoc);
	}, []);

	return (
		<div>
			<Editor initialDoc="# Hello world" onChange={handleDocChange} />
			<Preview doc={doc} />
		</div>
	);
}
