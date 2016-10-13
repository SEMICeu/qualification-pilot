
import {Skill} from "./skill";
import {QualificationFramework} from "./qualification-framework";
import {Accreditation} from "./accreditation";
import {Agent} from "./agent";
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
    qfAssociationUris: String[];
    qualificationFrameworks: QualificationFramework[];
    eCTSCredits: String;
    volumeOfLearning: String;
    isPartialQualification: String;
    waysToAcquire: String[];
    entryRequirements: [String, String][];
    expiryPeriod: String;
    learningOutcomes: Skill[];
    //TODO rec here
    awardingStarted: String;
    awardingEnded: String;
    awardingLocations: String[];
    awardingBody: Agent;
    accreditationUris: String[];
    accreditations: Accreditation[];
    homepages:String[];
    landingPages:String[];
    supplementaryDocs: String[];
    issued:String;
    modified:String;
    changeNotes: Map<String, String[]>;
    historyNotes: Map<String, String[]>;
    additionalNotes: Map<String, String[]>;
    status: String;
    owner: Agent;
    provenanceAgent: Agent;
    publisher: Agent;

    getPrefLabels(prefLang: String): String[] {
        if (!this.prefLabels) return null;
        if (this.prefLabels.has(prefLang)) return this.prefLabels.get(prefLang);
        if (this.prefLabels.has("en")) return this.prefLabels.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.prefLabels.has(lang)) return this.prefLabels.get(lang);
        }
        return null;
    }
    getAltLabels(prefLang: String): String[] {
        if (!this.altLabels) return null;
        if (this.altLabels.has(prefLang)) return this.altLabels.get(prefLang);
        if (this.altLabels.has("en")) return this.altLabels.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.altLabels.has(lang)) return this.altLabels.get(lang);
        }
        return null;
    }
    getDefinitions(prefLang: String): String[] {
        if (!this.definitions) return null;
        if (this.definitions.has(prefLang)) return this.definitions.get(prefLang);
        if (this.definitions.has("en")) return this.definitions.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.definitions.has(lang)) return this.definitions.get(lang);
        }
        return null;
    }
    getDescriptions(prefLang: String): String[] {
        if (!this.descriptions) return null;
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
    getChangeNotes(prefLang: String): String[] {
        if (!this.changeNotes) return null;
        if (this.changeNotes.has(prefLang)) return this.changeNotes.get(prefLang);
        if (this.changeNotes.has("en")) return this.changeNotes.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.changeNotes.has(lang)) return this.changeNotes.get(lang);
        }
        return null;
    }
    getHistoryNotes(prefLang: String): String[] {
        if (!this.historyNotes) return null;
        if (this.historyNotes.has(prefLang)) return this.historyNotes.get(prefLang);
        if (this.historyNotes.has("en")) return this.historyNotes.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.historyNotes.has(lang)) return this.historyNotes.get(lang);
        }
        return null;
    }
    getAdditionalNotes(prefLang: String): String[] {
        if (!this.additionalNotes) return null;
        if (this.additionalNotes.has(prefLang)) return this.additionalNotes.get(prefLang);
        if (this.additionalNotes.has("en")) return this.additionalNotes.get("en");
        for (let lang of this.referenceLanguage) {
            if (this.additionalNotes.has(lang)) return this.additionalNotes.get(lang);
        }
        return null;
    }
}