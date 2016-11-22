

import {TabDataElement} from "./tab-data-element";
export class TabData {


    constructor(name: String, index: number) {
        this.name = name;
        this.index = index;
    }

    name:String;
    index: number;

    private _elements: TabDataElement[] = [];

    push(element: TabDataElement) {
        this._elements.push(element);
    }

    putLastElementInFront() {
        if (this._elements && this.elements.length > 1) {
            this._elements = [this._elements.pop()].concat(this._elements);
        }
    }

    get elements(): TabDataElement[] {
        return this._elements;
    }
}