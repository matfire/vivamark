import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { useEffect, useState } from "react";

interface Props {
	doc: string;
}

const parser = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeShiki, {
		themes: {
			dark: "catppuccin-mocha",
			light: "catppuccin-latte",
		},
	})
	.use(rehypeStringify);

export default function Preview(props: Props) {
	const [data, setData] = useState("");

	useEffect(() => {
		parser
			.process(props.doc)
			.then((vf) => setData(vf.toString()))
			.catch((e) => {
				console.log(e);
			});
	}, [props.doc]);

	return (
		<div>
			<p>preview goes here</p>
			<div dangerouslySetInnerHTML={{ __html: data }} />
		</div>
	);
}
