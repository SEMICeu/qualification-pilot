import {QueryBuilder, Triple} from "../support/query-builder";
import {ConcatsParser} from "../support/concats-parser";
export class QueryQualification {

  static makeDetail(uri: string, prefLang: string): string {

    let queryBuild = new QueryBuilder();

    let languageCodes = prefLang == "en" ? ["'" + prefLang + "'", "?referenceLang"] : ["'" + prefLang + "'", "'en'", "?referenceLang"] ;

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

    queryBuild.addTriple( new Triple().subject("?uri").predicate("esco:referenceLanguage").selectObject("?referenceLang").groupConcat() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?referenceLangNode").predicate("esco:language").object("?referenceLang"));
    queryBuild.addTriple( new Triple().subject("?referenceLangNode").predicate("skos:prefLabel").selectObject("?referenceLangLabel").after("}").langGroupConcat().filterByLang() );

    queryBuild.addTriple( new Triple().subject("?uri").predicate("skos:prefLabel").selectObject("?prefLabel").langGroupConcat().filterByLang() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:altLabel").selectObject("?altLabel").after("}").langGroupConcat().filterByLang() );

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:definition").object("?definitionNode"));
    queryBuild.addTriple( new Triple().subject("?definitionNode").predicate("esco:language").object("?definition_lang").filterNodeLiteralByLang() );
    queryBuild.addTriple( new Triple().subject("?definitionNode").predicate("esco:nodeLiteral").object("?definition_value").after("}") );
    queryBuild.addFreeFormVariable( " (GROUP_CONCAT (DISTINCT CONCAT(str(?definition_value),'@',?definition_lang);separator='" + ConcatsParser.defaultDelimiter + "') as ?definition_lang_group)");

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:description").object("?descriptionNode"));
    queryBuild.addTriple( new Triple().subject("?descriptionNode").predicate("esco:language").object("?description_lang").filterNodeLiteralByLang() );
    queryBuild.addTriple( new Triple().subject("?descriptionNode").predicate("esco:nodeLiteral").object("?description_value").after("}") );
    queryBuild.addFreeFormVariable( " (GROUP_CONCAT (DISTINCT CONCAT(str(?description_value),'@',?description_lang);separator='" + ConcatsParser.defaultDelimiter + "') as ?description_lang_group)");

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasISCED-FCode").object("?iSCED_FcodeUri"));
    queryBuild.addTriple( new Triple().subject("?iSCED_FcodeUri").predicate("skos:notation").selectObject("?iSCEDFcode").groupConcat());
    queryBuild.addTriple( new Triple().subject("?iSCED_FcodeUri").predicate("skos:prefLabel").selectObject("?iSCEDFcodeLabel").after("}").langGroupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").selectObject("?qfAssociationUri").groupConcat());
    queryBuild.addTriple( new Triple().subject("?qfAssociationUri").predicate("dcterms:type").object("<http://data.europa.eu/esco/association-type#qf-level>").after("}"));

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasECTSCreditPoints").selectObject("?eCTSCredits").after("}"));

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:volumeOfLearning").selectObject("?volumeOfLearning").after("}"));

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:isPartialQualification").selectObject("?isPartialQualification").after("}"));

