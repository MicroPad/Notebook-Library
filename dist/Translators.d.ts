import { Notepad } from './index';
export declare namespace Translators {
    namespace Json {
        function toNotepad(json: string): Notepad;
    }
    namespace Xml {
        function toNotepadFromNpx(xml: string): Promise<Notepad>;
    }
}
