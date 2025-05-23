import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { useCallback, useEffect, useState } from "react";

interface Props {
	doc: string;
}

export default function Preview(props: Props) {
	const [data, setData] = useState("");

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
		handleDataChange(props.doc);
	}, [props.doc, handleDataChange]);
	return (
		<div className="prose xl:prose-xl">
			<div dangerouslySetInnerHTML={{ __html: data }} />
		</div>
	);
}
