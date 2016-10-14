import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import {Router, ActivatedRoute, Params} from "@angular/router";
import {QualificationService} from "../service/qualification.service";
import {Qualification} from "../model/qualification";
import {TabData} from "./tab-data";
import {TabDataElement} from "./tab-data-element";
import {SkillService} from "../service/skill.service";
import {QfService} from "../service/qf.service";
import {TabDataTemplates} from "./tab-data-templates";
import {AccreditationService} from "../service/accreditation.service";
import {RecognitionService} from "../service/recognition.service";

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

    promisesToFinish = 0;

    tabDatas: TabData[] = [];

    constructor(
        private qualificationService: QualificationService,
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

    setupDataFromUri(uri:String): void {
        if (this.qualificationService.hasNewState(uri, this.lang)) {


            this.qualificationService.getQualificationDetailed(uri, this.lang)
                .then(qualification => {
                    if (qualification) {
                        this.qualificationService.queryQualificationRelatedObjects(qualification).then( qualification => {
                            this.qualification = qualification;
                            this.generateTabData();
                        });
                    }
                });
        }
    }

    generateTabData() {
        if (this.qualification) {
            this.tabDatas = [];

            let qualification = this.qualification;
            let lang = this.lang;

            this.header = qualification.getPrefLabels(lang);

            this.tabDatas.push(new TabData("All", 0));

            this.tabDatas.push(TabDataTemplates.core(1, this.qualification, this.lang));
            this.tabDatas.push(TabDataTemplates.accreditationRecognition(2, this.qualification, this.lang));
            this.tabDatas.push(TabDataTemplates.description(3, this.qualification, this.lang));
            this.tabDatas.push(TabDataTemplates.learningOutcomes(4, this.qualification, this.lang));

            for (let i = 1; i < this.tabDatas.length; ++i) {
                for (let element of this.tabDatas[i].elements) {
                    this.tabDatas[0].addElement(element);
                }
            }

            if (this.selectedTabIndex == -1) this.selectedTabData = this.tabDatas[0];
            else this.selectedTabData = this.tabDatas[this.selectedTabIndex];
        }
    }

    private getUriFromFragmentAndSetLang(): String {
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
}
