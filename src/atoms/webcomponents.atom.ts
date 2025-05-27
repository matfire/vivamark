import type { WCModule } from "@/types/webcomponents";
import { atom } from "jotai";

const WebcomponentsAtom = atom<WCModule[]>([]);

export default WebcomponentsAtom;
