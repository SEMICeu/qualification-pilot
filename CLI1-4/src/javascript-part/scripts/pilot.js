

serverUrl = ENDPOINT_URL + "?output=json&Accept=";

var pilotInnerYasqe = YASQE();
var queryPrefixes =
  "PREFIX esco: <http://data.europa.eu/esco/model#> " +
  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
  "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
  "PREFIX dcterms: <http://purl.org/dc/terms/> " +
  "PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
  "PREFIX prov: <http://www.w3.org/ns/prov#>" +
  "PREFIX dcat: <http://www.w3.org/ns/dcat#>" +
  "PREFIX skosXl: <http://www.w3.org/2008/05/skos-xl#>";

var language = "en";
var detailUri;
var lastHash;

$(function () {
  lastHash = document.location.hash.substr(1);
  $("#qp-language-selector").change(updateLanguage);
  window.onhashchange = function () {
    if (lastHash == document.location.hash.substr(1)) return;
    window.scrollTo(0, 0);
    updateScreen();
  };
  $("#searchForm").submit(searchFormSubmit);

  $(window).on("popstate", function (e) {
    if (e.originalEvent.state == null) updateScreen();

  });

  var foetFacetContainerHtml = "";

  foetFacetContainerHtml += "<select id='foet-facet-select'>";
  foetFacetContainerHtml += "<option selected >Select Field of Education and Training</option>";
  for (var foet in cvUsesLang.foet) {
    if (!cvUsesLang.foet.hasOwnProperty(foet)) continue;
    $('#FoETlevel').append($('<option qp-lang-property=\"data_foet_' + foet + '\" qp-lang-field=\"html\" value=\"' + foet + '\">' + cvUsesLang.foet[foet][language] + '</option>', {value: foet, text: cvUsesLang.foet[foet][language]}));

    foetFacetContainerHtml += '<option qp-lang-property=\"data_foet_' + foet + '\" qp-lang-field=\"html\" value=\"' + foet + '\">' + cvUsesLang.foet[foet][language] + '</option>'
  }
  foetFacetContainerHtml += "</select>";
  $("#foetFacetContainer").html(foetFacetContainerHtml);

  var countryFacetContainerHtml = "";

  for (var country in cvUsesLang.country) {
    if (!cvUsesLang.country.hasOwnProperty(country)) continue;
    $('#country').append($('<option qp-lang-property=\"data_coun_' + country + '\" qp-lang-field=\"html\" value=\"' + country + '\">' + cvUsesLang.country[country][language] + '</option>', {value: country, text: cvUsesLang.country[country][language]}));
    $('#relatedCountry').append($('<option qp-lang-property=\"data_coun_' + country + '\" qp-lang-field=\"html\" value=\"' + country + '\">' + cvUsesLang.country[country][language] + '</option>', {value: country, text: cvUsesLang.country[country][language]}));
    countryFacetContainerHtml += "<a><label><input type=\"checkbox\" country-facet=\"" + country + "\"> <span qp-lang-property=\"data_coun_" + country + "\" qp-lang-field=\"html\">" + cvUsesLang.country[country][language] + "</label></a>";
  }
  $("#countryFacetContainer").html(countryFacetContainerHtml);
  $("#findRelatedButton").click(findRelatedQualifications);

  $("[eqf-facet],[country-facet]").click(facetChange);
  $("#foet-facet-select").change(facetChange);
  updateScreen();
});

function updateHash(newHash) {
  lastHash = newHash;
  window.location.hash = newHash;
}
function facetChange() {
  var eqfUris = [];
  var foetUris = [];
  var countryUris = [];
  $("[eqf-facet]:checked").each(function () {
    eqfUris.push($(this).attr("eqf-facet"));
  });
  var selected = $("#foet-facet-select option:selected");
  if (selected.val() != "Select Field of Education and Training") {
    eqfUris.push(selected.val());
  }
  $("[country-facet]:checked").each(function () {
    countryUris.push($(this).attr("country-facet"));
  });

  var shouldShowOneCheck = function (facetUris, toCheck) {
    if (toCheck.length == 0) return true;
    for (var i = 0; i < toCheck.length; i++) if (facetUris.indexOf("[" + toCheck[i] + "]") > -1) return true;
    return false;
  };

  $("[for-facet-filter]").each(function () {
    var facetUris = $(this).attr("for-facet-filter");
    var ok = (shouldShowOneCheck(facetUris, eqfUris) && shouldShowOneCheck(facetUris, foetUris) && shouldShowOneCheck(facetUris, countryUris));
    if (ok) $(this).show();
    else $(this).hide();
  });
}


