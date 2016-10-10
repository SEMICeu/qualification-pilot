
import {LearningOutcome} from "./learning-outcome";
export class Qualification {

    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    referenceLanguage: String;
    prefLabels: Map<String, String[]>;
    altLabels: Map<String, String[]>;
    definitions: Map<String, String[]>;
    learningOutcomes: LearningOutcome[];
    descriptions: Map<String, String[]>;
    iSCED_Fcode: String[];
    eqfAssociationUri: String;
    eqfTarget: String;
    nqfAssociationUris: String[];
    eCTSCredits: String;
    volumeOfLearning: String;

    expiryPeriod: String;

}