import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import {Router, ActivatedRoute, Params} from "@angular/router";
import {QualificationService} from "../service/qualification.service";
import {Qualification} from "../model/qualification";
import {TabData} from "./tab-data";
import {TabDataElement} from "./tab-data-element";
import {SkillService} from "../service/skill.service";
import {QfService} from "../service/qf.service";

@Component({
    moduleId: module.id,
    selector: 'detail',
    templateUrl: 'detail-view.component.html',
    styleUrls: [ 'detail-view.component.css' ],
})

export class DetailView implements OnInit {

    header;
    lang = "en";
    fragment: String;

    waitingForData = true;
    selectedTabData: TabData;
    selectedTabIndex = -1;
    qualification: Qualification;

    tabDatas: TabData[] = [];

    constructor(
        private qualificationService: QualificationService,
        private skillService: SkillService,
        private qfService: QfService,
        private router: Router,
        private route: ActivatedRoute,) {}

    ngOnInit(): void {

        this.route.fragment.forEach((fragment: String) => {
            if (fragment) {
                this.fragment = fragment;
                var uri = this.getUriFromFragmentAndSetLang();
                if (uri) this.setupDataFromUri(uri);
            }
        });

        this.route.params.forEach((params: Params) => {

            if (params.hasOwnProperty("tab")) {
                this.selectedTabIndex = +params['tab'];
                this.selectedTabData = this.tabDatas[this.selectedTabIndex];
            }
        });
    }

    getUriFromFragmentAndSetLang(): String {
        let uri;
        var split1 = this.fragment.split("&");
        for (let str of split1) {
            let split2 = str.split("=");
            if (split2.length == 2) {
                if (split2[0] == "detailUri") {
                    uri = split2[1];
                }
                if (split2[0] == "lang") {
                    this.lang = split2[1];
                }
            }
        }
        return uri;
    }

    setupDataFromUri(uri:String): void {
        if (this.qualificationService.hasNewState(uri, this.lang)) {

            this.qualificationService.getQualificationDetailed(uri, this.lang)
                .then(qualification => {
                    if (qualification) {
                        this.qualification = qualification;
                        console.log(qualification);

                        if (this.qualification.loSkillUris) {
                            this.setSkillData();
                        }
                        if (this.qualification.qfAssociationUris) {
                            this.setQfData();
                        }
                        this.generateTabData();

                    }
                });
        }
    }

    setSkillData() {
        let langCodes = this.qualification.referenceLanguage ? this.qualification.referenceLanguage.concat(this.lang, "en") : [this.lang, "en"];
        this.skillService.getSkills(this.qualification.loSkillUris, langCodes)
            .then(skills => {
                this.qualification.learningOutcomes = skills;
                this.generateSkillTabData();
            });
    }
    setQfData() {
        let langCodes = this.qualification.referenceLanguage ? this.qualification.referenceLanguage.concat(this.lang, "en") : [this.lang, "en"];
        this.qfService.getQualificationFrameworks(this.qualification.uri, langCodes)
            .then(qfs => {
                this.qualification.qualificationFrameworks = qfs;
                this.generateQfTabData();
            });
    }

