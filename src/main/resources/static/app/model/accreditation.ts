
import {Agent} from "./agent";
import {Link} from "./link";
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
    publisher: Agent;

    getHomepageLinks():Link[] {
            if (!this.homepages) return null;
            var links:Link[] = [];
            for (let url of this.homepages) {
                links.push(new Link(url, url));
            }
            return links;
    }
    getlandingPageLinks():Link[] {
        if (!this.landingPages) return null;
        var links:Link[] = [];
        for (let url of this.landingPages) {
            links.push(new Link(url, url));
        }
        return links;
    }
    getsupplementaryDocLinks():Link[] {
        if (!this.supplementaryDocs) return null;
        var links:Link[] = [];
        for (let url of this.supplementaryDocs) {
            links.push(new Link(url, url));
        }
        return links;
    }
}