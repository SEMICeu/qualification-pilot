
export class Qualification {

    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    referenceLanguage: String;
    prefLabels: Map<String, String[]>;
    altLabels: Map<String, String[]>;
    definitions: Map<String, String[]>;

    eqfAssocObjectUri: String;
    eqfTarget: String;

}