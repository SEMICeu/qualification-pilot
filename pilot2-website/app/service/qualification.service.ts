

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Qualification} from "../model/qualification";
import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {ConcatsParser} from "./support/concats-parser";
import {QfService} from "./qf.service";
import {QueryTemplates} from "./support/query-templates";
import {Agent} from "../model/agent";
import {QualificationFramework} from "../model/qualification-framework";
import {SkillService} from "./skill.service";
import {AccreditationService} from "./accreditation.service";
import {RecognitionService} from "./recognition.service";
import {Accreditation} from "../model/accreditation";
import {Recognition} from "../model/recognition";
import {Skill} from "../model/skill";

@Injectable()
export class QualificationService {

    constructor(private http: Http,
                private qfService: QfService,
                private skillService: SkillService,
                private accreditationService: AccreditationService,
                private recognitionService: RecognitionService) { };

    url = endPointUrl;
    headers =  endPointHeaders;
    prefLang:String = "en";

    detailedQualification: Qualification;

    getQualificationDetailed(uri: String, prefLang:String): Promise<Qualification> {
        this.prefLang = prefLang;
        let promisedQualification = this.queryQualificationDetailedMain(uri, prefLang);
        promisedQualification.then(qualification => this.detailedQualification = qualification);

        return promisedQualification;
    }
    hasNewState(uri: String, prefLang:String): boolean {
        return (!this.detailedQualification || this.detailedQualification.uri != uri || this.prefLang != prefLang);
    }


    queryQualificationRelatedObjects(qualification: Qualification): Promise<Qualification> {

        let uri = qualification.uri;
        let langCodes = qualification.referenceLang ? qualification.referenceLang.concat(this.prefLang, "en") : [this.prefLang, "en"];

        return Promise.all([
            this.qfService.getQualificationFrameworks(uri, langCodes),
            this.accreditationService.getAccreditations(uri, langCodes),
            this.recognitionService.getRecognitions(uri, langCodes),
            this.skillService.getSkills(uri, langCodes)
        ]).then(results => {
            qualification.qualificationFrameworks = results[0] as QualificationFramework[];
            qualification.accreditations = results[1] as Accreditation[];
            qualification.recognitions = results[2] as Recognition[];
            qualification.learningOutcomes = results[3] as Skill[];
            return qualification;
        });
    }

    queryQualificationDetailedMain(uri: String, prefLang:String): Promise<Qualification> {

        console.log(QueryTemplates.makeForQualificationDetail("<" + uri + ">", prefLang));

        return this.http
            .post(this.url, QueryTemplates.makeForQualificationDetail("<" + uri + ">", prefLang) ,  {headers: this.headers})
            .toPromise()
            .then(res => {
                    let values = res.json().results.bindings[0];
                    console.log(res.json().results);
                    let qualification = new Qualification(uri);

                    if (values.referenceLang_group) qualification.referenceLang = ConcatsParser.makeStringArray(values.referenceLang_group.value);
                    if (values.referenceLangLabel_lang_group) qualification.referenceLangLabels = ConcatsParser.makeMapOfStringArrays(values.referenceLangLabel_lang_group.value);
                    if (values.prefLabel_lang_group) qualification.prefLabels = ConcatsParser.makeMapOfStringArrays(values.prefLabel_lang_group.value);
                    if (values.altLabel_lang_group) qualification.altLabels = ConcatsParser.makeMapOfStringArrays(values.altLabel_lang_group.value);
                    if (values.definition_lang_group) qualification.definitions = ConcatsParser.makeMapOfStringArrays(values.definition_lang_group.value);
                    if (values.description_lang_group) qualification.descriptions = ConcatsParser.makeMapOfStringArrays(values.description_lang_group.value);
                    if (values.iSCEDFcode_group) qualification.iSCEDFcode = ConcatsParser.makeStringArray(values.iSCEDFcode_group.value);
                    if (values.iSCEDFcodeLabel_lang_group) qualification.iSCEDFcodeLabel = ConcatsParser.makeMapOfStringArrays(values.iSCEDFcodeLabel_lang_group.value);
                    if (values.qfAssociationUri_group) qualification.qfAssociationUris = ConcatsParser.makeStringArray(values.qfAssociationUri_group.value);
                    if (values.eCTSCredits) qualification.eCTSCredits = values.eCTSCredits.value;
                    if (values.volumeOfLearning) qualification.volumeOfLearning = values.volumeOfLearning.value;
                    if (values.isPartialQualification) qualification.isPartialQualification = values.isPartialQualification.value;
                    if (values.waysToAcquire_group) qualification.waysToAcquire = ConcatsParser.makeStringArray(values.waysToAcquire_group.value);
                    if (values.entryRequirement_group) qualification.entryRequirements = ConcatsParser.makeStringTupleArray(values.entryRequirement_group.value);
                    if (values.expiryPeriod) qualification.expiryPeriod = values.expiryPeriod.value;
                    if (values.skillUri_group) qualification.loSkillUris = ConcatsParser.makeStringArray(values.skillUri_group.value);
                    if (values.recognitionUri_group) qualification.recognitionUris = ConcatsParser.makeStringArray(values.recognitionUri_group.value);
                    if (values.awardingStarted) qualification.awardingStarted = values.awardingStarted.value;
                    if (values.awardingEnded) qualification.awardingEnded = values.awardingEnded.value;
                    if (values.awardingLocation_lang_group) qualification.awardingLocations = ConcatsParser.makeMapOfStringArrays(values.awardingLocation_lang_group.value);
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