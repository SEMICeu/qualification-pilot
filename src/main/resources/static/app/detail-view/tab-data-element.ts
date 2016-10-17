
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
    setElementsGroupTitle (title: String) {
        this.elementsGroupTitle = title;
        return this;
    }
    setSectionHeader(value: String) {
        this.sectionHeader = value;
        return this;
    }
    setTrusted(value: String) {
        if (value && value == "true") {
            this.trusted = "trusted";
        }
        else this.trusted = "untrusted";
        return this;
    }
    setIsBordered() {
        this.borderClass = "elementsGroupBordered";
        return this;
    }

    trusted = "untrusted";
    values:[String, String[]];
    linkValues:[String, [String,String][]];
    elementsGroup: TabDataElement[];
    elementsGroupTitle: String;
    sectionHeader:String;
    borderClass = "elementsGroupUnBordered";

}