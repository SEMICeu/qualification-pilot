
export class Agent {

    names: Map<String, String[]>;
    mails: String[];
    pages: String[];

    getNames(prefLang: String, refLang: String[]): String[] {
        if (!this.names) return null;
        if (this.names.has(prefLang)) return this.names.get(prefLang);
        if (this.names.has("en")) return this.names.get("en");
        for (let lang of refLang) {
            if (this.names.has(lang)) return this.names.get(lang);
        }
        return null;
    }
    getMailLinks():[String,String][] {
        if (!this.mails) return null;
        var links:[String,String][] = [];
        for (let url of this.mails) {
            links.push([url, url]);
        }
        return links;
    }
    getPageLinks():[String,String][] {
        if (!this.pages) return null;
        var links:[String,String][] = [];
        for (let url of this.pages) {
            links.push([url, url]);
        }
        return links;
    }
}