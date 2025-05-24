import { atom } from "jotai";

interface WCModule {
	url: string;
	components: Component[];
}

export interface Component {
	tagName: string;
	type: "textDirective" | "leafDirective" | "containerDirective";
	directiveName: string;
}

const WebcomponentsAtom = atom<WCModule[]>([]);

export default WebcomponentsAtom;
