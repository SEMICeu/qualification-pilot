
import {QueryBuilder, Triple} from "../support/query-builder";
export class QueryAwardingBody {

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

    queryBuild.addTriple( new Triple().subject("<" + qualUri + ">").predicate("esco:hasAwardingActivity").selectObject("?bodyActivity"));
    queryBuild.addTriple( new Triple().subject("?bodyActivity").predicate("prov:wasAssociatedWith").object("?awardingBodyUri"));
    queryBuild.addTriple( new Triple().subject("?awardingBodyUri").predicate("foaf:name").selectObject("?agentName").langGroupConcat() );
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?awardingBodyUri").predicate("foaf:mbox").selectObject("?agentMail").after("}").groupConcat());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?awardingBodyUri").predicate("foaf:homepage").selectObject("?agentPage").after("}").groupConcat());

    return queryBuild.buildSelect();
  }


}
