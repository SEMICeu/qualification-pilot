
import {Agent} from "./agent";
import {Link} from "./link";
export class Accreditation {

    constructor(uri: string) {
        this.uri = uri;
    }

    uri: string;
    recognizedBody: Agent;
    recognizingAgent: Agent;
    issued: string;
    reviewDate: string;
    endDate: string;
    homepages: string[];
    landingPages: string[];
    supplementaryDocs: string[];
    subjects: string[];
    trusted: string;
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
