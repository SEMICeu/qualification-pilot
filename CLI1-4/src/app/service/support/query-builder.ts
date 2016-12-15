import {ConcatsParser} from "./concats-parser";
export class QueryBuilder {

    private query:string;

    private triples: Triple[] = [];

    private _languageCodes: string[] = ["EN"];

    private prefixes: Prefix[] = [];

    private binds: Prefix[] = [];

    private freeFormFilters: string[] = [];

    private freeFromTriples: string[] = [];

    private freeFormVariables: string[] = [];

    private extraGroupBy: string[] = [];

    set languageCodes(value: string[]) {
        this._languageCodes = value;
    }

    addPrefix (prefix: string, uri: string) {
        this.prefixes.push(new Prefix(prefix, uri));
    }

    addBind (varName: string, uri: string) {
        this.binds.push(new Prefix(varName, uri));
    }

    addTriple (triple: Triple) : void {
        this.triples.push(triple)
    }
    addFreeFormFilter(filter:string) {
        this.freeFormFilters.push(filter);
    }
    addFreeFormTriple(triple:string) {
        this.freeFromTriples.push(triple);
    }
    addFreeFormVariable(variable:string) {
        this.freeFormVariables.push(variable);
    }
    addGroupBy(groupBy: string) {
        this.extraGroupBy.push(groupBy);
    }

    buildSelect () : string {
        let prefixesString = "";
        let variablesString = "";
        let triplesString = "";
        let groupBysString = "GROUP BY ";
        let filtersString = "";

        for (let prefix of this.prefixes) {
            prefixesString += "PREFIX " + prefix.prefix + ": " + prefix.uri + "\n";
        }

        for (let bind of this.binds) {
            triplesString += "BIND (" + bind.uri + " as " + bind.prefix + ")\n";
        }

        for (let triple of this.freeFromTriples) {
            triplesString += triple + "\n";
        }

        for (let triple of this.triples) {

            if (triple._selectVar) {
                if (triple._groupConcat) variablesString += this.makeGroupConcat(triple._selectVar, triple._langGroupConcat);
                else {
                    variablesString += triple._selectVar + " ";
                    groupBysString += triple._selectVar + " ";
                }
            }

            if (triple._preString) triplesString += triple._preString + " ";
            triplesString += triple._subject + " " + triple._predicate + " " + triple._object + " . ";
            if (triple._postString) triplesString += " " + triple._postString + " ";
            triplesString += "\n";


            if (triple._filterByLang) {
                filtersString += "FILTER(langMatches(lang(" + triple._selectVar + "),str(" + this._languageCodes[0] + "))";
                for (let i = 1; i < this._languageCodes.length; ++i) {
                    filtersString += " || langMatches(lang(" + triple._selectVar + "),str(" + this._languageCodes[i] + "))";
                }
                filtersString += " || !BOUND(" + triple._selectVar + ")) \n";
            }
            if (triple._filterNodeLiteralByLang) {
                filtersString += "FILTER((str(" + triple._object + ") = str(" + this._languageCodes[0] + "))";
                for (let i = 1; i < this._languageCodes.length; ++i) {
                    filtersString += " || (str(" + triple._object + ") = str(" + this._languageCodes[i] + "))";
                }
                filtersString += " || !BOUND(" + triple._object + ")) \n";
            }
        }

        for (let filter of this.freeFormFilters) {
            filtersString += filter + "\n";
        }
        for (let variable of this.freeFormVariables) {
            variablesString += variable + " ";
        }
        for (let groupBy of this.extraGroupBy) {
            groupBysString += groupBy + " ";
        }

        this.query =
            prefixesString +
            "SELECT DISTINCT " + variablesString + "WHERE { \n" +
            triplesString +
            filtersString +
            "}\n" +
            groupBysString;

        return this.query;
    }

    private makeGroupConcat(varName:string, withLangGroup: boolean): string {
        var result = "(GROUP_CONCAT(DISTINCT " + varName + ";separator='" + ConcatsParser.defaultDelimiter + "') as " + varName + "_group) ";
        if (withLangGroup) {
            result = "(GROUP_CONCAT(DISTINCT CONCAT(STR(" + varName + "),'@',LANG(" + varName + "));separator='" + ConcatsParser.defaultDelimiter + "') as " + varName + "_lang_group) ";
        }
        return result;
    }


}

class Prefix {

    constructor(prefix: string, uri: string) {
        this.prefix = prefix;
        this.uri = uri;
    }

    prefix: string;
    uri: string;
}

export class Triple {

    constructor() {

    }

    before(preString: string): Triple {
        this._preString = preString;
        return this;
    }
    subject (subject: string): Triple {
        this._subject = subject;
        return this;
    }
    selectSubject(subject: string): Triple {
        this._subject = subject;
        this._selectVar = subject;
        return this;
    }
    predicate (predicate: string): Triple {
        this._predicate = predicate;
        return this;
    }
    object (object: string): Triple {
        this._object = object;
        return this;
    }
    selectObject(object: string): Triple {
        this._object = object;
        this._selectVar = object;
        return this;
    }
    after(postString: string): Triple {
        this._postString = postString;
        return this;
    }
    filterByLang (): Triple {
        this._filterByLang = true;
        return this;
    }
    filterNodeLiteralByLang(): Triple {
        this._filterNodeLiteralByLang = true;
        return this;
    }
    groupConcat (): Triple {
        this._groupConcat = true;
        return this;
    }
    langGroupConcat (): Triple {
        this._groupConcat = true;
        this._langGroupConcat = true;
        return this;
    }

    _selectVar: string;

    _preString: string;
    _subject: string;

    _predicate: string;

    _object: string;

    _postString: string;

    _filterByLang= false;
    _filterNodeLiteralByLang = false;

    _groupConcat = false;
    _langGroupConcat = false;
}
