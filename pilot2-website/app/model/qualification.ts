
import {Skill} from "./skill";
import {QualificationFramework} from "./qualification-framework";
import {Accreditation} from "./accreditation";
import {Agent} from "./agent";
import {Recognition} from "./recognition";
export class Qualification {

    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    referenceLang: String[];
    referenceLangLabels: Map<String, String[]>;
    prefLabels: Map<String, String[]>;
    altLabels: Map<String, String[]>;
    definitions: Map<String, String[]>;
    loSkillUris: String[];
    descriptions: Map<String, String[]>;
    iSCEDFcode: String[];
    iSCEDFcodeLabel: Map<String, String[]>;
    qfAssociationUris: String[];
    qualificationFrameworks: QualificationFramework[];
    eCTSCredits: String;
    volumeOfLearning: String;
    isPartialQualification: String;
    waysToAcquire: String[];
    entryRequirements: [String, String][];
    expiryPeriod: String;
    learningOutcomes: Skill[];
    recognitionUris: String[];
    recognitions: Recognition[];
    awardingStarted: String;
    awardingEnded: String;
    awardingLocations: Map<String, String[]>;
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
    trusted: String;


    getReferenceLangLabels(prefLang: String): String[] {
        if (!this.referenceLangLabels) return null;
        if (this.referenceLangLabels.has(prefLang)) return this.referenceLangLabels.get(prefLang);
        if (this.referenceLangLabels.has("en")) return this.referenceLangLabels.get("en");
        for (let lang of this.referenceLang) {
            if (this.referenceLangLabels.has(lang)) return this.referenceLangLabels.get(lang);
        }
        return null;
    }
    getPrefLabels(prefLang: String): String[] {
        if (!this.prefLabels) return null;
        if (this.prefLabels.has(prefLang)) return this.prefLabels.get(prefLang);
        if (this.prefLabels.has("en")) return this.prefLabels.get("en");
        for (let lang of this.referenceLang) {
            if (this.prefLabels.has(lang)) return this.prefLabels.get(lang);
        }
        return null;
    }
    getAltLabels(prefLang: String): String[] {
        if (!this.altLabels) return null;
        if (this.altLabels.has(prefLang)) return this.altLabels.get(prefLang);
        if (this.altLabels.has("en")) return this.altLabels.get("en");
        for (let lang of this.referenceLang) {
            if (this.altLabels.has(lang)) return this.altLabels.get(lang);
        }
        return null;
    }
    getDefinitions(prefLang: String): String[] {
        if (!this.definitions) return null;
        if (this.definitions.has(prefLang)) return this.definitions.get(prefLang);
        if (this.definitions.has("en")) return this.definitions.get("en");
        for (let lang of this.referenceLang) {
            if (this.definitions.has(lang)) return this.definitions.get(lang);
        }
        return null;
    }
    getDescriptions(prefLang: String): String[] {
        if (!this.descriptions) return null;
        if (this.descriptions.has(prefLang)) return this.descriptions.get(prefLang);
        if (this.descriptions.has("en")) return this.descriptions.get("en");
        for (let lang of this.referenceLang) {
            if (this.descriptions.has(lang)) return this.descriptions.get(lang);
        }
        return null;
    }
    private getISCEDFcodeLabels(prefLang: String): String[] {
        if (!this.iSCEDFcodeLabel) return null;
        if (this.iSCEDFcodeLabel.has(prefLang)) return this.iSCEDFcodeLabel.get(prefLang);
        if (this.iSCEDFcodeLabel.has("en")) return this.iSCEDFcodeLabel.get("en");
        for (let lang of this.referenceLang) {
            if (this.iSCEDFcodeLabel.has(lang)) return this.iSCEDFcodeLabel.get(lang);
        }
        return null;
    }
    getISCEDFcode (prefLang: String): String[] {
        if (!this.iSCEDFcode) return null;
        let labels = this.getISCEDFcodeLabels(prefLang);
        if (labels.length == this.iSCEDFcode.length) {
            let labeledIscedfcodes: String[] = [];
            for (let i = 0; i < labels.length; ++i) {
                labeledIscedfcodes.push(this.iSCEDFcode[i] + " " + labels[i])
            }
            return labeledIscedfcodes;
        }
        return this.iSCEDFcode;
    }
    getAwardingLocations(prefLang: String): String[] {
        if (!this.awardingLocations) return null;
        if (this.awardingLocations.has(prefLang)) return this.awardingLocations.get(prefLang);
        if (this.awardingLocations.has("en")) return this.awardingLocations.get("en");
        for (let lang of this.referenceLang) {
            if (this.awardingLocations.has(lang)) return this.awardingLocations.get(lang);
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
        for (let lang of this.referenceLang) {
            if (this.changeNotes.has(lang)) return this.changeNotes.get(lang);
        }
        return null;
    }
    getHistoryNotes(prefLang: String): String[] {
        if (!this.historyNotes) return null;
        if (this.historyNotes.has(prefLang)) return this.historyNotes.get(prefLang);
        if (this.historyNotes.has("en")) return this.historyNotes.get("en");
        for (let lang of this.referenceLang) {
            if (this.historyNotes.has(lang)) return this.historyNotes.get(lang);
        }
        return null;
    }
    getAdditionalNotes(prefLang: String): String[] {
        if (!this.additionalNotes) return null;
        if (this.additionalNotes.has(prefLang)) return this.additionalNotes.get(prefLang);
        if (this.additionalNotes.has("en")) return this.additionalNotes.get("en");
        for (let lang of this.referenceLang) {
            if (this.additionalNotes.has(lang)) return this.additionalNotes.get(lang);
        }
        return null;
    }
}