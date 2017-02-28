import {QueryBuilder, Triple} from "../support/query-builder";
export class QuerySkill {

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
    queryBuild.addPrefix("skosXl", "<http://www.w3.org/2008/05/skos-xl#>");

    queryBuild.addTriple( new Triple().subject("<" + qualUri + ">").predicate("esco:hasAssociation").object("?LOAssocUri"));
    queryBuild.addTriple( new Triple().subject("?LOAssocUri").predicate("esco:targetFramework").object("<http://data.europa.eu/esco/concept-scheme/skills>") );
    queryBuild.addTriple( new Triple().subject("?LOAssocUri").predicate("esco:target").selectObject("?uri"));
    queryBuild.addTriple( new Triple().selectSubject("?uri").predicate("skosXl:prefLabel").object("?prefLabelNode") );
    queryBuild.addTriple( new Triple().subject("?prefLabelNode").predicate("skosXl:literalForm").selectObject("?prefLabel").langGroupConcat().filterByLang());
    queryBuild.addTriple( new Triple().before("OPTIONAL {").subject("?uri").predicate("dcterms:description").selectObject("?description").after("}").langGroupConcat().filterByLang() );

    return queryBuild.buildSelect();
  }
}
