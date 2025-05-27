export interface WCModule {
	url: string;
	components: Component[];
}

export interface Component {
	tagName: string;
	type: "textDirective" | "leafDirective" | "containerDirective";
	directiveName: string;
}
