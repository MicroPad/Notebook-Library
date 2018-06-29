export interface NPXObject {
	title: string;
	toXmlObject: () => Promise<object>;
}

export interface Parent extends NPXObject {}
