// check with customElements.get("name")

import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import WebcomponentsAtom from "@/atoms/webcomponents.atom";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { useAtom, useSetAtom } from "jotai";
import type { Component } from "@/types/webcomponents";
import importerDialogAtom from "@/atoms/importer-dialog.atom";

type ImportStep =
	| "inputUrl"
	| "loadingModule"
	| "addComponents"
	| "testingComponents"
	| "error";

export default function WebcomponentsImporter() {
	const [step, setStep] = useState<ImportStep>("inputUrl");
	const [moduleUrl, setModuleUrl] = useState("");
	const [components, setComponents] = useState<Component[]>([]);
	const [isOpen, setIsOpen] = useAtom(importerDialogAtom);
	const setComponentAtom = useSetAtom(WebcomponentsAtom);

	const handleModuleLoad = async () => {
		setStep("loadingModule");
		try {
			const previousComponents = new Set(window.getDefinedCustomElements());

			await import(/* @vite-ignore */ moduleUrl);
			const currentComponents = window.getDefinedCustomElements();
			const newComponents = currentComponents.difference(previousComponents);
			if (Array.from(newComponents).length === 0) {
				toast.error(
					"no web components have been loaded from this module, please try again (or you might have already loaded this module xD",
				);
				setStep("inputUrl");
				return;
			}
			console.log("found these new components", newComponents);
			setComponents(
				Array.from(newComponents).map((e) => ({
					tagName: e,
					directiveName: e,
					type: "leafDirective",
				})),
			);
			setStep("addComponents");
		} catch (error) {
			toast.error("could not load module correctly");
			setStep("inputUrl");
		}
	};

	const handleComponentsAdd = () => {
		setComponentAtom((old) => {
			return [
				...old,
				{
					url: moduleUrl,
					components,
				},
			];
		});
		toast.success("saved new web components!");
		setIsOpen(false);
		setStep("inputUrl");
		setComponents([]);
		setModuleUrl("");
	};

	const handleTypeChange = (
		index: number,
		type: "textDirective" | "leafDirective" | "containerDirective",
	) => {
		setComponents((old) => {
			const list = [...old];
			list[index].type = type;
			return list;
		});
	};

	const handleDirectiveChange = (index: number, value: string) => {
		setComponents((old) => {
			const list = [...old];
			list[index].directiveName = value;
			return list;
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{/* <DialogTrigger asChild>
        <Button>Import Components</Button>
      </DialogTrigger> */}
			<DialogContent className="max-h-[500px] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Webcomponents</DialogTitle>
					<DialogDescription>
						{step === "inputUrl" &&
							"Please enter the url of the module you want to load"}
						{step === "addComponents" &&
							"We found these components while loading the provided module. Please check their type and directive name"}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 flex flex-col">
					{step === "inputUrl" && (
						<div>
							<div>
								<Label>Module URL</Label>
								<Input
									type="url"
									onChange={(e) => setModuleUrl(e.target.value)}
									value={moduleUrl}
								/>
							</div>
							<Button onClick={handleModuleLoad}>Import</Button>
						</div>
					)}
					{step === "addComponents" && (
						<div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Type</TableHead>
										<TableHead>Directive</TableHead>
										<TableHead>Tag</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className="max-h-[500px] overflow-y-auto">
									{components.map((e, index) => (
										<TableRow key={e.tagName}>
											<TableCell>
												<Select
													value={e.type}
													onValueChange={(type) =>
														handleTypeChange(
															index,
															type as
																| "leafDirective"
																| "textDirective"
																| "containerDirective",
														)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="textDirective">Text</SelectItem>
														<SelectItem value="leafDirective">Leaf</SelectItem>
														<SelectItem value="containerDirective">
															Container
														</SelectItem>
													</SelectContent>
												</Select>
											</TableCell>
											<TableCell>
												<Input
													value={e.directiveName}
													onChange={(e) =>
														handleDirectiveChange(index, e.target.value)
													}
												/>
											</TableCell>
											<TableCell>{e.tagName}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Button onClick={handleComponentsAdd}>Continue</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
