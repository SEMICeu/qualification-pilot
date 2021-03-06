import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';

import {Skill} from "../model/qms/skill";
import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {ConcatsParser} from "./support/concats-parser";
import {QuerySkill} from "./query-scripts/query-skill";

@Injectable()
export class SkillService {

    constructor(private http: Http) { };

    url = endPointUrl;
    headers =  endPointHeaders;

    getSkills (qualUri: string, langs:string[]):Promise<Skill[]> {

        //console.log(QueryScripts.makeForSkills(qualUri, langs));
        return this.http
            .post(this.url, QuerySkill.make(qualUri, langs) ,  {headers: this.headers})
            .toPromise()
            .then(res => {
                let objects = res.json().results.bindings;
                //console.log(res.json().results);
                var skills: Skill[] = [];
                for (let values of objects) {
                    if (values.uri && values.prefLabel_lang_group) {
                        skills.push(new Skill(values.uri.value));
                        skills[skills.length-1].prefLabels = ConcatsParser.makeMapOfStringArrays(values.prefLabel_lang_group.value);
                        skills[skills.length-1].descriptions = ConcatsParser.makeMapOfStringArrays(values.description_lang_group.value);
                    }
                }
                return skills;
            });
    }
}
