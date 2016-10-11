
import {Skill} from "./skill";
export class Qualification {

    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    referenceLanguage: String[];
    prefLabels: Map<String, String[]>;
    altLabels: Map<String, String[]>;
    definitions: Map<String, String[]>;
    loSkillUris: String[];
    descriptions: Map<String, String[]>;
    iSCED_Fcode: String[];
    eqfAssociationUri: String;
    eqfTarget: String;
    nqfAssociationUris: String[];
    eCTSCredits: String;
    volumeOfLearning: String;
    isPartialQualification: String;
    waysToAcquire: String[];
    entryRequirements: [String, String][];
    expiryPeriod: String;
    learningOutcomes: Skill[];
    //TODO rec,award,accred here
    homepages:String[];
    landingPages:String[];
    supplementaryDocs: String[];
    issued:String;
    modified:String;
    //TODO changeNote, historyNote here
    additionalNotes: Map<String, String[]>;
    status: String;

    getAllSkillLinks(lang: String):[String,String][] {
        if (!this.learningOutcomes) return null;
        var links:[String,String][] = [];
        for (let skill of this.learningOutcomes) {
            links.push([skill.prefLabels.get(lang), skill.uri]);
        }
        return links;
    }
    getPrefLabels(prefLang: String): String[] {
        if (this.prefLabels.has(prefLang)) return this.prefLabels.get(prefLang);
        if (this.prefLabels.has("en")) return this.prefLabels.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.prefLabels.has(lang)) return this.prefLabels.get(lang);
        }
        return null;
    }
    getAltLabels(prefLang: String): String[] {
        if (this.altLabels.has(prefLang)) return this.altLabels.get(prefLang);
        if (this.altLabels.has("en")) return this.altLabels.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.altLabels.has(lang)) return this.altLabels.get(lang);
        }
        return null;
    }
    getDefinitions(prefLang: String): String[] {
        if (this.definitions.has(prefLang)) return this.definitions.get(prefLang);
        if (this.definitions.has("en")) return this.definitions.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.definitions.has(lang)) return this.definitions.get(lang);
        }
        return null;
    }
    getDescriptions(prefLang: String): String[] {
        if (this.descriptions.has(prefLang)) return this.descriptions.get(prefLang);
        if (this.descriptions.has("en")) return this.descriptions.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.descriptions.has(lang)) return this.descriptions.get(lang);
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
    getLandingPageLinks():[String,String][] {
        if (!this.landingPages) return null;
        var links:[String,String][] = [];
        for (let url of this.landingPages) {
            links.push([url, url]);
        }
        return links;
    }
    getSupplementaryDocLinks():[String,String][] {
        if (!this.supplementaryDocs) return null;
        var links:[String,String][] = [];
        for (let url of this.supplementaryDocs) {
            links.push([url, url]);
        }
        return links;
    }
    getAdditionalNotes(prefLang: String): String[] {
        if (this.additionalNotes.has(prefLang)) return this.additionalNotes.get(prefLang);
        if (this.additionalNotes.has("en")) return this.additionalNotes.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.additionalNotes.has(lang)) return this.additionalNotes.get(lang);
        }
        return null;
    }
}