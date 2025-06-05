import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { load } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
	component: RouteComponent,
});

const store = await load("credentials.json", { autoSave: true });

function RouteComponent() {
	const [giphyKey, setGiphyKey] = useState<string | undefined>();

	const handleSave = async () => {
		const toastId = toast.loading("saving credentials...");
		try {
			await store.set("giphy_api_key", giphyKey);
			toast.success("credentials saved!", { id: toastId });
		} catch (e) {
			toast.error(`error saving credentials: ${e}`, { id: toastId });
		}
	};

	useEffect(() => {
		store.get<string>("giphy_api_key").then((value) => {
			console.log(value);
			setGiphyKey(value);
		});
	}, []);

	return (
		<div className="flex flex-col space-y-6">
			<div>
				<Label>Giphy API Key</Label>
				<Input value={giphyKey} onChange={(e) => setGiphyKey(e.target.value)} />
			</div>

			<div>
				<Button onClick={handleSave}>Save</Button>
			</div>
		</div>
	);
}
