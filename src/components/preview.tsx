import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import PreviewWorker from "@/worker?worker";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
	doc: string;
}

let previewWorker: Worker | null;

if (typeof window !== "undefined") {
	try {
		previewWorker = new PreviewWorker();
		console.log("worker loaded");
	} catch (error) {
		console.error("failed to create preview worker:", error);
	}
}

export default function Preview(props: Props) {
	const [data, setData] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const currentProcessingId = useRef<string | null>(null);

	const handleDataChange = useCallback(async (doc: string) => {
		const res = await unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkRehype)
			.use(rehypeShiki, {
				themes: {
					dark: "catppuccin-mocha",
					light: "catppuccin-latte",
				},
			})
			.use(rehypeStringify)
			.process(doc);
		setData(res.toString());
	}, []);

	useEffect(() => {
		// if (!previewWorker) {
		handleDataChange(props.doc);
		console.warn("no preview worker found, using main thread");
		// } else {
		// 	setIsLoading(true)
		// 	const id = crypto.randomUUID()
		// 	currentProcessingId.current = id
		// 	console.log("sending message to worker", id)
		// 	previewWorker.postMessage({doc: props.doc, id})
		// 	const handleWorkerMessage = (event: MessageEvent) => {
		// 		const { type, id: responseId, html, message } = event.data;
		// 		if (responseId === currentProcessingId.current) {
		// 			if (type === "success") {
		// 				setData(html)
		// 			} else if (type === "error") {
		// 				console.error("worker error:", message)
		// 				setData("<p>Error rendering preview.</p>")
		// 			}
		// 			setIsLoading(false)
		// 			currentProcessingId.current = null
		// 		}
		// 	}

		// 	previewWorker.addEventListener("message", handleWorkerMessage)
		// 	return () => {
		// 		previewWorker?.removeEventListener("message", handleWorkerMessage)
		// 	}
		// }
	}, [props.doc, handleDataChange]);
	return (
		<div className="prose xl:prose-xl">
			<div dangerouslySetInnerHTML={{ __html: data }} />
		</div>
	);
}
