import { createFileRoute } from "@tanstack/react-router";
import Editor from "@/components/editor";
import { useCallback, useEffect, useState } from "react";
import Preview from "@/components/preview";
import { ModeToggle } from "@/components/mode-toggle";
// import "@matfire/webcomponents";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import WebcomponentsImporter from "@/components/webcomponent-importer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import FolderSidebar from "@/components/folderSidebar";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [doc, setDoc] = useState("# Hello, World!\n");

	const handleDocChange = useCallback((newDoc: string) => {
		setDoc(newDoc);
	}, []);

	return (
		<SidebarProvider>
			<FolderSidebar />
			<div>
				<SidebarTrigger />
				<WebcomponentsImporter />
			</div>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel className="p-4">
					<Editor initialDoc={doc} onChange={handleDocChange} />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel className="p-4">
					<Preview doc={doc} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</SidebarProvider>
	);
}