    generateTabData() {
        this.tabDatas = [];

        let qualification = this.qualification;
        let lang = this.lang;

        this.header = qualification.getPrefLabels(lang);

        this.tabDatas.push(new TabData("All",0));

        this.tabDatas.push(new TabData("Core", 1));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Title:", qualification.getPrefLabels(lang)]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Alternative title:", qualification.getAltLabels(lang)]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Reference Language:", qualification.referenceLanguage]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Definition:", qualification.getDefinitions(lang)]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Test",null]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["iSCED-Fcode:",qualification.iSCED_Fcode]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["ECTS credits:", [qualification.eCTSCredits]]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Volume of learning:", [qualification.volumeOfLearning]]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Is Partial Qualification:", [qualification.isPartialQualification]]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Ways to Acquire:", qualification.waysToAcquire]));
        let entryReqs:String[] = [];
        if (qualification.entryRequirements) for (let entryReq of qualification.entryRequirements) {
            entryReqs.push("Type: " + entryReq[0]);
            entryReqs.push("Level: " + entryReq[1]);
        }
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Entry Requirement:", entryReqs]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Expiry Period:",[qualification.expiryPeriod]]));
        this.tabDatas[1].addElement(new TabDataElement().setLinkValues(["Homepage:",qualification.getHomepageLinks()]));
        this.tabDatas[1].addElement(new TabDataElement().setLinkValues(["Landing Page:",qualification.getLandingPageLinks()]));
        this.tabDatas[1].addElement(new TabDataElement().setLinkValues(["Supplementary Docs:",qualification.getSupplementaryDocLinks()]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Release/Publication Date:", [qualification.issued]]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Modification Date:", [qualification.modified]]));
        this.tabDatas[1].addElement(new TabDataElement().setValues(["Status:", [qualification.status]]));

        this.tabDatas.push(new TabData("Accreditation/Recognition", 2));
        if (qualification.qualificationFrameworks) for (let qf of qualification.qualificationFrameworks) {
            var qfValues:TabDataElement[] = [];
            qfValues.push(new TabDataElement().setValues(["Description: ",qf.getDescriptions(lang, this.qualification.referenceLanguage)]));
            qfValues.push(new TabDataElement().setValues(["Issued:",[qf.issued]]));
            qfValues.push(new TabDataElement().setValues(["Target Framework:",[qf.targetFrameWork]]));
            qfValues.push(new TabDataElement().setValues(["Target Framework Version:",[qf.targetFrameworkVersion]]));
            qfValues.push(new TabDataElement().setValues(["Target:",[qf.target]]));
            qfValues.push(new TabDataElement().setValues(["Target Description: ",qf.getTargetDescriptions(lang, this.qualification.referenceLanguage)]));
            qfValues.push(new TabDataElement().setValues(["Target Notation:",qf.targetNotations]));
            qfValues.push(new TabDataElement().setValues(["Target Name: ",qf.getTargetNames(lang, this.qualification.referenceLanguage)]));
            qfValues.push(new TabDataElement().setValues(["Target URL:",[qf.targetUrl]]));
            qfValues.push(new TabDataElement().setLinkValues(["Homepage:",qf.getHomepageLinks()]));
            qfValues.push(new TabDataElement().setValues(["Trusted:",[qf.trusted]]));
            qfValues.push(new TabDataElement().setValues(["Publisher Name:",qf.getPublisherNames(lang, this.qualification.referenceLanguage)]));
            qfValues.push(new TabDataElement().setLinkValues(["Publisher Mail :",qf.getPublisherMails()]));
            qfValues.push(new TabDataElement().setLinkValues(["Publisher Homepage :",qf.getPublisherPages()]));

            this.tabDatas[2].addElement(new TabDataElement().setElementsGroup(qfValues));
        }
        this.tabDatas.push(new TabData("Learning outcomes", 3));
        //this.tabDatas[3].addElement( new TabDataElement().setLinkValues(["Learning Outcomes:", this.qualification.getAllSkillLinks(this.lang)]));
        if (qualification.learningOutcomes) for (let skill of qualification.learningOutcomes) {
            var skillValues:TabDataElement[] = [];
            skillValues.push(new TabDataElement().setLinkValues(["", [skill.getSkillLink(lang, this.qualification.referenceLanguage)]]));
            skillValues.push(new TabDataElement().setValues(["Description:", skill.getDescriptions(lang, this.qualification.referenceLanguage)]));

            this.tabDatas[3].addElement(new TabDataElement().setElementsGroup(skillValues));
        }

        this.tabDatas.push(new TabData("Description",4));
        this.tabDatas[4].addElement( new TabDataElement().setValues(["Description:",qualification.getDescriptions(lang)]));
        this.tabDatas[4].addElement( new TabDataElement().setValues(["Additional Notes:", qualification.getAdditionalNotes(lang)]));

        for (let i = 1; i < this.tabDatas.length; ++i) {
            for (let element of this.tabDatas[i].elements) {
                this.tabDatas[0].addElement(element);
            }
        }

        if (this.selectedTabIndex == -1) this.selectedTabData = this.tabDatas[0];
        else this.selectedTabData = this.tabDatas[this.selectedTabIndex];
    }

    generateSkillTabData () {

        this.generateTabData();//TODO better

    }

    generateQfTabData () {

        this.generateTabData();//TODO better
    }

    // gotoDetail(): void {
    //     this.router.navigate(['/detail-view', "http://data.europa.eu/esco/resource/d3fefee9-4eda-4926-9ada-ea196f7a2263"]);
    // }
}
