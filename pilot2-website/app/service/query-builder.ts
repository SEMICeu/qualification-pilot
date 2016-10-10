


export class QueryBuilder {

    private query:String;

    private triples: Triple[] = [];

    private _languageCodes: String[] = ["EN"];

    private prefixes: Prefix[] = [];

    private binds: Prefix[] = [];

    private freeFormFilters: String[] = [];

    private freeFormVariables: String[] = [];

    private extraGroupBy: String[] = [];

    set languageCodes(value: String[]) {
        this._languageCodes = value;
    }

    addPrefix (prefix: String, uri: String) {
        this.prefixes.push(new Prefix(prefix, uri));
    }

    addBind (varName: String, uri: String) {
        this.binds.push(new Prefix(varName, uri));
    }

    addTriple (triple: Triple) : void {
        this.triples.push(triple)
    }
    addFreeFormFilter(filter:String) {
        this.freeFormFilters.push(filter);
    }
    addFreeFormVariable(variable:String) {
        this.freeFormVariables.push(variable);
    }
    addGroupBy(groupBy: String) {
        this.extraGroupBy.push(groupBy);
    }

    buildSelect () : String {
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
                filtersString += ") \n";
            }
            if (triple._filterNodeLiteralByLang) {
                filtersString += "FILTER((str(" + triple._object + ") = str(" + this._languageCodes[0] + "))";
                for (let i = 1; i < this._languageCodes.length; ++i) {
                    filtersString += " || (str(" + triple._object + ") = str(" + this._languageCodes[i] + "))";
                }
                filtersString += ") \n";
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

    private makeGroupConcat(varName:String, withLangGroup: boolean): String {
        var result = "(CONCAT('[\"',GROUP_CONCAT(DISTINCT " + varName + ";separator='\",\"'),'\"]') as " + varName + "_group) ";
        if (withLangGroup) {
            result = "(CONCAT('[\"',GROUP_CONCAT(DISTINCT CONCAT(STR(" + varName + "), CONCAT('@', LANG(" + varName + ")));separator='\",\"'),'\"]') as " + varName + "_lang_group) ";
        }
        return result;
    }


}

class Prefix {

    constructor(prefix: String, uri: String) {
        this.prefix = prefix;
        this.uri = uri;
    }

    prefix: String;
    uri: String;
}

export class Triple {

    constructor() {

    }

    before(preString: String): Triple {
        this._preString = preString;
        return this;
    }
    subject (subject: String): Triple {
        this._subject = subject;
        return this;
    }
    selectSubject(subject: String): Triple {
        this._subject = subject;
        this._selectVar = subject;
        return this;
    }
    predicate (predicate: String): Triple {
        this._predicate = predicate;
        return this;
    }
    object (object: String): Triple {
        this._object = object;
        return this;
    }
    selectObject(object: String): Triple {
        this._object = object;
        this._selectVar = object;
        return this;
    }
    after(postString: String): Triple {
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

    _selectVar: String;

    _preString: String;
    _subject: String;

    _predicate: String;

    _object: String;

    _postString: String;

    _filterByLang= false;
    _filterNodeLiteralByLang = false;

    _groupConcat = false;
    _langGroupConcat = false;
}
