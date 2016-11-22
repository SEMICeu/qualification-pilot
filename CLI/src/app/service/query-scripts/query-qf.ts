
import {QueryBuilder, Triple} from "../support/query-builder";
export class QueryQf {

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
    queryBuild.addPrefix("skos", "<http://www.w3.org/2004/02/skos/core#>");
    queryBuild.addPrefix("foaf", "<http://xmlns.com/foaf/0.1/>");

    queryBuild.addTriple( new Triple().subject("<" + qualUri + ">").predicate("esco:hasAssociation").object("?uri"));
    queryBuild.addTriple( new Triple().selectSubject("?uri").predicate("dcterms:type").object("<http://data.europa.eu/esco/association-type#qf-level>"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:description").selectObject("?description").after("}").langGroupConcat() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:issued").selectObject("?issued").after("}"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetFramework").selectObject("?targetFramework").after("}"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetFrameworkVersion").selectObject("?targetFrameworkVersion").after("}"));
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:target").selectObject("?target") );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?target").predicate("skos:prefLabel").selectObject("?targetLabel").after("}}").langGroupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetDescription").selectObject("?targetDescription").after("}").langGroupConcat() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetNotation").selectObject("?targetNotation").after("}").groupConcat() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetName").selectObject("?targetName").after("}").langGroupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("esco:targetUrl").selectObject("?targetUrl").after("}"));

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("foaf:homepage").selectObject("?homepage").after("}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:publisher").object("?publisherUri"));
    queryBuild.addTriple( new Triple().subject("?publisherUri").predicate("foaf:name").selectObject("?publisherName").langGroupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:mbox").selectObject("?publisherMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?publisherUri").predicate("foaf:homepage").selectObject("?publisherPage").after("}}").groupConcat());

    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("<http://data.europa.eu/esco/qdr#generatedByTrustedSource>").selectObject("?trusted").after("}"));

    return queryBuild.buildSelect();
  }
}
