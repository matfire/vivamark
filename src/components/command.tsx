import { useEffect, useState } from "react";
import {
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandDialog,
	CommandItem,
} from "./ui/command";
import { Button } from "./ui/button";
import { Import } from "lucide-react";
import { useSetAtom } from "jotai";
import importerDialogAtom from "@/atoms/importer-dialog.atom";

export default function Command() {
	const [isOpen, setIsOpen] = useState(false);
	const setImporterDialog = useSetAtom(importerDialogAtom);

	const handleWebComponentClick = () => {
		setImporterDialog(true);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleOpenCommand = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", handleOpenCommand);
		return () => document.removeEventListener("keydown", handleOpenCommand);
	}, []);

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open</Button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found</CommandEmpty>
					<CommandItem onSelect={handleWebComponentClick}>
						<Import />
						<span>Import Webcomponents</span>
					</CommandItem>
				</CommandList>
			</CommandDialog>
		</>
	);
}