function findRelatedQualifications() {
  var eqf;
  var foet;
  if ($("#relatedEQF").is(':checked')) {
    eqf = detailHasEqf ? "YES" : "NO";
    foet = true;
  }
  else {
    eqf = "0";
    foet = $("#relatedFoET").is(':checked');
  }


  //var foet = $("#relatedFoET").is(':checked');
  if (eqf == "0" && !foet) {
    alert("Please check one of the fields");
    return;
  }
  var countryUri = $("#relatedCountry").val();
  executeFindRelatedQualifications(eqf, foet, countryUri);
}

function executeFindRelatedQualifications(eqf, foet, countryUri) {
  $("#overlay").show();

  //console.log("RELATED: [" + eqf + "]");
  //var types = [];
  //if (eqf) types.push("EQF");
  //if (foet) types.push("FoET");
  //if (countryUri) types.push("Country");
  //$("#relationType").html(buildTypes(types));

//  "  filter (lang(?prefLabel) = str(?referenceLanguage)) ";
  var query = "select distinct ?qualification ?prefLabel ?homepage ?eqfConcept ?eqf ?foetConcept ?foet ?countryUri ?ownerName ?referenceLanguage where {  " +
    "  ?qualification rdf:type esco:Qualification ." +
    "  ?qualification skos:prefLabel ?prefLabel ." +
    "  ?qualification esco:referenceLanguage ?referenceLanguage ." +
    //"  filter (lang(?prefLabel) = str(?referenceLanguage)) " +
    "  optional { ?qualification esco:hasAssociation ?eqfAssoc . " +
    "             ?eqfAssoc esco:targetFramework <http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme> ." +
    "             ?eqfAssoc esco:target ?eqfConcept ." +
    "             ?eqfAssoc <http://data.europa.eu/esco/qdr#generatedByTrustedSource> ?trusted ." +
    "             ?eqfConcept skos:prefLabel ?eqf }" +
    "  optional {  ?qualification esco:hasISCED-FCode ?foetConcept. ?foetConcept skos:prefLabel ?foet }" +
    "  optional {  ?qualification esco:owner ?owner . ?owner foaf:name ?ownerName }" +
    "  optional { " +
    "?qualification esco:hasAwardingActivity ?awardingActivity . " +
    "?awardingActivity prov:atLocation ?countryUri" +
    "}" +
    "  optional { ?qualification foaf:homepage ?homepage . }" +
    "  filter (?qualification != <" + detailUri + "> )";

  if (eqf == "YES") { query +=
    "  filter exists { <" + detailUri + "> esco:hasAssociation ?eqfAssocFilter .  ?eqfAssocFilter esco:target ?eqfFilter ." +
    "    ?eqfAssoc esco:target ?eqfFilter . }";
  }
  // else if (eqf == "NO") query +=
  //   "  filter not exists { ?qualification qms:hasEQFLevel ?eqfFilter . }";
  if (foet) {
    query +=
      " filter exists { <" + detailUri + "> esco:hasISCED-FCode ?foetFilter ." +
      "    ?qualification esco:hasISCED ?foetFilter .}";
  }
  // if (countryUri) query += " filter exists { ?qualification dcterms:spatial <" + countryUri + "> .}";
  query += "}";

  var errorQuery = function () {
    alert("Query failed");
    $("#overlay").hide();
  };
  successSearchQueryHash = "lang=" + language + "&relatedUri=" + detailUri + "&countryUri=" + countryUri;
  if (eqf) {
    if (detailHasEqf)successSearchQueryHash += "&eqf=YES";
    else successSearchQueryHash += "&eqf=NO";
  }
  else {
    successSearchQueryHash += "&eqf=0";
  }
  if (foet)successSearchQueryHash += "&foet=1";
  executeQuery(query, successSearchQuery, errorQuery);
}
var successSearchQueryHash;
var toShowTitle = "pageTitle-search";
function showScreen(toShow) {
  $("#titleDiv").show();
  $("#searchScreen").hide();
  $("#searchResultScreen").hide();
  $("#detailScreen").hide();
  $("#" + toShow).show();

  if (toShow == "searchScreen") toShowTitle = "pageTitle-search";
  else if (toShow == "searchResultScreen") toShowTitle = "searchResult";
  else toShowTitle = null;
  if (toShowTitle) $("#pageTitle").html(qp_translations[toShowTitle][language]);
  window.scrollTo(0, 0);
}
function searchFormSubmit() {
  var searchText = $("#search").val().trim().toLowerCase();
  var foet = $("#FoETlevel").val();
  var eqf = $("#EQFlevel").val();
  var country = $("#country").val();

  var query = "select distinct ?referenceLanguage ?qualification ?prefLabel ?eqfConcept ?eqf ?foetConcept ?homepage ?countryUri ?creatorwhere{  " +
    "  ?qualification rdf:type esco:Qualification ." +
    "  ?qualification skos:prefLabel ?prefLabel ." +
    "  ?qualification esco:referenceLanguage ?referenceLanguage . " +

    "  optional { ?qualification foaf:homepage ?homepage . }" +
    "  optional { " +
    "?qualification esco:hasAwardingActivity ?awardingActivity . " +
    "?awardingActivity prov:atLocation ?countryUri" +
    "}" +
    "  optional { ?qualification dcterms:creator ?creator . ?creator foaf:name ?ownerName}" +
    "  optional { ?qualification esco:hasAssociation ?eqfAssoc . " +
    "             ?eqfAssoc esco:targetFramework <http://data.europa.eu/esco/ConceptScheme/EQF2012/ConceptScheme> ." +
    "             ?eqfAssoc esco:target ?eqfConcept ." +
    "             ?eqfAssoc <http://data.europa.eu/esco/qdr#generatedByTrustedSource> ?trusted ." +
    "             ?eqfConcept skos:prefLabel ?eqf }" +
    "  optional { ?qualification esco:hasISCED-FCode ?foetConcept}";

  if (searchText) query += "  filter exists{ ?qualification ?textProperty ?textValue filter(isLiteral(?textValue) && contains(lcase(?textValue), '" + searchText + "')) } .";
  query += addFilter(eqf, "esco:target");
  query += addFilter(foet, "esco:hasISCED-FCode");
  query += addFilter(country, "prov:atLocation");
  query += "}";

  var errorQuery = function () {
    alert("Query failed");
    $("#overlay").hide();
  };

  $("#overlay").show();
  successSearchQueryHash = "lang=" + language + "&search=" + encodeURIComponent($("#search").val().trim()) + "&eqf=" + $("#EQFlevel").val() + "&foet=" + $("#FoETlevel").val() + "&country=" + $("#country").val();
  executeQuery(query, successSearchQuery, errorQuery);
  //updateScreen();
  return false;
}

