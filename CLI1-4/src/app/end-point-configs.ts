import {Headers} from "@angular/http";

export const endPointHeaders = new Headers({
    'content-type': 'application/sparql-query',
    'accept': 'application/json'
});

declare const ENDPOINT_URL; //fetches global variable from endpointUrl.js
export const endPointUrl = ENDPOINT_URL;
