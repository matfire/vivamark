import { useTheme } from "@/components/theme-provider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<Select value={theme} onValueChange={setTheme}>
			<SelectTrigger>
				<SelectValue placeholder="theme" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">Light</SelectItem>
				<SelectItem value="dark">Dark</SelectItem>
			</SelectContent>
		</Select>
	);
}