function addFilter(selection, property) {

  if (!selection || selection.length == 0) return "";
  if (property=="esco:hasISCED-FCode") {
    return "filter exists { ?qualification " + property + " <" + selection + "> } ";
  }
  if (property=="esco:target") {
    if (selection == "EQFno") {
      return "filter ( !bound(?eqfConcept)) ";
    }
    else {
      return "filter ( bound(?eqfConcept) ) filter exists { ?eqfAssoc " + property + " <" + selection + "> } ";
    }
}
  if (property=="prov:atLocation") {
    return "filter exists { ?awardingActivity " + property + " <" + selection + "> } ";
  }
}

var searchResultData;
function successSearchQuery(data) {
  $("#overlay").hide();
  $("[eqf-facet],[foet-facet],[country-facet]").prop("checked", false);
  var rows = data.results.bindings;
  //var resultField = $("#result");
  if (rows.length == 0) {
    alert("No results found");
    return;
  }

  searchResultData = groupSelectResult(rows, "qualification");
  fillSearchResultField(searchResultData);

  updateHash(successSearchQueryHash);

  showScreen("searchResultScreen");

}

function fillSearchResultField(grouped) {
  //console.log(grouped);
  var result = "";
  for (var rowUri in grouped) {
    if (!grouped.hasOwnProperty(rowUri)) continue;
    var row = grouped[rowUri];

    result += "<div for-facet-filter=\"";
    if (row.eqfConcept && row.eqfConcept.length > 0) for (var i = 0; i < row.eqfConcept.length; i++) result += "[" + row.eqfConcept[i] + "]";
    else result += "[EQFno]";
    if (row.foetConcept) for (i = 0; i < row.foetConcept.length; i++) result += "[" + row.foetConcept[i] + "]";
    if (row.countryUri) for (i = 0; i < row.countryUri.length; i++) result += "[" + row.countryUri[i] + "]";
    result += "\">";
    result += "<h5 qp-lang-property=\"title\" qp-lang-field=\"html\">" + qp_translations["title"][language] + "</h5><h2>" + addCellLanguage(row, "prefLabel", false, "") + "</h2><hr/>";
    result += "<h6><span style=\"background: none;color:#284F75;padding:0;\" qp-lang-property=\"EQFlevel\" qp-lang-field=\"html\">"+qp_translations["EQFlevel"][language] +"</span>:</h6>";
    result += "<div class=\"" + getFlag(row) + "\"></div>";

    result += "<p>";
    if (!row.eqfConcept || row.eqfConcept.length == 0) {

      var noEqfLabel = "level0";
      if (row.hasOwnProperty("prefLabel") && row["prefLabel"][0].startsWith("Microsoft")) noEqfLabel = "level0-non-applicable";//demo purposes only
      result += "<span style=\"background: none;color:black;padding:0;\" qp-lang-property=\"" + noEqfLabel + "\" qp-lang-field=\"html\">" + qp_translations[noEqfLabel][language] + "</span>";
    }
    else {
      result += "<span style=\"background: none;color:black;padding:0;\"  qp-lang-property=\"level" + row.eqfConcept[0].slice(-1) + "\" qp-lang-field=\"html\">" + qp_translations["level" + row.eqfConcept[0].slice(-1)][language] + "</span>";
      for (var i = 1; i < row.eqfConcept.length; i++) {
        result += "<br/><span style=\"background: none;color:black;padding:0;\"  qp-lang-property=\"level" + row.eqfConcept[i].slice(-1) + "\" qp-lang-field=\"html\">" + qp_translations["level" + row.eqfConcept[i].slice(-1)][language] + "</span>";
      }
    }
    result += "</p>";

    if (row.trusted) {
      result += "trusted";
    }

    result += "<h6>ISCED FoET 2013:</h6>";
    result += "<p>";
    if (!row.foetConcept || row.foetConcept.length == 0) {
      result += "<span style=\"background: none;color:black;padding:0;\" qp-lang-property=\"noFoETset\" qp-lang-field=\"html\">" + qp_translations["noFoETset"][language] + "</span>";
    }
    else {
      result += "<span style=\"background: none;color:black;padding:0;\"  qp-lang-property=\"data_foet_" + row.foetConcept[0] + "\" qp-lang-field=\"html\">" + cvUsesLang.foet[row.foetConcept[0]][language] + "</span>";
      for (var i = 1; i < row.foetConcept.length; i++) {
        result += "<br/><span style=\"background: none;color:black;padding:0;\"  qp-lang-property=\"data_foet_" + row.foetConcept[i] + "\" qp-lang-field=\"html\">" + cvUsesLang.foet[row.foetConcept[i]][language] + "</span>";
      }
    }
    result += "</p>";


    var detailsLabel = qp_translations["details"][language];
    result += "<input type=\"submit\" value=\"" + detailsLabel + "\"  qp-lang-property=\"details\" qp-lang-field=\"@value\" onclick=\"loadDetail('" + rowUri + "');\">";
    result += "<br/><br/><br/><br/>";
    result += "</div>";

  }

  $("#searchResultContainer").html(result);
}

