
export class QualificationFramework {

    constructor(uri: String) {
        this.uri = uri;
    }

    uri:String;
    descriptions: Map<String, String[]>;
    issued:String;
    targetFrameWork:String;
    targetFrameworkVersion:String;
    target:String;
    targetDescriptions: Map<String, String[]>;
    targetNotations:String[];
    targetNames: Map<String, String[]>;
    targetUrl:String;
    homepages:String[];
    trusted:String;

    publisherNames: Map<String, String[]>;
    publisherMails: String[];
    publisherPages: String[];

    getDescriptions(prefLang: String, refLang: String[]): String[] {
        if (!this.descriptions) return null;
        if (this.descriptions.has(prefLang)) return this.descriptions.get(prefLang);
        if (this.descriptions.has("en")) return this.descriptions.get("en");
        for (let lang of refLang) {
            if (this.descriptions.has(lang)) return this.descriptions.get(lang);
        }
        return null;
    }
    getTargetDescriptions(prefLang: String, refLang: String[]): String[] {
        if (!this.targetDescriptions) return null;
        if (this.targetDescriptions.has(prefLang)) return this.targetDescriptions.get(prefLang);
        if (this.targetDescriptions.has("en")) return this.targetDescriptions.get("en");
        for (let lang of refLang) {
            if (this.targetDescriptions.has(lang)) return this.targetDescriptions.get(lang);
        }
        return null;
    }
    getTargetNames(prefLang: String, refLang: String[]): String[] {
        if (!this.targetNames) return null;
        if (this.targetNames.has(prefLang)) return this.targetNames.get(prefLang);
        if (this.targetNames.has("en")) return this.targetNames.get("en");
        for (let lang of refLang) {
            if (this.targetNames.has(lang)) return this.targetNames.get(lang);
        }
        return null;
    }
    getHomepageLinks():[String,String][] {
        if (!this.homepages) return null;
        var links:[String,String][] = [];
        for (let url of this.homepages) {
            links.push([url, url]);
        }
        return links;
    }
    getPublisherNames(prefLang: String, refLang: String[]): String[] {
        if (!this.publisherNames) return null;
        if (this.publisherNames.has(prefLang)) return this.publisherNames.get(prefLang);
        if (this.publisherNames.has("en")) return this.publisherNames.get("en");
        for (let lang of refLang) {
            if (this.publisherNames.has(lang)) return this.publisherNames.get(lang);
        }
        return null;
    }
    getPublisherMails():[String,String][] {
        if (!this.publisherMails) return null;
        var links:[String,String][] = [];
        for (let url of this.publisherMails) {
            links.push([url, url]);
        }
        return links;
    }
    getPublisherPages():[String,String][] {
        if (!this.publisherPages) return null;
        var links:[String,String][] = [];
        for (let url of this.publisherPages) {
            links.push([url, url]);
        }
        return links;
    }

}