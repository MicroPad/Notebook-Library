import { FlatNotepad, Notepad } from './index';
export declare namespace Translators {
    namespace Json {
        function toNotepadFromNotepad(json: string): Notepad;
        function toFlatNotepadFromNotepad(json: string): FlatNotepad;
        function toMarkdownFromJupyter(json: string): string;
    }
    namespace Xml {
        function toNotepadFromNpx(xml: string): Promise<Notepad>;
    }
}
