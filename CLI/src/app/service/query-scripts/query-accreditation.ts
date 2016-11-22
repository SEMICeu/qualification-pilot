
import {QueryBuilder, Triple} from "../support/query-builder";
export class QueryAccreditation {

  static make (qualUri: string, langs:string[]):string {
    let queryBuild = new QueryBuilder();

    var langCodes:string[] = [];
    for (let lang of langs) {
      langCodes.push("'" + lang + "'");
    }

    queryBuild.languageCodes = langCodes;

    queryBuild.addPrefix("esco", "<http://data.europa.eu/esco/model#>");
    queryBuild.addPrefix("rdf", "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>");
    queryBuild.addPrefix("dcterms", "<http://purl.org/dc/terms/>");
    queryBuild.addPrefix("foaf", "<http://xmlns.com/foaf/0.1/>");
    queryBuild.addPrefix("prov", "<http://www.w3.org/ns/prov#>");

    queryBuild.addTriple( new Triple().subject("<" + qualUri + ">").predicate("esco:hasAccreditation").selectObject("?uri"));

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("prov:hadPrimarySource").object("?recognizedBodyUri"));
    queryBuild.addTriple( new Triple().subject("?recognizedBodyUri").predicate("rdf:type").object("esco:awardingBody"));
    queryBuild.addTriple( new Triple().subject("?recognizedBodyUri").predicate("foaf:name").selectObject("?recognizedBodyName").langGroupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?recognizedBodyUri").predicate("foaf:mbox").selectObject("?recognizedBodyMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?recognizedBodyUri").predicate("foaf:homepage").selectObject("?recognizedBodyPage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("prov:wasAttributedTo").object("?recognizingAgentUri"));
    queryBuild.addTriple( new Triple().subject("?recognizingAgentUri").predicate("foaf:name").selectObject("?recognizingAgentName").langGroupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?recognizingAgentUri").predicate("foaf:mbox").selectObject("?recognizingAgentMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?recognizingAgentUri").predicate("foaf:homepage").selectObject("?recognizingAgentPage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:issued").selectObject("?issued").after("}"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:reviewedAtTime").selectObject("?reviewDate").after("}"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("prov:invalidatedAtTime").selectObject("?endDate").after("}"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:homepage").selectObject("?homepage").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:landingpage").selectObject("?landingPage").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:supplementaryDoc").selectObject("?supplementaryDoc").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:subject").selectObject("?subject").after("}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:publisher").object("?publisherUri"));
    queryBuild.addTriple( new Triple().subject("?publisherUri").predicate("foaf:name").selectObject("?publisherName").langGroupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:mbox").selectObject("?publisherMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:homepage").selectObject("?publisherPage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("<http://data.europa.eu/esco/qdr#generatedByTrustedSource>").selectObject("?trusted").after("}"))


    return queryBuild.buildSelect();
  }
}
