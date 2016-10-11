

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Qualification} from "../model/qualification";
import {QueryBuilder, Triple} from "./query-builder";
import {Skill} from "../model/skill";
import {endPointUrl, endPointHeaders} from "./end-point-configs";
import {SkillService} from "./skill.service";

@Injectable()
export class QualificationService {

    constructor(private http: Http, private skillService: SkillService) { };

    url = endPointUrl;
    headers =  endPointHeaders;
    prefLang:String = "en";

    detailedQualification: Qualification;

    getQualificationDetailed(uri: String, prefLang:String): Promise<Qualification> {
        this.prefLang = prefLang;
        let promisedQualification = this.queryQualificationDetailed(uri, prefLang);
        promisedQualification.then(qualification => this.detailedQualification = qualification);

        return promisedQualification;
    }
    hasExistingDetailedQualification(): boolean {
        return this.detailedQualification != null;
    }

    hasSameState(uri: String, lang:String): boolean {
        return (this.detailedQualification && this.detailedQualification.uri == uri && this.prefLang == lang);
    }

    getExistingQualificationDetailed(): Qualification {
        if (this.detailedQualification) {
            return this.detailedQualification;
        }
        else {
            console.error("No qualification set, no uri given");
        }
    }


    queryQualificationDetailed(uri: String, prefLang:String): Promise<Qualification> {

        console.log(this.makeDetailQuery("<" + uri + ">", prefLang));

        return this.http
            .post(this.url, this.makeDetailQuery("<" + uri + ">", "en") ,  {headers: this.headers})
            .toPromise()
            .then(res => {
                    let values = res.json().results.bindings[0];
                    console.log(res.json().results);
                    let qualification = new Qualification(uri);

                    if (values.referenceLanguage_group) {
                        qualification.referenceLanguage = this.makeArrayFromConcat(values.referenceLanguage_group.value);
                    }
                    if (values.prefLabel_lang_group) {
                        qualification.prefLabels = this.makeMapFromLangConcat(values.prefLabel_lang_group.value);
                    }
                    if (values.altLabel_lang_group) {
                        qualification.altLabels = this.makeMapFromLangConcat(values.altLabel_lang_group.value);
                    }
                    if (values.definition_lang_group) {
                        qualification.definitions = this.makeMapFromLangConcat(values.definition_lang_group.value)
                    }
                    if (values.description_lang_group) {
                        qualification.descriptions = this.makeMapFromLangConcat(values.description_lang_group.value)
                    }
                    if (values.iSCED_Fcode_group) {
                        qualification.iSCED_Fcode = this.makeArrayFromConcat(values.iSCED_Fcode_group.value);
                    }

                    if (values.eqfAssociationUri) qualification.eqfAssociationUri = values.eqfAssociationUri.value;
                    if (values.eqfTarget) qualification.eqfTarget = values.eqfTarget.value;
                    if (values.nqfAssociationUri_group) {
                        qualification.nqfAssociationUris = this.makeArrayFromConcat(values.nqfAssociationUri_group.value);
                    }
                    if (values.eCTSCredits) qualification.eCTSCredits = values.eCTSCredits.value;
                    if (values.volumeOfLearning) qualification.volumeOfLearning = values.volumeOfLearning.value;
                    if (values.isPartialQualification) qualification.isPartialQualification = values.isPartialQualification.value;
                    if (values.waysToAcquire_group) qualification.waysToAcquire = this.makeArrayFromConcat(values.waysToAcquire_group.value);
                    if (values.entryRequirement_group) {
                        qualification.entryRequirements = this.makeStringTupleArrayFromConcat(values.entryRequirement_group.value)
                    }
                    if (values.expiryPeriod) qualification.expiryPeriod = values.expiryPeriod.value;
                    if (values.skillUri_group)  {
                        qualification.loSkillUris = this.makeArrayFromConcat(values.skillUri_group.value);
                    }
                    if (values.homepage_group) {
                        qualification.homepages = this.makeArrayFromConcat(values.homepage_group.value);
                    }
                    if (values.landingPage_group) {
                        qualification.landingPages = this.makeArrayFromConcat(values.landingPage_group.value);
                    }
                    if (values.supplementaryDoc_group) {
                        qualification.supplementaryDocs = this.makeArrayFromConcat(values.supplementaryDoc_group.value);
                    }
                    if (values.issued)  qualification.issued = values.issued.value;
                    if (values.modified) qualification.modified = values.modified.value;
                    if (values.additionalNote_lang_group) {
                        qualification.additionalNotes = this.makeMapFromLangConcat(values.additionalNote_lang_group.value)
                    }
                    if (values.status) qualification.status = values.status.value;

                    return qualification;
                }
            )
            .catch(this.handleError);
    }

