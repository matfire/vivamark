import type { EditorView } from "@codemirror/view";
import { atom } from "jotai";

const editorViewAtom = atom<EditorView | null>(null);

export default editorViewAtom;
