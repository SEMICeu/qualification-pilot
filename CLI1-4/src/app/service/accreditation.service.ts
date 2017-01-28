import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {ConcatsParser} from "./support/concats-parser";
import {Accreditation} from "../model/qms/accreditation";
import {QueryAccreditation} from "./query-scripts/query-accreditation";
import {Agent} from "../model/qms/agent";

@Injectable()
export class AccreditationService {

  constructor(private http: Http) { };

  url = endPointUrl;
  headers =  endPointHeaders;

  getAccreditations (qualUri: string, langs:string[]):Promise<Accreditation[]> {

    //console.log(QueryScripts.makeForAccreditations(qualUri, langs));
    return this.http
      .post(this.url, QueryAccreditation.make(qualUri, langs) ,  {headers: this.headers})
      .toPromise()
      .then(res => {
        let objects = res.json().results.bindings;
        //console.log(res.json().results);
        let accreds: Accreditation[] = [];
        for (let values of objects) {
          if (values.uri) {
            let accreditation = new Accreditation(values.uri.value);

            if (values.recognizedBodyName_lang_group) {
              accreditation.recognizedBody = new Agent();
              accreditation.recognizedBody.names = ConcatsParser.makeMapOfStringArrays(values.recognizedBodyName_lang_group.value);
              if (values.recognizedBodyMail_group) accreditation.recognizedBody.mails = ConcatsParser.makeStringArray(values.recognizedBodyMail_group.value);
              if (values.recognizedBodyPage_group) accreditation.recognizedBody.pages =  ConcatsParser.makeStringArray(values.recognizedBodyPage_group.value);
            }
            if (values.recognizingAgentName_lang_group) {
              accreditation.recognizingAgent = new Agent();
              accreditation.recognizingAgent.names = ConcatsParser.makeMapOfStringArrays(values.recognizingAgentName_lang_group.value);
              if (values.recognizingAgentMail_group) accreditation.recognizingAgent.mails = ConcatsParser.makeStringArray(values.recognizingAgentMail_group.value);
              if (values.recognizingAgentPage_group) accreditation.recognizingAgent.pages = ConcatsParser.makeStringArray(values.recognizingAgentPage_group.value);
            }
            if (values.issued) accreditation.issued = values.issued.value;
            if (values.reviewDate) accreditation.reviewDate = values.reviewDate.value;
            if (values.endDate) accreditation.endDate = values.endDate.value;
            if (values.homepage_group) accreditation.homepages = ConcatsParser.makeStringArray(values.homepage_group.value);
            if (values.landingPage_group) accreditation.landingPages = ConcatsParser.makeStringArray(values.landingPage_group.value);
            if (values.supplementaryDoc_group) accreditation.supplementaryDocs = ConcatsParser.makeStringArray(values.supplementaryDoc_group.value);
            if (values.subject_group) accreditation.subjects = ConcatsParser.makeStringArray(values.subject_group.value);
            if (values.publisherName_lang_group) {
              accreditation.publisher = new Agent();
              accreditation.publisher.names = ConcatsParser.makeMapOfStringArrays(values.publisherName_lang_group.value);
              if (values.publisherMail_group) accreditation.publisher.mails = ConcatsParser.makeStringArray(values.publisherMail_group.value);
              if (values.publisherPage_group) accreditation.publisher.pages = ConcatsParser.makeStringArray(values.publisherPage_group.value);
            }
            if (values.trusted) accreditation.trusted = values.trusted.value;
            if (values.sourceDistributionPage) accreditation.sourceDistributionPage = values.sourceDistributionPage.value;
            accreds.push(accreditation);
          }
        }
        return accreds;
      });
  }
}
