
import {Agent} from "./agent";
export class Recognition {

    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    recognizedBody: Agent;
    recognizingAgent: Agent;
    recognizingLocation: String;
    issued: String;
    endDate: String;
    trusted: String;

    publisher: Agent;
}