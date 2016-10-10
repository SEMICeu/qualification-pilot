

import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Qualification} from "../model/qualification";
import {QueryBuilder, Triple} from "./query-builder";

@Injectable()
export class QualificationService {

    constructor(private http: Http) { };

    url = "http://localhost:8080/rdf4j-server/repositories/QPilot2";

    detailedQualification: Qualification;

    getQualificationDetailed(uri: String): Promise<Qualification> {
        let promisedQualification = this.queryQualificationDetailed(uri);
        promisedQualification.then(qualification => this.detailedQualification = qualification);

        return promisedQualification;
    }
    hasExistingDetailedQualification(): boolean {
        return this.detailedQualification != null;
    }

    hasSameDetailedQualificationUri(uri: String): boolean {
        return (this.detailedQualification && this.detailedQualification.uri == uri);
    }

    getExistingQualificationDetailed(): Qualification {
        if (this.detailedQualification) {
            return this.detailedQualification;
        }
        else {
            console.error("No qualification set, no uri given");
        }
    }


    queryQualificationDetailed(uri: String): Promise<Qualification> {
        let headers = new Headers({
            'content-type': 'application/sparql-query',
            'accept': 'application/json'
        });

        console.log(this.makeDetailQuery("<" + uri + ">", "en"));

        return this.http
            .post(this.url, this.makeDetailQuery("<" + uri + ">", "en") ,  {headers: headers})
            .toPromise()
            .then(res => {
                    let values = res.json().results.bindings[0];
                    console.log(res.json().results);
                    let qualification = new Qualification(uri);

                    if (values.referenceLanguage) qualification.referenceLanguage = values.referenceLanguage.value;
                    if (values.prefLabel_group && values.prefLabel_lang_group) {
                        qualification.prefLabels = this.makeMapFromStringConcats(values.prefLabel_lang_group.value, values.prefLabel_group.value);
                    }
                    if (values.altLabel_group && values.altLabel_lang_group) {
                        qualification.altLabels = this.makeMapFromStringConcats(values.altLabel_lang_group.value, values.altLabel_group.value);
                    }
                    if (values.definition_group && values.definition_lang_group) {
                        qualification.definitions = this.makeMapFromStringConcats(values.definition_lang_group.value, values.definition_group.value)
                    }
                    if (values.eqfAssocObjectUri) qualification.eqfAssocObjectUri = values.eqfAssocObjectUri.value;
                    if (values.eqfTarget) qualification.eqfTarget = values.eqfTarget.value;
                    console.log(qualification);
                    return qualification;
                }
            )
            .catch(this.handleError);
    }

    private makeMapFromStringConcats (concatKeys: String, concatValues: String) {
        let keys = JSON.parse(concatKeys) as String[];
        let values = JSON.parse(concatValues) as String[];

        var map = new Map<String, String[]>();

        if (keys.length > values.length) return map;

        for (let i = 0; i < keys.length; ++i) {
            if (map.has(keys[i])) {
                map.get(keys[i]).push(values[i]);
            }
            else {
                map.set(keys[i], [values[i]]);
            }
        }
        return map;
    }

    private handleError(error: any): Promise<any> {
        console.error('Query failed,', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private makeDetailQuery(uri: String, prefLangCode: String): String {

        let queryBuild = new QueryBuilder();

        let languageCodes = ["'" + prefLangCode + "'", "?referenceLanguage"];

        queryBuild.languageCodes = languageCodes;

        queryBuild.addPrefix("esco", "<http://data.europa.eu/esco/model#>");
        queryBuild.addPrefix("rdf", "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>");
        queryBuild.addPrefix("skos", "<http://www.w3.org/2004/02/skos/core#>");
        queryBuild.addPrefix("dcterms", "<http://purl.org/dc/terms/>");
        queryBuild.addPrefix("foaf", "<http://xmlns.com/foaf/0.1/>");
        queryBuild.addPrefix("prov", "<http://www.w3.org/ns/prov#>");
        queryBuild.addPrefix("dcat", "<http://www.w3.org/ns/dcat#>");
        queryBuild.addPrefix("skosXl", "<http://www.w3.org/2008/05/skos-xl#>");

        queryBuild.addBind ('?uri', uri);

        queryBuild.addTriple( new Triple().subject("?uri").predicate("rdf:type").object("esco:Qualification") );

        queryBuild.addTriple( new Triple().subject("?uri").predicate("esco:referenceLanguage").selectObject("?referenceLanguage") );

        queryBuild.addTriple( new Triple().subject("?uri").predicate("skos:prefLabel").selectObject("?prefLabel").langGroupConcat().filterByLang() );
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:altLabel").selectObject("?altLabel").after("}").langGroupConcat().filterByLang() );

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:definition").object("?definitionNode"));
        queryBuild.addTriple( new Triple().subject("?definitionNode").predicate("esco:language").selectObject("?definition_lang").groupConcat().filterNodeLiteralByLang() );
        queryBuild.addTriple( new Triple().subject("?definitionNode").predicate("esco:nodeLiteral").selectObject("?definition").after("}").groupConcat().after("}") );

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").selectObject("?eqfAssocObjectUri") );
        queryBuild.addTriple( new Triple().subject("?eqfAssocObjectUri").predicate("esco:targetFramework").object("<http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme>") );
        queryBuild.addTriple ( new Triple().subject("?eqfAssocObjectUri").predicate("esco:target").selectObject("?eqfTarget").after("}") );


        // queryBuild.addTriple("OPTIONAL {", "?uri", false, "esco:hasAssociation", "?eqfAssocObjectUri", true, "", false);
        // queryBuild.addTriple("", "?eqfAssocObjectUri", false, "esco:targetFramework", "<http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme>", false, "", false);
        // queryBuild.addTriple("", "?eqfAssocObjectUri", false, "esco:target", "?eqfTarget", true, "}", false);
        //
        // queryBuild.addTriple("OPTIONAL {", "?uri", false, "esco:hasAssociation", "?LOAssocUri", true, "", false);
        // queryBuild.addTriple("", "?LOAssocUri", false, "esco:targetFramework", "<http://data.europa.eu/esco/concept-scheme/skills>", false, "}", false);

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:homepage").selectObject("?homepage").after("}").groupConcat());
        //optional {  ?uri foaf:homepage ?homepage }

        return queryBuild.buildSelect();
    }

