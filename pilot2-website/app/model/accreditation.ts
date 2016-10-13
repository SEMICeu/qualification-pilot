
import {Agent} from "./agent";
export class Accreditation {

    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    recognizedBody: Agent;
    recognizingAgent: Agent;
    issued: String;
    reviewDate: String;
    endDate: String;
    homepages: String[];
    landingPages: String[];
    supplementaryDocs: String[];
    subjects: String[];
    trusted: String;

    getHomepageLinks():[String,String][] {
        if (!this.homepages) return null;
        var links:[String,String][] = [];
        for (let url of this.homepages) {
            links.push([url, url]);
        }
        return links;
    }
    getlandingPageLinks():[String,String][] {
        if (!this.landingPages) return null;
        var links:[String,String][] = [];
        for (let url of this.landingPages) {
            links.push([url, url]);
        }
        return links;
    }
    getsupplementaryDocLinks():[String,String][] {
        if (!this.supplementaryDocs) return null;
        var links:[String,String][] = [];
        for (let url of this.supplementaryDocs) {
            links.push([url, url]);
        }
        return links;
    }
}