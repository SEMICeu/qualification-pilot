
import {Link} from "../model/link";

export class TabDataElement {


    setValues(values:[String, String[]]) {
        if (values && values[1] && values[1].length > 0 && values[1][0]) {
            this.values = values;
        }
        return this;
    }
    setLinkValues(linkValues:[String, Link[]]) {
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
    setSourceColumnCssClass(value: String) {
        this.sourceColumnCssClass = value;
        return this;
    }
    setIsBordered() {
        this.borderClass = "elementsGroupBordered";
        return this;
    }
    setSource(agentInfoTriple: [String, Link, Link]) {
        if (agentInfoTriple[0] == null) {
            this.setSourceColumnCssClass("source-column-no-source")
        }
        else {
            this.sourceName = agentInfoTriple[0];
            this.sourcePage = agentInfoTriple[1];
            this.sourceMail = agentInfoTriple[2];
        }
        return this;
    }

    values:[String, String[]];
    linkValues:[String, Link[]];
    elementsGroup: TabDataElement[];
    elementsGroupTitle: String;
    sectionHeader:String;
    borderClass = "elementsGroupUnBordered";
    sourceName: String;
    sourcePage: Link;
    sourceMail: Link;
    sourceColumnCssClass:String = "source-column-standard";

}
