import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';

import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {ConcatsParser} from "./support/concats-parser";
import {Accreditation} from "../model/accreditation";
import {QueryTemplates} from "./support/query-templates";
import {Agent} from "../model/agent";
import {Recognition} from "../model/recognition";

@Injectable()
export class RecognitionService {

    constructor(private http: Http) { };

    url = endPointUrl;
    headers =  endPointHeaders;

    getRecognitions (qualUri: String, langs:String[]):Promise<Recognition[]> {

        //console.log(QueryTemplates.makeForRecognitions(qualUri, langs));
        return this.http
            .post(this.url, QueryTemplates.makeForRecognitions(qualUri, langs) ,  {headers: this.headers})
            .toPromise()
            .then(res => {
                let objects = res.json().results.bindings;
                //console.log(res.json().results);
                var recs: Recognition[] = [];
                for (let values of objects) {
                    if (values.uri) {
                        let recognition = new Recognition(values.uri.value);

                        if (values.recognizedBodyName_lang_group) {
                            recognition.recognizedBody = new Agent();
                            recognition.recognizedBody.names = ConcatsParser.makeMapOfStringArrays(values.recognizedBodyName_lang_group.value);
                            if (values.recognizedBodyMail_group) recognition.recognizedBody.mails = ConcatsParser.makeStringArray(values.recognizedBodyMail_group.value);
                            if (values.recognizedBodyPage_group) recognition.recognizedBody.pages =  ConcatsParser.makeStringArray(values.recognizedBodyPage_group.value);
                        }
                        if (values.recognizingLocation) recognition.recognizingLocation = values.recognizingLocation.value;
                        if (values.recognizingAgentName_lang_group) {
                            recognition.recognizingAgent = new Agent();
                            recognition.recognizingAgent.names = ConcatsParser.makeMapOfStringArrays(values.recognizingAgentName_lang_group.value);
                            if (values.recognizingAgentMail_group) recognition.recognizingAgent.mails = ConcatsParser.makeStringArray(values.recognizingAgentMail_group.value);
                            if (values.recognizingAgentPage_group) recognition.recognizingAgent.pages = ConcatsParser.makeStringArray(values.recognizingAgentPage_group.value);
                        }
                        if (values.issued) recognition.issued = values.issued.value;
                        if (values.endDate) recognition.endDate = values.endDate.value;
                        if (values.publisherName_lang_group) {
                            recognition.publisher = new Agent();
                            recognition.publisher.names = ConcatsParser.makeMapOfStringArrays(values.publisherName_lang_group.value);
                            if (values.publisherMail_group) recognition.publisher.mails = ConcatsParser.makeStringArray(values.publisherMail_group.value);
                            if (values.publisherPage_group) recognition.publisher.pages = ConcatsParser.makeStringArray(values.publisherPage_group.value);
                        }
                        if (values.trusted) recognition.trusted = values.trusted.value;

                        recs.push(recognition);
                    }
                }
                return recs;
            });
    }
}