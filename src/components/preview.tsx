import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

interface Props {
	doc: string;
}

export default function Preview(props: Props) {
	const data = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeStringify)
		.processSync(props.doc)
		.toString();

	return (
		<div>
			{/* @ts-expect-error: Trust me, this is (kind of) safe */}
			<div dangerouslySetInnerHTML={{ __html: data }} />
		</div>
	);
}
