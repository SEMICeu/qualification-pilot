"use strict";
var QueryBuilder = (function () {
    function QueryBuilder() {
        this.triples = [];
        this._languageCodes = ["EN"];
        this.prefixes = [];
        this.binds = [];
        this.freeFormFilters = [];
        this.freeFormVariables = [];
        this.extraGroupBy = [];
    }
    Object.defineProperty(QueryBuilder.prototype, "languageCodes", {
        set: function (value) {
            this._languageCodes = value;
        },
        enumerable: true,
        configurable: true
    });
    QueryBuilder.prototype.addPrefix = function (prefix, uri) {
        this.prefixes.push(new Prefix(prefix, uri));
    };
    QueryBuilder.prototype.addBind = function (varName, uri) {
        this.binds.push(new Prefix(varName, uri));
    };
    QueryBuilder.prototype.addTriple = function (triple) {
        this.triples.push(triple);
    };
    QueryBuilder.prototype.addFreeFormFilter = function (filter) {
        this.freeFormFilters.push(filter);
    };
    QueryBuilder.prototype.addFreeFormVariable = function (variable) {
        this.freeFormVariables.push(variable);
    };
    QueryBuilder.prototype.addGroupBy = function (groupBy) {
        this.extraGroupBy.push(groupBy);
    };
    QueryBuilder.prototype.buildSelect = function () {
        var prefixesString = "";
        var variablesString = "";
        var triplesString = "";
        var groupBysString = "GROUP BY ";
        var filtersString = "";
        for (var _i = 0, _a = this.prefixes; _i < _a.length; _i++) {
            var prefix = _a[_i];
            prefixesString += "PREFIX " + prefix.prefix + ": " + prefix.uri + "\n";
        }
        for (var _b = 0, _c = this.binds; _b < _c.length; _b++) {
            var bind = _c[_b];
            triplesString += "BIND (" + bind.uri + " as " + bind.prefix + ")\n";
        }
        for (var _d = 0, _e = this.triples; _d < _e.length; _d++) {
            var triple = _e[_d];
            if (triple._selectVar) {
                if (triple._groupConcat)
                    variablesString += this.makeGroupConcat(triple._selectVar, triple._langGroupConcat);
                else {
                    variablesString += triple._selectVar + " ";
                    groupBysString += triple._selectVar + " ";
                }
            }
            if (triple._preString)
                triplesString += triple._preString + " ";
            triplesString += triple._subject + " " + triple._predicate + " " + triple._object + " . ";
            if (triple._postString)
                triplesString += " " + triple._postString + " ";
            triplesString += "\n";
            if (triple._filterByLang) {
                filtersString += "FILTER(langMatches(lang(" + triple._selectVar + "),str(" + this._languageCodes[0] + "))";
                for (var i = 1; i < this._languageCodes.length; ++i) {
                    filtersString += " || langMatches(lang(" + triple._selectVar + "),str(" + this._languageCodes[i] + "))";
                }
                filtersString += ") \n";
            }
            if (triple._filterNodeLiteralByLang) {
                filtersString += "FILTER((str(" + triple._object + ") = str(" + this._languageCodes[0] + "))";
                for (var i = 1; i < this._languageCodes.length; ++i) {
                    filtersString += " || (str(" + triple._object + ") = str(" + this._languageCodes[i] + "))";
                }
                filtersString += ") \n";
            }
        }
        for (var _f = 0, _g = this.freeFormFilters; _f < _g.length; _f++) {
            var filter = _g[_f];
            filtersString += filter + "\n";
        }
        for (var _h = 0, _j = this.freeFormVariables; _h < _j.length; _h++) {
            var variable = _j[_h];
            variablesString += variable + " ";
        }
        for (var _k = 0, _l = this.extraGroupBy; _k < _l.length; _k++) {
            var groupBy = _l[_k];
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
    };
    QueryBuilder.prototype.makeGroupConcat = function (varName, withLangGroup) {
        var result = "(CONCAT('[\"',GROUP_CONCAT(DISTINCT " + varName + ";separator='\",\"'),'\"]') as " + varName + "_group) ";
        if (withLangGroup) {
            result = "(CONCAT('[\"',GROUP_CONCAT(DISTINCT CONCAT(STR(" + varName + "), CONCAT('@', LANG(" + varName + ")));separator='\",\"'),'\"]') as " + varName + "_lang_group) ";
        }
        return result;
    };
    return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;
var Prefix = (function () {
    function Prefix(prefix, uri) {
        this.prefix = prefix;
        this.uri = uri;
    }
    return Prefix;
}());
var Triple = (function () {
    function Triple() {
        this._filterByLang = false;
        this._filterNodeLiteralByLang = false;
        this._groupConcat = false;
        this._langGroupConcat = false;
    }
    Triple.prototype.before = function (preString) {
        this._preString = preString;
        return this;
    };
    Triple.prototype.subject = function (subject) {
        this._subject = subject;
        return this;
    };
    Triple.prototype.selectSubject = function (subject) {
        this._subject = subject;
        this._selectVar = subject;
        return this;
    };
    Triple.prototype.predicate = function (predicate) {
        this._predicate = predicate;
        return this;
    };
    Triple.prototype.object = function (object) {
        this._object = object;
        return this;
    };
    Triple.prototype.selectObject = function (object) {
        this._object = object;
        this._selectVar = object;
        return this;
    };
    Triple.prototype.after = function (postString) {
        this._postString = postString;
        return this;
    };
    Triple.prototype.filterByLang = function () {
        this._filterByLang = true;
        return this;
    };
    Triple.prototype.filterNodeLiteralByLang = function () {
        this._filterNodeLiteralByLang = true;
        return this;
    };
    Triple.prototype.groupConcat = function () {
        this._groupConcat = true;
        return this;
    };
    Triple.prototype.langGroupConcat = function () {
        this._groupConcat = true;
        this._langGroupConcat = true;
        return this;
    };
    return Triple;
}());
exports.Triple = Triple;
//# sourceMappingURL=query-builder.js.map