import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';

import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {Agent} from "../model/agent";
import {QueryAwardingBody} from "./query-scripts/query-awarding-body";
import {ConcatsParser} from "./support/concats-parser";

@Injectable()
export class AwardingBodyService {

  constructor(private http: Http) { };

  url = endPointUrl;
  headers =  endPointHeaders;

  getAgents (qualUri: string, langs:string[]):Promise<Agent[]> {

    return this.http
      .post(this.url, QueryAwardingBody.make(qualUri, langs) ,  {headers: this.headers})
      .toPromise()
      .then(res => {
        let objects = res.json().results.bindings;
        // console.log(res.json().results);
        var awardingBodies: Agent[] = [];
        for (let values of objects) {
            if (values.agentName_lang_group) {
              let agent = new Agent();
              agent.names = ConcatsParser.makeMapOfStringArrays(values.agentName_lang_group.value);
              if (values.agentMail_group) agent.mails = ConcatsParser.makeStringArray(values.agentMail_group.value);
              if (values.agentPage_group) agent.pages = ConcatsParser.makeStringArray(values.agentPage_group.value);
              awardingBodies.push(agent);
            }
        }
        // console.log(awardingBodies);
        return awardingBodies;
      });
  }
}
