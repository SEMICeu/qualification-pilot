import {Headers} from "@angular/http";

export const endPointHeaders = new Headers({
    'content-type': 'application/sparql-query',
    'accept': 'application/json'
});

declare const ENDPOINT_URL;
export const endPointUrl = ENDPOINT_URL;
