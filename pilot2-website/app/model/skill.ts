
export class Skill {


    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    prefLabels: Map<String, String[]>;
    descriptions: Map<String, String[]>;

}