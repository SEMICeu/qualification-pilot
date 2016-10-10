"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require("@angular/http");
require('rxjs/add/operator/toPromise');
var FooService = (function () {
    function FooService(http) {
        this.http = http;
        this.queryPrefixes = "PREFIX esco: <http://data.europa.eu/esco/model#> " +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
            "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
            "PREFIX dcterms: <http://purl.org/dc/terms/> " +
            "PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
            "PREFIX prov: <http://www.w3.org/ns/prov#>" +
            "PREFIX dcat: <http://www.w3.org/ns/dcat#>" +
            "PREFIX skosXl: <http://www.w3.org/2008/05/skos-xl#> ";
        this.detailUri = '<http://data.europa.eu/esco/resource/d3fefee9-4eda-4926-9ada-ea196f7a2263>';
        this.detailQuery = 'select distinct * where {' +
            'bind(<' + this.detailUri + '> as ?uri)' +
            "\n    ?uri rdf:type esco:Qualification .\n    ?uri skos:prefLabel ?prefLabel .\n    optional {\n      ?uri skos:definition ?definitionNode .\n      ?definitionNode esco:nodeLiteral ?definition }\n    ?uri esco:referenceLanguage ?referenceLanguage .\n    optional {\n      ?uri esco:hasAssociation ?eqfConcept .\n      ?eqfConcept esco:targetFramework <http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme> }\n    optional {  ?uri esco:hasISCED-FCode ?foetConcept. }\n    optional {\n      ?uri esco:hasAwardingActivity ?awardingLocationActivity .\n      ?awardingLocationActivity prov:atLocation ?countryUri }\n    optional {\n      ?uri dcterms:description ?descriptionNode .\n      ?descriptionNode esco:nodeLiteral ?description }\n    optional {\n      ?uri esco:additionalNote ?additionalNoteNode .\n      ?additionalNoteNode esco:nodeLiteral ?additionalNotes }\n    optional {  ?uri skos:altLabel ?altLabel }\n    optional {  ?uri foaf:homepage ?homepage }\n    optional {  ?uri esco:supplementaryDoc ?supplementaryDoc }\n    optional {\n      ?uri esco:hasAwardingActivity ?awardingBodyActivity .\n      ?awardingBodyActivity prov:wasAssociatedWith ?abUri .\n    optional { ?abUri foaf:name ?abName }\n    optional {?abUri foaf:mbox ?abEmail }\n    optional {?abUri foaf:homePage ?abHomepage } }\n    optional {  ?uri dcterms:creator ?ownerUri .\n    optional {  ?ownerUri foaf:name ?ownerName  }\n    optional {  ?ownerUri foaf:mbox ?ownerEmail }\n    optional {  ?ownerUri foaf:homepage ?ownerHomepage } }\n    optional {  ?uri dcterms:publisher ?publisherUri .\n    optional {  ?publisherUri foaf:name ?publisherName }\n    optional {  ?publisherUri foaf:mbox ?publisherEmail } }\n    optional {  ?uri esco:hasECTSCreditPoints ?hasECTSCreditPoints . }\n    optional {  ?uri esco:isPartialQualification ?isPartialQualification . }\n    optional {  ?uri esco:waysToAcquire ?waysToAcquire . }\n    optional {  ?uri esco:volumeOfLearning ?volumeOfLearning . }\n    optional {  ?uri dcterms:issued ?issued . }\n    optional {  ?uri dcterms:modified ?modified . }\n    optional {  ?uri dcat:landingPage ?landingPage . }\n    optional {  ?uri esco:hasAssociation ?nqfAssoc .\n      ?nqfAssoc esco:targetName ?nqfValue .\n      ?nqfAssoc dcterms:type <http://data.europa.eu/esco/association-type#qf-level> . }\n    optional { ?uri esco:hasAssociation ?LOAssoc .\n      ?LOAssoc dcterms:type <http://data.europa.eu/esco/association-type#learning-outcome> .\n      ?LOAssoc esco:targetFramework <http://data.europa.eu/esco/concept-scheme/skills> .\n      ?LOAssoc esco:target ?skill .\n      ?skill skosXl:prefLabel ?skillPrefLabel .\n      ?skillPrefLabel skosXl:literalForm ?skillLabel }\n   }";
    }
    ;
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
    FooService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    FooService.prototype.makeDetailQuery = function (languageCode) {
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
    };
    FooService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], FooService);
    return FooService;
}());
exports.FooService = FooService;
//# sourceMappingURL=foo.service.js.map