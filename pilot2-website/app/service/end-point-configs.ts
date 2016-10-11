import {Headers} from "@angular/http";

export const endPointHeaders = new Headers({
    'content-type': 'application/sparql-query',
    'accept': 'application/json'
});

export const endPointUrl = "http://localhost:8080/rdf4j-server/repositories/QPilot2";