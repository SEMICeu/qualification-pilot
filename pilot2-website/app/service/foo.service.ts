import { Injectable } from '@angular/core';

import {Http, Headers, URLSearchParams, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';

// import { Foo } from './foo';
// import {FOOS} from './foo-test-data'
import { QueryBuilder } from './support/query-builder';
import {Qualification} from "../model/qualification";

@Injectable()
export class FooService {


    constructor(private http: Http) { };

    // getFoos2(): Promise<String> {
    //
    //     let url = "http://localhost:8080/rdf4j-server/repositories";
    //
    //     let headers = new Headers({
    //         //'content-type': 'application/x-www-form-urlencoded',
    //         'accept': 'application/sparql-results+json, */*;q=0.5'
    //     });
    //     //
    //     // let params = new URLSearchParams();
    //     // params.set('accept', 'application/sparql-results+json, */*;q=0.5');
    //     // console.log(params);
    //     //
    //     // let options = new RequestOptions({ headers: headers, params: params });
    //
    //
    //     return this.http
    //         .get(url)
    //         .toPromise()
    //         .then(res => res)
    // }

    // test(){
    //
    //     // test = new Qualification();
    //     this.doQualificationDetailQuery().then(result => {
    //
    //         console.log(result.prefLabel);
    //     });
    // }

    // doQualificationDetailQuery(): Promise<Qualification> {
    //
    //     // let url = "http://localhost:8080/rdf4j-server/repositories";
    //     //
    //     // let headers = new Headers({
    //     //     'accept': 'application/sparql-results+json, */*;q=0.5'
    //     // });
    //     //
    //     // console.log( this.http
    //     //     .get(url,  {headers: headers})
    //     //     .toPromise()
    //     //     .then(res => console.log(res.json())));
    //
    //     let headers = new Headers({
    //         'content-type': 'application/sparql-query',
    //         'accept': 'application/json'
    //     });
    //
    //     let url = "http://localhost:8080/rdf4j-server/repositories/QPilot2";
    //
    //     console.log(this.makeDetailQuery("en"));
    //
    //     return this.http
    //         .post(url, this.makeDetailQuery("en") ,  {headers: headers})
    //         .toPromise()
    //         .then(res => {
    //             let values = res.json().results.bindings[0];
    //             console.log(values);
    //             //let qualification = new Qualification();
    //            // if (values.prefLabel) qualification.prefLabel = values.prefLabel.value;
    //
    //             //return qualification;
    //         }
    //         )
    //         .catch(this.handleError);
    //
    //
    // }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private makeDetailQuery(languageCode: String): String {

        // let queryBuild = new QueryBuilder();
        //
        // queryBuild.languageCode = languageCode;
        //
        // queryBuild.addPrefix("esco", "<http://data.europa.eu/esco/model#>");
        // queryBuild.addPrefix("rdf", "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>");
        // queryBuild.addPrefix("skos", "<http://www.w3.org/2004/02/skos/core#>");
        // queryBuild.addPrefix("dcterms", "<http://purl.org/dc/terms/>");
        // queryBuild.addPrefix("foaf", "<http://xmlns.com/foaf/0.1/>");
        // queryBuild.addPrefix("prov", "<http://www.w3.org/ns/prov#>");
        // queryBuild.addPrefix("dcat", "<http://www.w3.org/ns/dcat#>");
        // queryBuild.addPrefix("skosXl", "<http://www.w3.org/2008/05/skos-xl#>");
        //
        // queryBuild.addBind ('?uri', this.detailUri );

        // queryBuild.addTriple("", "?uri", false, "rdf:type", "esco:Qualification", false, "", false);
        // queryBuild.addTriple("OPTIONAL {", "?uri", false, "skos:prefLabel", "?prefLabel", true, "}", true);
        //
        // queryBuild.addTriple("OPTIONAL {", "?uri", false, "skos:definition", "?definitionNode", false, "", false);
        // queryBuild.addTriple("", "?definitionNode", false, "esco:language", "'" + languageCode + "'", false, "", false);
        // queryBuild.addTriple("", "?definitionNode", false, "esco:nodeLiteral", "?definition", true, "}", false);
        //
        // queryBuild.addTriple("", "?uri", false, "esco:referenceLanguage", "?referenceLanguage", true, "", false);
        //
        // queryBuild.addTriple("OPTIONAL {", "?uri", false, "esco:hasAssociation", "?eqfConcept", false, "", false);
        // queryBuild.addTriple("", "?eqfConcept", false, "esco:targetFramework", "<http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme>", false, "", false);
        // queryBuild.addTriple("", "?eqfConcept", false, "esco:targetNotation", "?eqfLevelNotation", true, "}", false);

        //return queryBuild.buildSelect();
return "";
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

