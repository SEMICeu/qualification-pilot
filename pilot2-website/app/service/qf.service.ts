import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';

import {QueryBuilder, Triple} from "./support/query-builder";
import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {ConcatsParser} from "./support/concats-parser";
import {QualificationFramework} from "../model/qualification-framework";

@Injectable()
export class QfService {

    constructor(private http: Http) { };

    url = endPointUrl;
    headers =  endPointHeaders;
    prefLang:String = "en";

    getQualificationFrameworks (qualUri: String, langs:String[]):Promise<QualificationFramework[]> {

        console.log(this.makeqfQuery(qualUri, langs));
        return this.http
            .post(this.url, this.makeqfQuery(qualUri, langs), {headers: this.headers})
            .toPromise()
            .then(res => {
                let objects = res.json().results.bindings;
                console.log(res.json().results);
                var qfs: QualificationFramework[] = [];
                for (let values of objects) {
                    if (values.uri) {
                        let qf = new QualificationFramework(values.uri.value);

                        if (values.description_lang_group) qf.descriptions = ConcatsParser.makeMapOfStringArrays(values.description_lang_group.value);
                        if (values.issued) qf.issued = values.issued.value;
                        if (values.targetFramework) qf.targetFrameWork = values.targetFramework.value;
                        if (values.targetFrameworkVersion) qf.targetFrameworkVersion = values.targetFrameworkVersion.value;
                        if (values.target) qf.target = values.target.value;
                        if (values.targetDescription_lang_group) qf.targetDescriptions = ConcatsParser.makeMapOfStringArrays(values.targetDescription_lang_group.value);
                        if (values.targetNotation_group) qf.targetNotations = ConcatsParser.makeStringArray(values.targetNotation_group.value);
                        if (values.targetName_lang_group) qf.targetNames = ConcatsParser.makeMapOfStringArrays(values.targetName_lang_group.value);
                        if (values.targetUrl) qf.targetUrl = values.targetUrl.value;
                        if (values.homepage_group) qf.homepages =  ConcatsParser.makeStringArray(values.homepage_group.value);
                        if (values.trusted) qf.trusted = values.trusted.value;
                        if (values.publisherName_lang_group) qf.publisherNames = ConcatsParser.makeMapOfStringArrays(values.publisherName_lang_group.value);
                        if (values.publisherMail_group) qf.publisherMails = ConcatsParser.makeStringArray(values.publisherMail_group.value);
                        if (values.publisherPage_group) qf.publisherPages = ConcatsParser.makeStringArray(values.publisherPage_group.value);
                        qfs.push(qf);
                    }
                }
                return qfs;
            });
    }

    makeqfQuery (qualUri: String, langs:String[]):String {
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

        queryBuild.addTriple( new Triple().subject("<" + qualUri + ">").predicate("esco:hasAssociation").object("?uri"));
        queryBuild.addTriple( new Triple().selectSubject("?uri").predicate("dcterms:type").object("<http://data.europa.eu/esco/association-type#qf-level>"));
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:description").selectObject("?description").after("}").langGroupConcat() );
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:issued").selectObject("?issued").after("}"));
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetFramework").selectObject("?targetFramework").after("}"));
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetFrameworkVersion").selectObject("?targetFrameworkVersion").after("}"));
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:target").selectObject("?target").after("}") );
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetDescription").selectObject("?targetDescription").after("}").langGroupConcat() );
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetNotation").selectObject("?targetNotation").after("}").groupConcat() );
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetName").selectObject("?targetName").after("}").langGroupConcat());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetUrl").selectObject("?targetUrl").after("}"));

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:homepage").selectObject("?homepage").after("}").groupConcat());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("<http://data.europa.eu/esco/qdr#generatedByTrustedSource>").selectObject("?trusted").after("}"));

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:publisher").object("?publisherUri"));
        queryBuild.addTriple( new Triple().subject("?publisherUri").predicate("foaf:name").selectObject("?publisherName").langGroupConcat());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:mbox").selectObject("?publisherMail").after("}").groupConcat());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:homepage").selectObject("?publisherPage").after("}}").groupConcat());

        return queryBuild.buildSelect();
    }
}