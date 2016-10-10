import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import {Router, ActivatedRoute, Params, Data} from "@angular/router";
import {QualificationService} from "../service/qualification.service";
import {Qualification} from "../model/qualification";
import {TabData} from "./tab-data";
import {TabDataElement} from "./tab-data-element";

@Component({
    moduleId: module.id,
    selector: 'detail',
    templateUrl: 'detail-view.component.html',
    styleUrls: [ 'detail-view.component.css' ],
})

export class DetailView implements OnInit {
    setupNeeded = true;

    currentLanguage = "en";

    selectedTabData: TabData;
    selectedTabIndex = -1;

    qualification: Qualification;

    tabDatas: TabData[] = [];

    fragment: String;

    ngOnInit(): void {


        this.route.fragment.forEach((fragment: String) => {
            if (fragment) {
                this.fragment = fragment;
                console.log("here");
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
                    this.currentLanguage = split2[1];
                }
            }
        }
        return uri;
    }

    generateTabData() {
        this.tabDatas = [];

        this.tabDatas.push(new TabData("General", 0));
        this.tabDatas[0].addElement(new TabDataElement(["Title", "<i>" + this.qualification.prefLabels.get(this.currentLanguage)[0] + "</i>"]));
        this.tabDatas[0].addElement(new TabDataElement(["Reference Language", this.qualification.referenceLanguage]));
        this.tabDatas[0].addElement(new TabDataElement(["Definition", this.qualification.definitions.get(this.currentLanguage)[0]]));

        this.tabDatas.push(new TabData("Accreditation/Recognition", 1));
        this.tabDatas[1].addElement(new TabDataElement(["EQF-level", this.qualification.eqfTarget]));

        this.tabDatas.push(new TabData("Learning outcomes", 2));

        if (this.selectedTabIndex == -1) {
            this.selectedTabData = this.tabDatas[0];
        }
        else {
            this.selectedTabData = this.tabDatas[this.selectedTabIndex];
        }
    }

    setupDataFromUri(uri:String): void {
        if (this.qualificationService.hasSameState(uri, this.currentLanguage)) {
            this.setupExistingData();
        }
        else {

            this.qualificationService.getQualificationDetailed(uri, this.currentLanguage)
                .then(qualification => {
                    this.qualification = qualification;
                    this.generateTabData();
                });
        }
    }

    setupExistingData(): void {
        if (this.qualificationService.hasExistingDetailedQualification()) {
            this.qualification = this.qualificationService.getExistingQualificationDetailed();
            this.generateTabData();
        }
    }


    // gotoDetail(): void {
    //     this.router.navigate(['/detail-view', "http://data.europa.eu/esco/resource/d3fefee9-4eda-4926-9ada-ea196f7a2263"]);
    // }
}