    queryBuild.addTriple(new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:waysToAcquire").object("?waysToAcquireUri"));
    queryBuild.addTriple(new Triple().subject("?waysToAcquireUri").predicate("skos:prefLabel").selectObject("?waysToAcquire").after("}").langGroupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasEntryRequirement").object("?entryRequirement") );
    queryBuild.addTriple(new Triple().subject("?entryRequirement").predicate("dcterms:type").object("?entryReqTypeUri"));
    queryBuild.addTriple(new Triple().subject("?entryReqTypeUri").predicate("skos:prefLabel").object("?entryReqType"));
    queryBuild.addTriple(new Triple().subject("?entryRequirement").predicate("esco:requirementLevel").object("?entryReqLevelUri"));
    queryBuild.addTriple(new Triple().subject("?entryReqLevelUri").predicate("skos:prefLabel").object("?entryReqLevel").after("}"));
    queryBuild.addFreeFormVariable( " (GROUP_CONCAT (DISTINCT CONCAT(str(?entryReqType),'" + ConcatsParser.defaultDelimiter + "',str(?entryReqLevel));separator='" + ConcatsParser.defaultDelimiter + "') as ?entryRequirement_group)");

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:expiryPeriod").selectObject("?expiryPeriod").after("}") );

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAssociation").object("?LOAssocUri") );
    queryBuild.addTriple( new Triple().subject("?LOAssocUri").predicate("esco:targetFramework").object("<http://data.europa.eu/esco/concept-scheme/skills>") );
    queryBuild.addTriple( new Triple().subject("?LOAssocUri").predicate("esco:target").selectObject("?skillUri").groupConcat().after("}") );

    //Missing related occupation

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasRecognition").selectObject("?recognitionUri").groupConcat().after("}") );

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAwardingActivity").object("?periodActivity"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?periodActivity").predicate("prov:startedAtTime").selectObject("?awardingStarted").after("}") );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?periodActivity").predicate("prov:endedAtTime").selectObject("?awardingEnded").after("}}") );
    //TODO multiple awardingPeriods?

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAwardingActivity").object("?locationActivity"));
    queryBuild.addTriple( new Triple().subject("?locationActivity").predicate("prov:atLocation").object("?awardingLocationUri") );
    queryBuild.addTriple( new Triple().subject("?awardingLocationUri").predicate("skos:prefLabel").selectObject("?awardingLocation").after("}").langGroupConcat() );


    // queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAwardingActivity").object("?bodyActivity"));
    // queryBuild.addTriple( new Triple().subject("?bodyActivity").predicate("prov:wasAssociatedWith").object("?awardingBodyUri"));
    // queryBuild.addTriple( new Triple().subject("?awardingBodyUri").predicate("foaf:name").selectObject("?awardingBodyName").langGroupConcat() );
    // queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?awardingBodyUri").predicate("foaf:mbox").selectObject("?awardingBodyMail").after("}").groupConcat());
    // queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?awardingBodyUri").predicate("foaf:homepage").selectObject("?awardingBodyPage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAwardingActivity").object("?bodyActivity"));
    queryBuild.addTriple( new Triple().subject("?bodyActivity").predicate("prov:wasAssociatedWith").selectObject("?awardingBodyUri").groupConcat().after("}"));

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:hasAccreditation").selectObject("?accreditationUri").groupConcat().after("}") );

    queryBuild.addTriple(new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:homepage").selectObject("?homepage").groupConcat());
    queryBuild.addTriple(new Triple().before("OPTIONAL {").subject("?homepage").predicate("dcterms:title").selectObject("?homepageTitle").after("}}").langGroupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcat:landingPage").selectObject("?landingPage").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:supplementaryDoc").selectObject("?supplementaryDoc").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:issued").selectObject("?issued").after("}"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:modified").selectObject("?modified").after("}"));

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:changeNote").object("?changeNoteNode") );
    queryBuild.addTriple( new Triple().subject("?changeNoteNode").predicate("esco:language").object("?changeNote_lang"));
    queryBuild.addTriple( new Triple().subject("?changeNoteNode").predicate("esco:nodeLiteral").object("?changeNote_value").after("}"));
    queryBuild.addFreeFormVariable( "(GROUP_CONCAT (DISTINCT CONCAT(str(?changeNote_value),'@',?changeNote_lang);separator='" + ConcatsParser.defaultDelimiter + "') as ?changeNote_lang_group)");

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("skos:historyNote").object("?historyNoteNode") );
    queryBuild.addTriple( new Triple().subject("?historyNoteNode").predicate("esco:language").object("?historyNote_lang"));
    queryBuild.addTriple( new Triple().subject("?historyNoteNode").predicate("esco:nodeLiteral").object("?historyNote_value").after("}"));
    queryBuild.addFreeFormVariable( "(GROUP_CONCAT (DISTINCT CONCAT(str(?historyNote_value),'@',?historyNote_lang);separator='" + ConcatsParser.defaultDelimiter + "') as ?historyNote_lang_group)");

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:additionalNote").object("?additionalNoteNode") );
    queryBuild.addTriple( new Triple().subject("?additionalNoteNode").predicate("esco:language").object("?additionalNote_lang"));
    queryBuild.addTriple( new Triple().subject("?additionalNoteNode").predicate("esco:nodeLiteral").object("?additionalNote_value").after("}"));
    queryBuild.addFreeFormVariable( "(GROUP_CONCAT (DISTINCT CONCAT(str(?additionalNote_value),'@',?additionalNote_lang);separator='" + ConcatsParser.defaultDelimiter + "') as ?additionalNote_lang_group)");

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("iso-thes:status").selectObject("?status").after("}"));

    //Missing replaces qualification

    //Missing replaced by qualification

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:rightsHolder").object("?ownerUri"));
    queryBuild.addTriple( new Triple().subject("?ownerUri").predicate("foaf:name").selectObject("?ownerName").langGroupConcat() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?ownerUri").predicate("foaf:mbox").selectObject("?ownerMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?ownerUri").predicate("foaf:homepage").selectObject("?ownerPage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:creator").object("?provenanceAgentUri"));
    queryBuild.addTriple( new Triple().subject("?provenanceAgentUri").predicate("foaf:name").selectObject("?provenanceName").langGroupConcat() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?ownerUri").predicate("foaf:mbox").selectObject("?provenanceMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?ownerUri").predicate("foaf:homepage").selectObject("?provenancePage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:publisher").object("?publisherUri"));
    queryBuild.addTriple( new Triple().subject("?publisherUri").predicate("foaf:name").selectObject("?publisherName").langGroupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:mbox").selectObject("?publisherMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:homepage").selectObject("?publisherPage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("<http://data.europa.eu/esco/qdr#generatedByTrustedSource>").selectObject("?trusted").after("}"));
    queryBuild.addTriple(new Triple().before("OPTIONAL {").subject("?uri").predicate("<http://data.europa.eu/esco/qdr#sourceDistributionPage>").selectObject("?sourceDistributionPage").after("}"));


    return queryBuild.buildSelect();
  }
}
