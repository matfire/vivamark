import { useEffect, useState } from "react";
import {
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandDialog,
	CommandItem,
	CommandGroup,
} from "./ui/command";
import { Button } from "./ui/button";
import {
	Cog,
	CommandIcon,
	ImageIcon,
	Import,
	Lightbulb,
	SidebarIcon,
} from "lucide-react";
import { useSetAtom } from "jotai";
import importerDialogAtom from "@/atoms/importer-dialog.atom";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useSidebar } from "./ui/sidebar";

export default function Command() {
	const [isOpen, setIsOpen] = useState(false);
	const setImporterDialog = useSetAtom(importerDialogAtom);
	const theme = useTheme();
	const navigate = useNavigate();
	const { toggleSidebar } = useSidebar();

	const handleWebComponentClick = () => {
		setImporterDialog(true);
		setIsOpen(false);
	};

	const handleGoToSettings = () => {
		navigate({ to: "/settings" });
		setIsOpen(false);
	};

	const handleThemeChange = () => {
		if (theme.theme === "light" || theme.theme === "system") {
			theme.setTheme("dark");
		} else {
			theme.setTheme("light");
		}
		setIsOpen(false);
	};

	const handleSidebarChange = () => {
		toggleSidebar();
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
			<Button variant="outline" onClick={() => setIsOpen(true)}>
				<CommandIcon />
				<span>K</span>
			</Button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found</CommandEmpty>
					<CommandGroup heading="Content Actions">
						<CommandItem onSelect={handleWebComponentClick}>
							<Import />
							<span>Import Webcomponents</span>
						</CommandItem>
						<CommandItem>
							<ImageIcon />
							<span>Add Gif (from Giphy)</span>
						</CommandItem>
						<CommandItem>
							<ImageIcon />
							<span>Add Unsplash Image</span>
						</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Settings">
						<CommandItem onSelect={handleGoToSettings}>
							<Cog />
							<span>Go to Settings</span>
						</CommandItem>
						<CommandItem onSelect={handleThemeChange}>
							<Lightbulb />
							<span>Toggle Theme</span>
						</CommandItem>
						<CommandItem onSelect={handleSidebarChange}>
							<SidebarIcon />
							<span>Toggle Sidebar</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
