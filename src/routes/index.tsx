import { createFileRoute } from "@tanstack/react-router";
import Editor from "@/components/editor";
import { useCallback, useState } from "react";
import Preview from "@/components/preview";
import { ModeToggle } from "@/components/mode-toggle";
import "@matfire/webcomponents";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

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
			<div>
				<ModeToggle />
			</div>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel>
					<Editor initialDoc={doc} onChange={handleDocChange} />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>
					<Preview doc={doc} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
