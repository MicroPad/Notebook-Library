import Section from './Section';

export interface Parent {
	title: string;
	addSection: (section: Section) => Parent;
}
