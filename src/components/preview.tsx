import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkDirectiveToCustomTag from "@matfire/remark-directive-to-custom-tag";
import { useCallback, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import WebcomponentsAtom from "@/atoms/webcomponents.atom";

interface Props {
	doc: string;
}

export default function Preview(props: Props) {
	const [data, setData] = useState("");
	const enabledComponents = useAtomValue(WebcomponentsAtom);

	const handleDataChange = useCallback(
		async (doc: string) => {
			const res = await unified()
				.use(remarkParse)
				.use(remarkGfm)
				.use(remarkDirective)
				.use(remarkDirectiveToCustomTag, {
					associations: enabledComponents.flatMap((e) => e.components),
				})
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
		},
		[enabledComponents],
	);

	useEffect(() => {
		handleDataChange(props.doc);
	}, [props.doc, handleDataChange]);
	return (
		<div className="prose xl:prose-xl dark:prose-invert">
			<div dangerouslySetInnerHTML={{ __html: data }} />
		</div>
	);
}
