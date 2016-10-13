
import {Agent} from "./agent";
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
    getHomepageLinks():[String,String][] {
        if (!this.homepages) return null;
        var links:[String,String][] = [];
        for (let url of this.homepages) {
            links.push([url, url]);
        }
        return links;
    }

}