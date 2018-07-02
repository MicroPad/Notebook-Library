import Section from './Section';
import Note, { MarkdownNote } from './Note';
import Asset from './Asset';
export interface Parent {
    title: string;
    addSection: (section: Section) => Parent;
    search: (query: string) => Note[];
    toMarkdown: (asset: Asset[]) => Promise<MarkdownNote[]>;
}
