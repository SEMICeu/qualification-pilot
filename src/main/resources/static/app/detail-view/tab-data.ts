

import {TabDataElement} from "./tab-data-element";
export class TabData {


    constructor(name: String, index: number) {
        this.name = name;
        this.index = index;
    }

    name:String;
    index: number;

    private _elements: TabDataElement[] = [];

    addElement(element: TabDataElement) {
        this._elements.push(element);
    }

    get elements(): TabDataElement[] {
        return this._elements;
    }
}