function getFlag(row) {
  var ownerName = row.ownerName;
  if (ownerName && ownerName.length > 0 && ownerName[0] == "Microsoft") return "logo-ms";
  var country = row.countryUri;
  if (country && country.length > 0) {
    if (country[0] == "http://data.europa.eu/esco/country/ES") return "flag-es";
    if (country[0] == "http://data.europa.eu/esco/country/SE") return "flag-sv";
    if (country[0] == "http://data.europa.eu/esco/country/BE") return "flag-be";
    if (country[0] == "http://data.europa.eu/esco/country/GR") return "flag-gr";
  }
  return "flag_none";
}

function addCellLanguage(row, fieldName, isLink, defaultText) {
  var lines = getLanguageRows(row, fieldName);
  return addCell(lines, isLink, defaultText);
}

function addCell(lines, isLink, defaultText) {
  return addFormattedCell(lines, defaultText, isLink ? linkize : myself);
}

function addFormattedCell(lines, defaultText, formatter) {
  if (!lines || lines.length == 0) return defaultText;
  var result = formatter(lines[0]);
  for (var i = 1; i < lines.length; i++) {
    result += "<br/>" + formatter(lines[i]);
  }
  return result;
}

function dateFormat(value) {
  var date = new Date(value);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var result = date.getFullYear() + "-";
  if(month < 10) result += "0";
  result += month + "-";
  if(day < 10) result += "0";
  result += day;
  return result;
}
function decimalToInt(value) {
  var index = value.indexOf(".");
  if(index == -1) return value;
  return value.substring(0, index);
}
function booleanToImg(value) {
  if(value == "true") {
    return "<img style=\"top: 5px;position: relative;\" src=\"images/icon-v.png\"/>";
  }
  else if(value == "false") {
    return "<img style=\"top: 5px;position: relative;\"  src=\"images/icon-x.png\"/>";
  }
  else if(value) {
    return "[" +value + "]";
  }
  return "";
}
function myself(value) {
  return value;
}

