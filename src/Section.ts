import { Parent } from './interfaces';

export default class Section implements Parent {
	public parent: Parent | undefined;
}