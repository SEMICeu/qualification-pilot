import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import {Router, ActivatedRoute, Params, Data} from "@angular/router";
import {QualificationService} from "../service/qualification.service";
import {Qualification} from "../model/qualification";
import {TabData} from "./tab-data";
import {TabDataElement} from "./tab-data-element";
import {Skill} from "../model/skill";
import {SkillService} from "../service/skill.service";

@Component({
    moduleId: module.id,
    selector: 'detail',
    templateUrl: 'detail-view.component.html',
    styleUrls: [ 'detail-view.component.css' ],
})

export class DetailView implements OnInit {

    header;

    lang = "en";

    selectedTabData: TabData;
    selectedTabIndex = -1;

    qualification: Qualification;

    tabDatas: TabData[] = [];

    fragment: String;



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
                this.setupExistingData();
            }
        });
    }

    constructor(
        private qualificationService: QualificationService,
        private skillService: SkillService,
        private router: Router,
        private route: ActivatedRoute,

    ) {
    }

    getUriFromFragmentAndSetLang(): String {
        var uri;
        var split1 = this.fragment.split("&");
        for (let str of split1) {
            var split2 = str.split("=");
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
        if (this.qualificationService.hasSameState(uri, this.lang)) {
            this.setupExistingData();
        }
        else {

            this.qualificationService.getQualificationDetailed(uri, this.lang)
                .then(qualification => {
                    this.qualification = qualification;
                    if (this.qualification.loSkillUris) {
                        this.setSkillDataThenGenerateTabData();
                    }
                    else {
                        this.generateTabData();
                    }
                });
        }
    }

    setupExistingData(): void {
        if (this.qualificationService.hasExistingDetailedQualification()) {
            this.qualification = this.qualificationService.getExistingQualificationDetailed();
            this.generateTabData();
        }
    }

    setSkillDataThenGenerateTabData() {
        this.skillService.getSkills(this.qualification.loSkillUris, this.qualification.referenceLanguage.concat(["en", this.lang]))
            .then(skills => {
                this.qualification.learningOutcomes = skills;
                this.generateTabData();
            });
    }

    generateTabData() {
        this.tabDatas = [];

        let qualification = this.qualification;
        console.log(qualification);
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
        for (let entryReq of qualification.entryRequirements) {
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
        this.tabDatas[2].addElement(new TabDataElement().setValues(["EQF-level:", [qualification.eqfTarget]]));

        this.tabDatas.push(new TabData("Learning outcomes", 3));
        this.tabDatas[3].addElement( new TabDataElement().setLinkValues(["Learning Outcomes:", qualification.getAllSkillLinks(lang)]));

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

    // gotoDetail(): void {
    //     this.router.navigate(['/detail-view', "http://data.europa.eu/esco/resource/d3fefee9-4eda-4926-9ada-ea196f7a2263"]);
    // }
}
