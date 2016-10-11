
export class TabDataElement {


    setValues(values:[String, String[]]) {
        this.values = values;
        return this;
    }
    setLinkValues(linkValues:[String, [String,String][]]) {
        this.linkValues = linkValues;
        return this;
    }

    values:[String, String[]];
    linkValues:[String, [String,String][]];
    color:[String, String];
    idHtml: String;
    classHtml: String;
}
