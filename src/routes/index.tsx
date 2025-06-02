import { createFileRoute } from "@tanstack/react-router";
import Editor from "@/components/editor";
import { useCallback, useEffect, useState } from "react";
import Preview from "@/components/preview";
import { useDebounce } from "@uidotdev/usehooks";
import { writeTextFile } from "@tauri-apps/plugin-fs";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import WebcomponentsImporter from "@/components/webcomponent-importer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import FolderSidebar from "@/components/folderSidebar";
import { useAtomValue } from "jotai";
import fileAtom from "@/atoms/file.atom";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [doc, setDoc] = useState("# Hello, World!\n");
	const debouncedDoc = useDebounce(doc, 700);
	const selectedFile = useAtomValue(fileAtom);

	const handleDocChange = useCallback((newDoc: string) => {
		setDoc(newDoc);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies(selectedFile): this hooks should rerun when changing files because if could override existing content
	useEffect(() => {
		if (!debouncedDoc || !selectedFile) return;

		console.log("saving file");
		const toastId = toast.loading("saving file...");
		writeTextFile(selectedFile, debouncedDoc)
			.then(() => {
				toast.success("saved!", { id: toastId });
			})
			.catch((reason) => {
				toast.error(reason, { id: toastId });
			});
	}, [debouncedDoc]);

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel className="p-4">
				<Editor initialDoc={doc} onChange={handleDocChange} />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel className="p-4">
				<Preview doc={doc} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