function linkize(value) {
  var innerText = value;
  var targetPart = " target=\"_blank\"";
  if(innerText.indexOf("mailto:") == 0) {
    innerText = innerText.substr(7);
    targetPart = "";
  }

  return "<a" +targetPart +" href=\"" + value + "\">" + innerText + "</a>";
}
function loadDetail(uri) {


  detailUri = uri;

  $("#detailContainer").html("");
  showScreen("detailScreen");

  $("#titleDiv").hide();

  updateHash("lang=" + language + "&detailUri=" + detailUri);
  // window.location.pathname = "detail/0";

}
var detailHasEqf;

function getLanguageRows(row, fieldName) {
  var referenceLanguage = (row.hasOwnProperty("referenceLanguage") && row["referenceLanguage"].length > 0) ? row["referenceLanguage"][0] : "en";

  if (row.hasOwnProperty(fieldName + "-" + language) && row[fieldName + "-" + language].length > 0) return row[fieldName + "-" + language];
  else if (row.hasOwnProperty(fieldName + "-" + referenceLanguage) && row[fieldName + "-" + referenceLanguage].length > 0) return row[fieldName + "-" + referenceLanguage];
  else if (row.hasOwnProperty(fieldName + "-en") && row[fieldName + "-en"].length > 0) return row[fieldName + "-en"];
  else if (row.hasOwnProperty(fieldName) && row[fieldName].length > 0) return row[fieldName];
  return null;
}

function updateLanguage() {
  language = $("#qp-language-selector").val();
  if (toShowTitle) $("#pageTitle").html(qp_translations[toShowTitle][language]);
  $("#navigationSelf").attr("href", "index.html#lang=" + language);
  if (searchResultData) fillSearchResultField(searchResultData);
  $("[qp-lang-property]").each(updateLanguageForThis);

  var values = parseUrl();
  var newHash = "lang=" + language;
  for (var key in values) {
    if (!values.hasOwnProperty(key) || key == "lang") continue;
    newHash += "&" + key + "=" + (key == "search" ? encodeURIComponent(values[key]) : values[key]);
  }
  updateHash(newHash);
}
function updateLanguageForThis() {
  var languageProperty = $(this).attr("qp-lang-property");

  var qpTranslation;
  if (languageProperty.substr(0, 10) == 'data_foet_') {
    qpTranslation = cvUsesLang.foet[languageProperty.substr(10)];
  }
  else if (languageProperty.substr(0, 10) == 'data_coun_') {
    qpTranslation = cvUsesLang.country[languageProperty.substr(10)];
  }
  else {
    qpTranslation = qp_translations[languageProperty];
  }
  if (qpTranslation == undefined) {
    console.log("qp-lang-property missing: " + languageProperty);
    return;
  }
  var translation = qpTranslation[language];
  var field = $(this).attr("qp-lang-field");
  if (field.substring(0, 1) == "@") $(this).attr(field.substring(1), translation);
  else $(this).html(translation);
}