    queryPrefixes =
        "PREFIX esco: <http://data.europa.eu/esco/model#> " +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
        "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
        "PREFIX dcterms: <http://purl.org/dc/terms/> " +
        "PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
        "PREFIX prov: <http://www.w3.org/ns/prov#>" +
        "PREFIX dcat: <http://www.w3.org/ns/dcat#>" +
        "PREFIX skosXl: <http://www.w3.org/2008/05/skos-xl#> ";

    detailUri = '<http://data.europa.eu/esco/resource/d3fefee9-4eda-4926-9ada-ea196f7a2263>';
    detailQuery =
        '<http://data.europa.eu/esco/resource/d3fefee9-4eda-4926-9ada-ea196f7a2263>';
    detailQuery =
        'select distinct * where {' +
        'bind(<' + this.detailUri + '> as ?uri)' +
        `
    ?uri rdf:type esco:Qualification .
    ?uri skos:prefLabel ?prefLabel .
    optional {
      ?uri skos:definition ?definitionNode .
      ?definitionNode esco:nodeLiteral ?definition }
    ?uri esco:referenceLanguage ?referenceLanguage .
    optional {
      ?uri esco:hasAssociation ?eqfConcept .
      ?eqfConcept esco:targetFramework <http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme> }
    optional {  ?uri esco:hasISCED-FCode ?foetConcept. }
    optional {
      ?uri esco:hasAwardingActivity ?awardingLocationActivity .
      ?awardingLocationActivity prov:atLocation ?countryUri }
    optional {
      ?uri dcterms:description ?descriptionNode .
      ?descriptionNode esco:nodeLiteral ?description }
    optional {
      ?uri esco:additionalNote ?additionalNoteNode .
      ?additionalNoteNode esco:nodeLiteral ?additionalNotes }
    optional {  ?uri skos:altLabel ?altLabel }
    optional {  ?uri foaf:homepage ?homepage }
    optional {  ?uri esco:supplementaryDoc ?supplementaryDoc }
    optional {
      ?uri esco:hasAwardingActivity ?awardingBodyActivity .
      ?awardingBodyActivity prov:wasAssociatedWith ?abUri .
    optional { ?abUri foaf:name ?abName }
    optional {?abUri foaf:mbox ?abEmail }
    optional {?abUri foaf:homePage ?abHomepage } }
    optional {  ?uri dcterms:creator ?ownerUri .
    optional {  ?ownerUri foaf:name ?ownerName  }
    optional {  ?ownerUri foaf:mbox ?ownerEmail }
    optional {  ?ownerUri foaf:homepage ?ownerHomepage } }
    optional {  ?uri dcterms:publisher ?publisherUri .
    optional {  ?publisherUri foaf:name ?publisherName }
    optional {  ?publisherUri foaf:mbox ?publisherEmail } }
    optional {  ?uri esco:hasECTSCreditPoints ?hasECTSCreditPoints . }
    optional {  ?uri esco:isPartialQualification ?isPartialQualification . }
    optional {  ?uri esco:waysToAcquire ?waysToAcquire . }
    optional {  ?uri esco:volumeOfLearning ?volumeOfLearning . }
    optional {  ?uri dcterms:issued ?issued . }
    optional {  ?uri dcterms:modified ?modified . }
    optional {  ?uri dcat:landingPage ?landingPage . }
    optional {  ?uri esco:hasAssociation ?nqfAssoc .
      ?nqfAssoc esco:targetName ?nqfValue .
      ?nqfAssoc dcterms:type <http://data.europa.eu/esco/association-type#qf-level> . }
    optional { ?uri esco:hasAssociation ?LOAssoc .
      ?LOAssoc dcterms:type <http://data.europa.eu/esco/association-type#learning-outcome> .
      ?LOAssoc esco:targetFramework <http://data.europa.eu/esco/concept-scheme/skills> .
      ?LOAssoc esco:target ?skill .
      ?skill skosXl:prefLabel ?skillPrefLabel .
      ?skillPrefLabel skosXl:literalForm ?skillLabel }
   }`;
}