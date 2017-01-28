import {Headers} from "@angular/http";

export const endPointHeaders = new Headers({
  'Accept': 'application/json',
  'Content-Type': 'application/sparql-query',
});

declare const ENDPOINT_URL; //fetches global variable from endpointUrl.js
export const endPointUrl = ENDPOINT_URL;
