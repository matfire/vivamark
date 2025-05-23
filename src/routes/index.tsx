import { createFileRoute } from "@tanstack/react-router";
import Editor from "@/components/editor";
import { useCallback, useState } from "react";
import Preview from "@/components/preview";
import { Switch } from "@/components/ui/switch";
import { ModeToggle } from "@/components/mode-toggle";
import "@matfire/webcomponents";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [doc, setDoc] = useState("# Hello, World!\n");
	const [showPreview, setShowPreview] = useState(false);

	const handleDocChange = useCallback((newDoc: string) => {
		setDoc(newDoc);
	}, []);

	return (
		<div>
			<div>
				<Switch checked={showPreview} onCheckedChange={setShowPreview} />
				<ModeToggle />
			</div>
			<Editor initialDoc={doc} onChange={handleDocChange} />
			<Preview doc={doc} />
		</div>
	);
}