function updateScreen() {
  var values = parseUrl();
  //console.log(values);
  setLanguage(values);

  if (values.hasOwnProperty("search")) {

    $("#search").val(decodeURIComponent(values["search"]).trim());
    $("#FoETlevel").val(values["foet"].trim());
    $("#EQFlevel").val(values["eqf"].trim());
    $("#country").val(values["country"].trim());

    searchFormSubmit();
  }
  else if (values.hasOwnProperty("detailUri")) {
    loadDetail(values["detailUri"].trim());
  }
  else if (values.hasOwnProperty("relatedUri")) {
    detailUri = values["relatedUri"].trim();
    executeFindRelatedQualifications(values["eqf"].trim(), values.hasOwnProperty("foet"), values["countryUri"].trim());
  }
  else {
    $("#search").val("");
    $("#FoETlevel").val("");
    $("#EQFlevel").val("");
    $("#country").val("");
    showScreen("searchScreen");
  }
}

function setLanguage(values) {
  var newLanguage = values["lang"];
  if (!newLanguage) return;
  var languageSelectorField = $("#qp-language-selector");
  var exists = languageSelectorField.find('option').filter(function () {
    return $(this).val() == newLanguage;
  }).length;
  if (!exists) return;
  language = newLanguage;
  languageSelectorField.val(newLanguage);
  updateLanguage();
}
function parseUrl() {
  var value = {};
  var valueArray = window.location.hash.substr(1).split("&");
  for (var i = 0; i < valueArray.length; i++) {
    var result = valueArray[i].split("=");
    var resultValue = "";
    for (var j = 1; j < result.length; j++) {
      if (j > 1) resultValue += "=";
      resultValue += result[j];
    }
    value[result[0]] = resultValue;
  }
  return value;
}
function groupSelectResult(rows, groupBy) {
  var grouped = {};
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var groupByValue = row[groupBy].value;
    if (!grouped.hasOwnProperty(groupByValue)) grouped[groupByValue] = {};
    var uriGroup = grouped[groupByValue];

    for (var key in row) {
      if (!row.hasOwnProperty(key) || (key == groupBy)) continue;
      if (!uriGroup.hasOwnProperty(key)) uriGroup[key] = [];
      if (row[key] && (-1 == $.inArray(row[key].value, uriGroup[key]))) uriGroup[key].push(row[key].value);
    }
    for (var key in row) {
      if (!row.hasOwnProperty(key) || (key == groupBy)) continue;
      if (row[key].hasOwnProperty("xml:lang")) {
        var lang = row[key]["xml:lang"];
        if (lang.length > 0) {
          if (!uriGroup.hasOwnProperty(key + "-" + lang)) uriGroup[key + "-" + lang] = [];
          if (row[key] && (-1 == $.inArray(row[key].value, uriGroup[key + "-" + lang]))) uriGroup[key + "-" + lang].push(row[key].value);
        }
      }
    }
  }
  return grouped;
}
function executeQuery(query, successMethod, errorMethod) {
  var fullQuery = queryPrefixes + query;
  var options = {
    method: "POST",
    dataType: "json",
    crossDomain: true,
    url: serverUrl + getAcceptType(fullQuery),
    data: {"query": fullQuery},
    success: successMethod
  };
  if (errorMethod) options.error = errorMethod;
  $.ajax(options);
}
function getAcceptType(query) {
  pilotInnerYasqe.setValue(query);
  var type = pilotInnerYasqe.getQueryType();
  if (!type) return null;
  if (type == "ASK") return "application%2Fxml";
  if (type == "SELECT") return "application%2Fjson";
  return "application%2Frdf%2Bjson";
}