    private makeArrayFromConcat(concat: string): String[] {
        let array = JSON.parse(concat) as String[];
        return array == [""] ? [] : array;
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

    private makeStringTupleArrayFromConcat(concat: string): [String, String][] {
        return JSON.parse(concat) as [String, String][];
    }

    private handleError(error: any): Promise<any> {
        console.error('Query failed,', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private makeDetailQuery(uri: String, prefLang: String): String {

        let queryBuild = new QueryBuilder();


        let languageCodes = prefLang == "en" ? ["'" + prefLang + "'", "?referenceLanguage"] : ["'" + prefLang + "'", "'en'", "?referenceLanguage"] ;

        queryBuild.languageCodes = languageCodes;

        queryBuild.addPrefix("esco", "<http://data.europa.eu/esco/model#>");
        queryBuild.addPrefix("rdf", "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>");
        queryBuild.addPrefix("skos", "<http://www.w3.org/2004/02/skos/core#>");
        queryBuild.addPrefix("dcterms", "<http://purl.org/dc/terms/>");
        queryBuild.addPrefix("foaf", "<http://xmlns.com/foaf/0.1/>");
        queryBuild.addPrefix("prov", "<http://www.w3.org/ns/prov#>");
        queryBuild.addPrefix("dcat", "<http://www.w3.org/ns/dcat#>");
        queryBuild.addPrefix("skosXl", "<http://www.w3.org/2008/05/skos-xl#>");
        queryBuild.addPrefix("iso-thes","<http://purl.org/iso25964/skos-thes#>");

        queryBuild.addBind ('?uri', uri);

        queryBuild.addTriple( new Triple().subject("?uri").predicate("rdf:type").object("esco:Qualification") );

        queryBuild.addTriple( new Triple().subject("?uri").predicate("esco:referenceLanguage").selectObject("?referenceLanguage").groupConcat() );

        queryBuild.addTriple( new Triple().subject("?uri").predicate("skos:prefLabel").selectObject("?prefLabel").langGroupConcat().filterByLang() );
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:altLabel").selectObject("?altLabel").after("}").langGroupConcat().filterByLang() );

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:definition").object("?definitionNode"));
        queryBuild.addTriple( new Triple().subject("?definitionNode").predicate("esco:language").object("?definition_lang") );
        queryBuild.addTriple( new Triple().subject("?definitionNode").predicate("esco:nodeLiteral").object("?definition_value").after("}") );
        queryBuild.addFreeFormVariable( "(CONCAT( '[\"', (GROUP_CONCAT (DISTINCT CONCAT(str(?definition_value),'@',?definition_lang);separator='\",\"')),'\"]') as ?definition_lang_group)");

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:description").object("?descriptionNode"));
        queryBuild.addTriple( new Triple().subject("?descriptionNode").predicate("esco:language").object("?description_lang").filterNodeLiteralByLang() );
        queryBuild.addTriple( new Triple().subject("?descriptionNode").predicate("esco:nodeLiteral").object("?description_value").after("}") );
        queryBuild.addFreeFormVariable( "(CONCAT( '[\"', (GROUP_CONCAT (DISTINCT CONCAT(str(?description_value),'@',?description_lang);separator='\",\"')),'\"]') as ?description_lang_group)");

        queryBuild.addTriple( new Triple().subject("?uri").predicate("esco:hasISCED-FCode").selectObject("?iSCED_Fcode").groupConcat());

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").selectObject("?eqfAssociationUri") );
        queryBuild.addTriple( new Triple().subject("?eqfAssociationUri").predicate("esco:targetFramework").object("<http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme>") );
        queryBuild.addTriple( new Triple().subject("?eqfAssociationUri").predicate("esco:target").selectObject("?eqfTarget").after("}") );

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").selectObject("?nqfAssociationUri").groupConcat());
        queryBuild.addTriple( new Triple().subject("?nqfAssociationUri").predicate("dcterms:type").object("<http://data.europa.eu/esco/association-type#qf-level>"));
        queryBuild.addTriple( new Triple().subject("?nqfAssociationUri").predicate("esco:targetNotation").object("?targetNotation").after("}"));

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasECTSCreditPoints").selectObject("?eCTSCredits").after("}"));

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:volumeOfLearning").selectObject("?volumeOfLearning").after("}"));

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:isPartialQualification").selectObject("?isPartialQualification").after("}"));

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:waysToAcquire").selectObject("?waysToAcquire").after("}").groupConcat() );

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasEntryRequirement").object("?entryRequirement") );
        queryBuild.addTriple( new Triple().subject("?entryRequirement").predicate("dcterms:type").object("?entryReqType"));
        queryBuild.addTriple( new Triple().subject("?entryRequirement").predicate("esco:requirementLevel").object("?entryReqLevel").after("}"));
        queryBuild.addFreeFormVariable( "(CONCAT( '[', (GROUP_CONCAT (DISTINCT CONCAT('[\"',str(?entryReqType),'\",\"',str(?entryReqLevel),'\"]');separator=',')),']') as ?entryRequirement_group)");

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:expiryPeriod").selectObject("?expiryPeriod").after("}") );

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").object("?LOAssocUri") );
        queryBuild.addTriple( new Triple().subject("?LOAssocUri").predicate("esco:targetFramework").object("<http://data.europa.eu/esco/concept-scheme/skills>") );
        queryBuild.addTriple( new Triple().subject("?LOAssocUri").predicate("esco:target").selectObject("?skillUri").groupConcat().after("}") );

        //Missing related occupation

        //TODO recognition

        //TODO awarding activity

        //TODO accreditation

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:homepage").selectObject("?homepage").after("}").groupConcat());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcat:landingPage").selectObject("?landingPage").after("}").groupConcat());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:supplementaryDoc").selectObject("?supplementaryDoc").after("}").groupConcat());
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:issued").selectObject("?issued").after("}"));
        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:modified").selectObject("?modified").after("}"));

        //TODO changeNote

        //TODO historyNote

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:additionalNote").object("?additionalNoteNode") );
        queryBuild.addTriple( new Triple().subject("?additionalNoteNode").predicate("esco:language").object("?additionalNote_lang"));
        queryBuild.addTriple( new Triple().subject("?additionalNoteNode").predicate("esco:nodeLiteral").object("?additionalNote_value").after("}"));
        queryBuild.addFreeFormVariable( "(CONCAT( '[\"', (GROUP_CONCAT (DISTINCT CONCAT(str(?additionalNote_value),'@',?additionalNote_lang);separator='\",\"')),'\"]') as ?additionalNote_lang_group)");

        queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("iso-thes:status").selectObject("?status").after("}"));

        //Missing replaces qualification

        //Missing replaced by qualification

        //TODO owner

        //TODO provenance agent

        //TODO publisher


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