
import {Agent} from "./agent";
import {Link} from "./link";
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
    targetLabels: Map<String, String[]>;
    targetDescriptions: Map<String, String[]>;
    targetNotations:String[];
    targetNames: Map<String, String[]>;
    targetUrl:String;
    homepages:String[];
    trusted:String;
    publisher: Agent;

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
    getTargetLabels(prefLang: String, refLang: String[]): String[] {
        if (!this.targetLabels) return null;
        if (this.targetLabels.has(prefLang)) return this.targetLabels.get(prefLang);
        if (this.targetLabels.has("en")) return this.targetLabels.get("en");
        for (let lang of refLang) {
            if (this.targetLabels.has(lang)) return this.targetLabels.get(lang);
        }
        return null;
    }
    getHomepageLinks():Link[] {
        if (!this.homepages) return null;
        var links:Link[] = [];
        for (let url of this.homepages) {
            links.push(new Link(url, url));
        }
        return links;
    }

}