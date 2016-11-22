
import {Link} from "./link";
export class Agent {

    names: Map<string, string[]>;
    mails: string[];
    pages: string[];

    getNames(prefLang: string, refLang: string[]): string[] {
        if (!this.names) return null;
        if (this.names.has(prefLang)) return this.names.get(prefLang);
        if (this.names.has("en")) return this.names.get("en");
        for (let lang of refLang) {
            if (this.names.has(lang)) return this.names.get(lang);
        }
        return null;
    }
    getMailLinks():Link[] {
        if (!this.mails) return null;
        var links:Link[] = [];
        for (let url of this.mails) {
            var name = url;
            if (url.startsWith("mailto:")) {
                name = url.substring(7, url.length);
            }
            links.push(new Link(url, name));
        }
        return links;
    }
    getPageLinks():Link[] {
        if (!this.pages) return null;
        var links:Link[] = [];
        for (let url of this.pages) {
            links.push(new Link(url, url));
        }
        return links;
    }
    getAgentInformationTriple(prefLang: string, refLang: string[]): [string, Link, Link] {
        var name, page, mail;
        let names = this.getNames(prefLang, refLang);
        if (names && names.length > 0) name = names[0];
        let pages = this.getPageLinks();
        if (pages && pages.length > 0) page = pages[0];
        let mails = this.getMailLinks();
        if (mails && mails.length > 0) mail = mails[0];

        return [name, page, mail];
    }
}
