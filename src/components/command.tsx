import { useState } from "react";
import {
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandDialog,
} from "./ui/command";
import { Button } from "./ui/button";

export default function Command() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open</Button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found</CommandEmpty>
				</CommandList>
			</CommandDialog>
		</>
	);
}
