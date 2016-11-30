
import {Skill} from "./skill";
import {QualificationFramework} from "./qualification-framework";
import {Accreditation} from "./accreditation";
import {Agent} from "./agent";
import {Recognition} from "./recognition";
import {Link} from "../link";
export class Qualification {

    constructor(uri: string) {
        this.uri = uri;
    }

    uri: string;
    referenceLang: string[];
    referenceLangLabels: Map<string, string[]>;
    prefLabels: Map<string, string[]>;
    altLabels: Map<string, string[]>;
    definitions: Map<string, string[]>;
    loSkillUris: string[];
    descriptions: Map<string, string[]>;
    iSCEDFcode: string[];
    iSCEDFcodeLabel: Map<string, string[]>;
    qfAssociationUris: string[];
    qualificationFrameworks: QualificationFramework[];
    eCTSCredits: string;
    volumeOfLearning: string;
    isPartialQualification: string;
    waysToAcquire: string[];
    entryRequirements: [string, string][];
    expiryPeriod: string;
    learningOutcomes: Skill[];
    recognitionUris: string[];
    recognitions: Recognition[];
    awardingStarted: string;
    awardingEnded: string;
    awardingLocations: Map<string, string[]>;
    awardingBodyUris: string[];
    awardingBodies: Agent[];
    accreditationUris: string[];
    accreditations: Accreditation[];
    homepages:string[];
    landingPages:string[];
    supplementaryDocs: string[];
    issued:string;
    modified:string;
    changeNotes: Map<string, string[]>;
    historyNotes: Map<string, string[]>;
    additionalNotes: Map<string, string[]>;
    status: string;
    owner: Agent;
    provenanceAgent: Agent;
    publisher: Agent;
    trusted: string;


    getReferenceLangLabels(prefLang: string): string[] {
        if (!this.referenceLangLabels) return null;
        if (this.referenceLangLabels.has(prefLang)) return this.referenceLangLabels.get(prefLang);
        if (this.referenceLangLabels.has("en")) return this.referenceLangLabels.get("en");
        for (let lang of this.referenceLang) {
            if (this.referenceLangLabels.has(lang)) return this.referenceLangLabels.get(lang);
        }
        return null;
    }
    getPrefLabels(prefLang: string): string[] {
        if (!this.prefLabels) return null;
        if (this.prefLabels.has(prefLang)) return this.prefLabels.get(prefLang);
        if (this.prefLabels.has("en")) return this.prefLabels.get("en");
        for (let lang of this.referenceLang) {
            if (this.prefLabels.has(lang)) return this.prefLabels.get(lang);
        }
        return null;
    }
    getAltLabels(prefLang: string): string[] {
        if (!this.altLabels) return null;
        if (this.altLabels.has(prefLang)) return this.altLabels.get(prefLang);
        if (this.altLabels.has("en")) return this.altLabels.get("en");
        for (let lang of this.referenceLang) {
            if (this.altLabels.has(lang)) return this.altLabels.get(lang);
        }
        return null;
    }
    getDefinitions(prefLang: string): string[] {
        if (!this.definitions) return null;
        if (this.definitions.has(prefLang)) return this.definitions.get(prefLang);
        if (this.definitions.has("en")) return this.definitions.get("en");
        for (let lang of this.referenceLang) {
            if (this.definitions.has(lang)) return this.definitions.get(lang);
        }
        return null;
    }
    getDescriptions(prefLang: string): string[] {
        if (!this.descriptions) return null;
        if (this.descriptions.has(prefLang)) return this.descriptions.get(prefLang);
        if (this.descriptions.has("en")) return this.descriptions.get("en");
        for (let lang of this.referenceLang) {
            if (this.descriptions.has(lang)) return this.descriptions.get(lang);
        }
        return null;
    }
    private getISCEDFcodeLabels(prefLang: string): string[] {
        if (!this.iSCEDFcodeLabel) return null;
        if (this.iSCEDFcodeLabel.has(prefLang)) return this.iSCEDFcodeLabel.get(prefLang);
        if (this.iSCEDFcodeLabel.has("en")) return this.iSCEDFcodeLabel.get("en");
        for (let lang of this.referenceLang) {
            if (this.iSCEDFcodeLabel.has(lang)) return this.iSCEDFcodeLabel.get(lang);
        }
        return null;
    }
    getISCEDFcode (prefLang: string): string[] {
        if (!this.iSCEDFcode) return null;
        let labels = this.getISCEDFcodeLabels(prefLang);
        if (labels.length == this.iSCEDFcode.length) {
            let labeledIscedfcodes: string[] = [];
            for (let i = 0; i < labels.length; ++i) {
                labeledIscedfcodes.push(this.iSCEDFcode[i] + " " + labels[i])
            }
            return labeledIscedfcodes;
        }
        return this.iSCEDFcode;
    }
    getAwardingLocations(prefLang: string): string[] {
        if (!this.awardingLocations) return null;
        if (this.awardingLocations.has(prefLang)) return this.awardingLocations.get(prefLang);
        if (this.awardingLocations.has("en")) return this.awardingLocations.get("en");
        for (let lang of this.referenceLang) {
            if (this.awardingLocations.has(lang)) return this.awardingLocations.get(lang);
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
    getLandingPageLinks():Link[] {
        if (!this.landingPages) return null;
        var links:Link[] = [];
        for (let url of this.landingPages) {
            links.push(new Link(url, url));
        }
        return links;
    }
    getSupplementaryDocLinks():Link[] {
        if (!this.supplementaryDocs) return null;
        var links:Link[] = [];
        for (let url of this.supplementaryDocs) {
            links.push(new Link(url, url));
        }
        return links;
    }
    getChangeNotes(prefLang: string): string[] {
        if (!this.changeNotes) return null;
        if (this.changeNotes.has(prefLang)) return this.changeNotes.get(prefLang);
        if (this.changeNotes.has("en")) return this.changeNotes.get("en");
        for (let lang of this.referenceLang) {
            if (this.changeNotes.has(lang)) return this.changeNotes.get(lang);
        }
        return null;
    }
    getHistoryNotes(prefLang: string): string[] {
        if (!this.historyNotes) return null;
        if (this.historyNotes.has(prefLang)) return this.historyNotes.get(prefLang);
        if (this.historyNotes.has("en")) return this.historyNotes.get("en");
        for (let lang of this.referenceLang) {
            if (this.historyNotes.has(lang)) return this.historyNotes.get(lang);
        }
        return null;
    }
    getAdditionalNotes(prefLang: string): string[] {
        if (!this.additionalNotes) return null;
        if (this.additionalNotes.has(prefLang)) return this.additionalNotes.get(prefLang);
        if (this.additionalNotes.has("en")) return this.additionalNotes.get("en");
        for (let lang of this.referenceLang) {
            if (this.additionalNotes.has(lang)) return this.additionalNotes.get(lang);
        }
        return null;
    }
}
