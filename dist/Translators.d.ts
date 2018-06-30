import { FlatNotepad, Notepad } from './index';
export declare namespace Translators {
    namespace Json {
        function toNotepad(json: string): Notepad;
        function toFlatNotepad(json: string): FlatNotepad;
    }
    namespace Xml {
        function toNotepadFromNpx(xml: string): Promise<Notepad>;
    }
}
