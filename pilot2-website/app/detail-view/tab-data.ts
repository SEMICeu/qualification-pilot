

import {TabDataElement} from "./tab-data-element";
export class TabData {


    constructor(name: String, index: number) {
        this.name = name;
        this.index = index;
    }

    name:String;
    index: number;

    elements: TabDataElement[] = [];

    // addElement(value: [String, String]) {
    //     this.elements.push(new TabDataElement(value));
    // }

    addElement(element: TabDataElement) {
        this.elements.push(element);
    }
}