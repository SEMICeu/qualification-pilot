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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require('rxjs/add/operator/toPromise');
var qualification_1 = require("../model/qualification");
var query_builder_1 = require("./query-builder");
var learning_outcome_1 = require("../model/learning-outcome");
var skill_1 = require("../model/skill");
var QualificationService = (function () {
    function QualificationService(http) {
        this.http = http;
        this.url = "http://localhost:8080/rdf4j-server/repositories/QPilot2";
        this.prefLang = "en";
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
    QualificationService.prototype.getQualificationDetailed = function (uri, prefLang) {
        var _this = this;
        this.prefLang = prefLang;
        var promisedQualification = this.queryQualificationDetailed(uri, prefLang);
        promisedQualification.then(function (qualification) { return _this.detailedQualification = qualification; });
        return promisedQualification;
    };
    QualificationService.prototype.hasExistingDetailedQualification = function () {
        return this.detailedQualification != null;
    };
    QualificationService.prototype.hasSameState = function (uri, lang) {
        return (this.detailedQualification && this.detailedQualification.uri == uri && this.prefLang == lang);
    };
    QualificationService.prototype.getExistingQualificationDetailed = function () {
        if (this.detailedQualification) {
            return this.detailedQualification;
        }
        else {
            console.error("No qualification set, no uri given");
        }
    };
    QualificationService.prototype.queryQualificationDetailed = function (uri, prefLang) {
        var _this = this;
        var headers = new http_1.Headers({
            'content-type': 'application/sparql-query',
            'accept': 'application/json'
        });
        console.log(this.makeDetailQuery("<" + uri + ">", prefLang));
        return this.http
            .post(this.url, this.makeDetailQuery("<" + uri + ">", "en"), { headers: headers })
            .toPromise()
            .then(function (res) {
            var values = res.json().results.bindings[0];
            console.log(res.json().results);
            var qualification = new qualification_1.Qualification(uri);
            if (values.referenceLanguage)
                qualification.referenceLanguage = values.referenceLanguage.value;
            if (values.prefLabel_lang_group) {
                qualification.prefLabels = _this.makeMapFromLangConcat(values.prefLabel_lang_group.value);
            }
            if (values.altLabel_lang_group) {
                qualification.altLabels = _this.makeMapFromLangConcat(values.altLabel_lang_group.value);
            }
            if (values.definition_lang_group) {
                qualification.definitions = _this.makeMapFromLangConcat(values.definition_lang_group.value);
            }
            if (values.LOAssocUri_group && values.skillUri_group) {
                var LOUris = _this.makeArrayFromConcat(values.LOAssocUri_group.value);
                var skillUris = _this.makeArrayFromConcat(values.skillUri_group.value);
                var los = [];
                if (LOUris.length == skillUris.length)
                    for (var i = 0; i < LOUris.length; i++) {
                        los.push(new learning_outcome_1.LearningOutcome(LOUris[i], new skill_1.Skill(skillUris[i])));
                    }
                qualification.learningOutcomes = los;
            }
            if (values.description_lang_group) {
                qualification.descriptions = _this.makeMapFromLangConcat(values.description_lang_group.value);
            }
            if (values.iSCED_Fcode_group) {
                qualification.iSCED_Fcode = _this.makeArrayFromConcat(values.iSCED_Fcode_group.value);
            }
            if (values.eqfAssociationUri)
                qualification.eqfAssociationUri = values.eqfAssociationUri.value;
            if (values.eqfTarget)
                qualification.eqfTarget = values.eqfTarget.value;
            if (values.nqfAssociationUri_group) {
                qualification.nqfAssociationUris = _this.makeArrayFromConcat(values.nqfAssociationUri_group.value);
            }
            if (values.eCTSCredits)
                qualification.eCTSCredits = values.eCTSCredits.value;
            if (values.volumeOfLearning)
                qualification.volumeOfLearning = values.volumeOfLearning.value;
            console.log(qualification);
            return qualification;
        })
            .catch(this.handleError);
    };
    QualificationService.prototype.makeArrayFromConcat = function (concat) {
        var array = JSON.parse(concat);
        return array == [""] ? [] : array;
    };
    QualificationService.prototype.makeMapFromLangConcat = function (concat) {
        var array = JSON.parse(concat);
        var map = new Map();
        if (array == [""])
            return map;
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var item = array_1[_i];
            var split = item.split("@");
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
    };
    QualificationService.prototype.handleError = function (error) {
        console.error('Query failed,', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    QualificationService.prototype.makeDetailQuery = function (uri, prefLang) {
        var queryBuild = new query_builder_1.QueryBuilder();
        var languageCodes = prefLang == "en" ? ["'" + prefLang + "'", "?referenceLanguage"] : ["'" + prefLang + "'", "'en'", "?referenceLanguage"];
        queryBuild.languageCodes = languageCodes;
        queryBuild.addPrefix("esco", "<http://data.europa.eu/esco/model#>");
        queryBuild.addPrefix("rdf", "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>");
        queryBuild.addPrefix("skos", "<http://www.w3.org/2004/02/skos/core#>");
        queryBuild.addPrefix("dcterms", "<http://purl.org/dc/terms/>");
        queryBuild.addPrefix("foaf", "<http://xmlns.com/foaf/0.1/>");
        queryBuild.addPrefix("prov", "<http://www.w3.org/ns/prov#>");
        queryBuild.addPrefix("dcat", "<http://www.w3.org/ns/dcat#>");
        queryBuild.addPrefix("skosXl", "<http://www.w3.org/2008/05/skos-xl#>");
        queryBuild.addBind('?uri', uri);
        queryBuild.addTriple(new query_builder_1.Triple().subject("?uri").predicate("rdf:type").object("esco:Qualification"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?uri").predicate("esco:referenceLanguage").selectObject("?referenceLanguage"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?uri").predicate("skos:prefLabel").selectObject("?prefLabel").langGroupConcat().filterByLang());
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("skos:altLabel").selectObject("?altLabel").after("}").langGroupConcat().filterByLang());
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("skos:definition").object("?definitionNode"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?definitionNode").predicate("esco:language").object("?definition_lang"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?definitionNode").predicate("esco:nodeLiteral").object("?definition_value").after("}"));
        queryBuild.addFreeFormVariable("(CONCAT( '[\"', (GROUP_CONCAT (DISTINCT CONCAT(str(?definition_value),'@',?definition_lang);separator='\",\"')),'\"]') as ?definition_lang_group)");
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").selectObject("?LOAssocUri").groupConcat());
        queryBuild.addTriple(new query_builder_1.Triple().subject("?LOAssocUri").predicate("esco:targetFramework").object("<http://data.europa.eu/esco/concept-scheme/skills>"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?LOAssocUri").predicate("esco:target").selectObject("?skillUri").groupConcat().after("}"));
        //queryBuild.addTriple( new Triple().subject("?skillUri").predicate("skosXl:prefLabel").object("?skillPrefLabelNode") );
        //queryBuild.addTriple( new Triple().subject("?skillPrefLabelNode").predicate("skosXl:literalForm").selectObject("?skillPrefLabel").after("}").langGroupConcat().filterByLang() );
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:description").object("?descriptionNode"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?descriptionNode").predicate("esco:language").object("?description_lang").filterNodeLiteralByLang());
        queryBuild.addTriple(new query_builder_1.Triple().subject("?descriptionNode").predicate("esco:nodeLiteral").object("?description_value").after("}"));
        queryBuild.addFreeFormVariable("(CONCAT( '[\"', (GROUP_CONCAT (DISTINCT CONCAT(str(?description_value),'@',?description_lang);separator='\",\"')),'\"]') as ?description_lang_group)");
        queryBuild.addTriple(new query_builder_1.Triple().subject("?uri").predicate("esco:hasISCED-FCode").selectObject("?iSCED_Fcode").groupConcat());
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").selectObject("?eqfAssociationUri"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?eqfAssociationUri").predicate("esco:targetFramework").object("<http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme>"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?eqfAssociationUri").predicate("esco:target").selectObject("?eqfTarget").after("}"));
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").selectObject("?nqfAssociationUri").groupConcat());
        queryBuild.addTriple(new query_builder_1.Triple().subject("?nqfAssociationUri").predicate("dcterms:type").object("<http://data.europa.eu/esco/association-type#qf-level>"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?nqfAssociationUri").predicate("esco:targetNotation").object("?targetNotation").after("}"));
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasECTSCreditPoints").selectObject("?eCTSCredits").after("}"));
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasECTSCreditPoints").selectObject("?ectsCredits").after("}"));
        queryBuild.addTriple(new query_builder_1.Triple().before("{").subject("?uri").predicate("esco:additionalNote").object("?additionalNoteNode"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?additionalNoteNode").predicate("esco:language").object("?additionalNotes_lang"));
        queryBuild.addTriple(new query_builder_1.Triple().subject("?additionalNoteNode").predicate("esco:nodeLiteral").object("?additionalNotes_value").after("}"));
        queryBuild.addFreeFormVariable("(CONCAT( '[\"', (GROUP_CONCAT (DISTINCT CONCAT(str(?additionalNotes_value),'@',?additionalNotes_lang);separator='\",\"')),'\"]') as ?additionalNotes_lang_group)");
        queryBuild.addTriple(new query_builder_1.Triple().before("OPTIONAL {").subject("?uri").predicate("esco:volumeOfLearning").selectObject("?volumeOfLearning").after("}"));
        // queryBuild.addTriple("OPTIONAL {", "?uri", false, "esco:hasAssociation", "?LOAssocUri", true, "", false);
        // queryBuild.addTriple("", "?LOAssocUri", false, "esco:targetFramework", "<http://data.europa.eu/esco/concept-scheme/skills>", false, "}", false);
        //queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:homepage").selectObject("?homepage").after("}").groupConcat());
        //optional {  ?uri foaf:homepage ?homepage }
        return queryBuild.buildSelect();
    };
    QualificationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], QualificationService);
    return QualificationService;
}());
exports.QualificationService = QualificationService;
//# sourceMappingURL=qualification.service.js.map