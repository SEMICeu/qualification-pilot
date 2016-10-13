

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Qualification} from "../model/qualification";
import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {ConcatsParser} from "./support/concats-parser";
import {QfService} from "./qf.service";
import {QueryTemplates} from "./support/query-templates";
import {Agent} from "../model/agent";

@Injectable()
export class QualificationService {

    constructor(private http: Http, private qfService: QfService) { };

    url = endPointUrl;
    headers =  endPointHeaders;
    prefLang:String = "en";

    detailedQualification: Qualification;

    getQualificationDetailed(uri: String, prefLang:String): Promise<Qualification> {
        this.prefLang = prefLang;
        let promisedQualification = this.queryQualificationDetailed(uri, prefLang);
        promisedQualification.then(qualification => this.detailedQualification = qualification);

        return promisedQualification;
    }
    hasNewState(uri: String, lang:String): boolean {
        return (!this.detailedQualification || this.detailedQualification.uri != uri || this.prefLang != lang);
    }

    queryQualificationDetailed(uri: String, prefLang:String): Promise<Qualification> {

        console.log(QueryTemplates.makeForQualificationDetail("<" + uri + ">", prefLang));

        return this.http
            .post(this.url, QueryTemplates.makeForQualificationDetail("<" + uri + ">", "en") ,  {headers: this.headers})
            .toPromise()
            .then(res => {
                    let values = res.json().results.bindings[0];
                    console.log(res.json().results);
                    let qualification = new Qualification(uri);

                    if (values.referenceLanguage_group) qualification.referenceLanguage = ConcatsParser.makeStringArray(values.referenceLanguage_group.value);
                    if (values.prefLabel_lang_group) qualification.prefLabels = ConcatsParser.makeMapOfStringArrays(values.prefLabel_lang_group.value);
                    if (values.altLabel_lang_group) qualification.altLabels = ConcatsParser.makeMapOfStringArrays(values.altLabel_lang_group.value);
                    if (values.definition_lang_group) qualification.definitions = ConcatsParser.makeMapOfStringArrays(values.definition_lang_group.value);
                    if (values.description_lang_group) qualification.descriptions = ConcatsParser.makeMapOfStringArrays(values.description_lang_group.value);
                    if (values.iSCED_Fcode_group) qualification.iSCED_Fcode = ConcatsParser.makeStringArray(values.iSCED_Fcode_group.value);
                    if (values.qfAssociationUri_group) qualification.qfAssociationUris = ConcatsParser.makeStringArray(values.qfAssociationUri_group.value);
                    if (values.eCTSCredits) qualification.eCTSCredits = values.eCTSCredits.value;
                    if (values.volumeOfLearning) qualification.volumeOfLearning = values.volumeOfLearning.value;
                    if (values.isPartialQualification) qualification.isPartialQualification = values.isPartialQualification.value;
                    if (values.waysToAcquire_group) qualification.waysToAcquire = ConcatsParser.makeStringArray(values.waysToAcquire_group.value);
                    if (values.entryRequirement_group) qualification.entryRequirements = ConcatsParser.makeStringTupleArray(values.entryRequirement_group.value);
                    if (values.expiryPeriod) qualification.expiryPeriod = values.expiryPeriod.value;
                    if (values.skillUri_group) qualification.loSkillUris = ConcatsParser.makeStringArray(values.skillUri_group.value);
                    if (values.awardingStarted) qualification.awardingStarted = values.awardingStarted.value;
                    if (values.awardingEnded) qualification.awardingEnded = values.awardingEnded.value;
                    if (values.awardingLocation_group) qualification.awardingLocations = ConcatsParser.makeStringArray(values.awardingLocation_group.value);
                    if (values.awardingBodyName_lang_group) {
                        qualification.awardingBody = new Agent();
                        qualification.awardingBody.names = ConcatsParser.makeMapOfStringArrays(values.awardingBodyName_lang_group.value);
                        if (values.awardingBodyMail_group) qualification.awardingBody.mails = ConcatsParser.makeStringArray(values.awardingBodyMail_group.value);
                        if (values.awardingBodyPage_group) qualification.awardingBody.pages = ConcatsParser.makeStringArray(values.awardingBodyPage_group.value);
                    }
                    if (values.accreditationUri_group) qualification.accreditationUris = ConcatsParser.makeStringArray(values.accreditationUri_group.value);
                    if (values.homepage_group) qualification.homepages =ConcatsParser.makeStringArray(values.homepage_group.value);
                    if (values.landingPage_group) qualification.landingPages = ConcatsParser.makeStringArray(values.landingPage_group.value);
                    if (values.supplementaryDoc_group) qualification.supplementaryDocs = ConcatsParser.makeStringArray(values.supplementaryDoc_group.value);
                    if (values.issued)  qualification.issued = values.issued.value;
                    if (values.modified) qualification.modified = values.modified.value;
                    if (values.changeNote_lang_group) qualification.changeNotes = ConcatsParser.makeMapOfStringArrays(values.changeNote_lang_group.value);
                    if (values.historyNote_lang_group) qualification.historyNotes = ConcatsParser.makeMapOfStringArrays(values.historyNote_lang_group.value);
                    if (values.additionalNote_lang_group) qualification.additionalNotes = ConcatsParser.makeMapOfStringArrays(values.additionalNote_lang_group.value);
                    if (values.status) qualification.status = values.status.value;
                    if (values.ownerName_lang_group) {
                        qualification.owner = new Agent();
                        qualification.owner.names = ConcatsParser.makeMapOfStringArrays(values.ownerName_lang_group.value);
                        if (values.ownerMail_group) qualification.owner.mails = ConcatsParser.makeStringArray(values.ownerMail_group.value);
                        if (values.ownerPage_group) qualification.owner.pages = ConcatsParser.makeStringArray(values.ownerPage_group.value);
                    }
                    if (values.provenanceAgentName_lang_group) {
                        qualification.provenanceAgent = new Agent();
                        qualification.provenanceAgent.names = ConcatsParser.makeMapOfStringArrays(values.provenanceAgentName_lang_group.value);
                        if (values.provenanceAgentName_group) qualification.provenanceAgent.mails = ConcatsParser.makeStringArray(values.provenanceAgentName_group.value);
                        if (values.provenanceAgentMail_group) qualification.provenanceAgent.pages = ConcatsParser.makeStringArray(values.provenanceAgentMail_group.value);
                    }
                    if (values.publisherName_lang_group) {
                        qualification.publisher = new Agent();
                        qualification.publisher.names = ConcatsParser.makeMapOfStringArrays(values.publisherName_lang_group.value);
                        if (values.publisherMail_group) qualification.publisher.mails = ConcatsParser.makeStringArray(values.publisherMail_group.value);
                        if (values.publisherPage_group) qualification.publisher.pages = ConcatsParser.makeStringArray(values.publisherPage_group.value);
                    }


                    return qualification;
                }
            ).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Query failed,', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}