import {Link} from "../model/link";
import {SafeHtml} from "@angular/platform-browser";

export class TabDataElement {


  setValues(values: [string, string[]]) {
    if (values && values[1] && values[1].length > 0 && values[1][0]) {
      this.values = values;
    }
    return this;
  }

  setLinkValues(linkValues: [string, Link[]]) {
    this.linkValues = linkValues;
    return this;
  }

  setElementsGroup(elements: TabDataElement[]) {
    this.elementsGroup = elements;
    return this;
  }

  setElementsGroupTitle(title: string) {
    this.elementsGroupTitle = title;
    return this;
  }

  setSectionHeader(value: string) {
    this.sectionHeader = value;
    return this;
  }

  setSourceColumnCssClass(value: string) {
    this.sourceColumnCssClass = value;
    return this;
  }

  setIsBordered() {
    this.borderClass = "elements-group-bordered";
    return this;
  }

  setSource(agentInfoTriple: [string, Link, Link], sourcePage: Link) {
    if (agentInfoTriple[0] == null) {
      this.setSourceColumnCssClass("source-column-no-source")
    }
    else {
      this.sourceName = agentInfoTriple[0];
      this.sourcePage = sourcePage;
      this.sourceMail = agentInfoTriple[2];
    }
    return this;
  }

  setAnnotatedList(annotatedList: [string, SafeHtml[]]) {
    this.annotatedList = annotatedList;
    return this;
  }

  values: [string, string[]];
  linkValues: [string, Link[]];
  elementsGroup: TabDataElement[];
  elementsGroupTitle: string;
  sectionHeader: string;
  annotatedList: [string, SafeHtml[]];
  borderClass = "elements-group-unbordered";
  sourceName: string;
  sourcePage: Link;
  sourceMail: Link;
  sourceColumnCssClass: string = "source-column-standard";

}
