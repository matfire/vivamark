import { useEffect, useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";
import { Button } from "./ui/button";
import { open } from "@tauri-apps/plugin-dialog";
import { FileTreeGenerator, type FileTreeNode } from "@/utils/tree";
import { Check, File as FileIcon, Folder as FolderIcon } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";
import { useAtomValue, useSetAtom } from "jotai";
import fileAtom from "@/atoms/file.atom";
import Command from "./command";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";

interface FolderProps {
	item: FileTreeNode;
	onClick: (path: string) => void;
}

function Folder(props: FolderProps) {
	return (
		<div>
			{props.item.isDirectory ? (
				<Collapsible>
					<CollapsibleTrigger>
						<FolderIcon />
						{props.item.name}
					</CollapsibleTrigger>
					<CollapsibleContent className="space-y-2">
						{props.item.children?.map((e) => (
							<Folder key={e.path} item={e} onClick={props.onClick} />
						))}
					</CollapsibleContent>
				</Collapsible>
			) : (
				<File item={props.item} onClick={props.onClick} />
			)}
		</div>
	);
}

interface FileProps {
	item: FileTreeNode;
	onClick: (path: string) => void;
}

function File(props: FileProps) {
	const [isSelected, setIsSelected] = useState(false);
	const currentfile = useAtomValue(fileAtom);

	useEffect(() => {
		if (!currentfile) return;
		setIsSelected(currentfile === props.item.path);
	}, [currentfile, props.item.path]);

	return (
		<div
			onKeyDown={() => props.onClick(props.item.path)}
			onClick={() => props.onClick(props.item.path)}
			className="w-full flex space-x-4"
		>
			<div className="flex">
				<FileIcon />
				{props.item.name}
			</div>
			{isSelected && <Check />}
		</div>
	);
}

export default function FolderSidebar() {
	const [_, setSelecedFolder] = useState("");
	const [tree, setTree] = useState<FileTreeNode | null>(null);
	const setSelectedFile = useSetAtom(fileAtom);
	const location = useLocation();
	const navigate = useNavigate();

	const handleSelectFolder = async () => {
		const res = await open({
			multiple: false,
			directory: true,
			recursive: true,
		});
		if (!res) return;
		setSelecedFolder(res);
		const data = await new FileTreeGenerator().generateFileTree(res);
		setTree(data);
	};

	const handleSetFile = async (path: string) => {
		if (location.pathname !== "/") {
			await navigate({ to: "/" });
		}
		setSelectedFile(path);
	};

	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent className="max-h-full overflow-y-auto">
				<div className="flex flex-col space-y-6 px-4">
					<Command />
					<Button className="w-full" onClick={handleSelectFolder}>
						Select Folder
					</Button>
					{tree && <Folder item={tree} onClick={handleSetFile} />}
				</div>
			</SidebarContent>
		</Sidebar>
	);
}
