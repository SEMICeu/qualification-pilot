
export class TabDataElement {


    setValues(values:[String, String[]]) {
        if (values && values[1] && values[1].length > 0 && values[1][0]) {
            this.values = values;
        }
        return this;
    }
    setLinkValues(linkValues:[String, [String,String][]]) {
        this.linkValues = linkValues;
        return this;
    }

    setElementsGroup (elements: TabDataElement[]) {
        this.elementsGroup = elements;
        return this;
    }

    values:[String, String[]];
    linkValues:[String, [String,String][]];
    elementsGroup: TabDataElement[]

}
