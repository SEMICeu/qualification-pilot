import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';

import {QueryBuilder, Triple} from "./query-builder";
import {Skill} from "../model/skill";
import {endPointUrl, endPointHeaders} from "./end-point-configs";

@Injectable()
export class SkillService {

    constructor(private http: Http) { };

    url = endPointUrl;
    headers =  endPointHeaders;
    prefLang:String = "en";

    getSkills (uris: String[], langs:String[]):Promise<Skill[]> {

        console.log(this.makeSkillsQuery(uris, langs));
        return this.http
            .post(this.url, this.makeSkillsQuery(uris, langs) ,  {headers: this.headers})
            .toPromise()
            .then(res => {
                let objects = res.json().results.bindings;
                console.log(res.json().results);
                var skills: Skill[] = [];
                for (let values of objects) {
                    if (values.uri && values.prefLabel_lang_group) {
                        skills.push(new Skill(values.uri));
                        skills[skills.length-1].prefLabels = this.makeMapFromLangConcat(values.prefLabel_lang_group.value);
                        if (values.descriptions_lang_group) {
                            skills[skills.length-1].prefLabels = this.makeMapFromLangConcat(values.descriptions_lang_group.value);
                        }
                    }
                }
                return skills;
            });

    }
    private makeMapFromLangConcat (concat: string): Map<String, String[]> {
        let array = JSON.parse(concat) as String[];

        var map = new Map<String, String[]>();

        if (array == [""]) return map;

        for (let item of array) {
            let split = item.split("@");
            if (split.length == 2) {

                if (map.has(split[1])) {
                    map.get(split[1]).push(split[0]);
                }
                else {
                    map.set(split[1], [split[0]]);
                }
            }
        }
        return map;
    }

    makeSkillsQuery (uris: String[], langs:String[]):String {
        let queryBuild = new QueryBuilder();

        var langCodes:String[] = [];
        for (let lang of langs) {
            langCodes.push("'" + lang + "'");
        }

        queryBuild.languageCodes = langCodes;

        queryBuild.addPrefix("esco", "<http://data.europa.eu/esco/model#>");
        queryBuild.addPrefix("rdf", "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>");
        queryBuild.addPrefix("skos", "<http://www.w3.org/2004/02/skos/core#>");
        queryBuild.addPrefix("dcterms", "<http://purl.org/dc/terms/>");
        queryBuild.addPrefix("foaf", "<http://xmlns.com/foaf/0.1/>");
        queryBuild.addPrefix("prov", "<http://www.w3.org/ns/prov#>");
        queryBuild.addPrefix("dcat", "<http://www.w3.org/ns/dcat#>");
        queryBuild.addPrefix("skosXl", "<http://www.w3.org/2008/05/skos-xl#>");

        var values = "VALUES ?uri {";
        for (let uri of uris) {
            values += "<" + uri + ">";
        }
        values += "}";
        queryBuild.addFreeFormTriple(values);

        queryBuild.addTriple( new Triple().selectSubject("?uri").predicate("skosXl:prefLabel").object("?prefLabelNode") );
        queryBuild.addTriple( new Triple().subject("?prefLabelNode").predicate("skosXl:literalForm").selectObject("?prefLabel").langGroupConcat().filterByLang());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:description").selectObject("?description").after("}").langGroupConcat().filterByLang() );



        return queryBuild.buildSelect();
    }
}