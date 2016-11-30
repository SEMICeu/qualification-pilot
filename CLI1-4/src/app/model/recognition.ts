
import {Agent} from "./agent";
export class Recognition {

    constructor(uri: string) {
        this.uri = uri;
    }

    uri: string;
    recognizedBody: Agent;
    recognizingAgent: Agent;
    recognizingLocation: string;
    issued: string;
    endDate: string;
    trusted: string;

    publisher: Agent;
}
