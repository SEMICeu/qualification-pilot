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

    ngOnInit(): void {


        this.route.fragment.forEach((fragment: String) => {
            if (fragment) {
                this.fragment = fragment;
                var uri = this.getUriFromFragment();
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
    selectedTabData: TabData;
    selectedTabIndex = -1;

    qualification: Qualification;

    tabDatas: TabData[] = [];

    fragment: String;

    getUriFromFragment(): String {
        var split1 = this.fragment.split("&");
        for (let str of split1) {
            var split2 = str.split("=");
            if (split2.length == 2 && split2[0] == "detailUri") {
                return split2[1];
            }
        }
        return null;
    }

    generateTabData() {
        this.tabDatas = [];

        this.tabDatas.push(new TabData("General", 0));
        this.tabDatas[0].addElement(new TabDataElement(["Title", "<i>" + this.qualification.prefLabels + "</i>"]));

        this.tabDatas.push(new TabData("Language", 1));
        this.tabDatas[1].addElement(new TabDataElement(["Reference Language", this.qualification.referenceLanguage]));

        this.tabDatas.push(new TabData("Definition", 2));
        this.tabDatas[2].addElement(new TabDataElement(["Definition", this.qualification.definitions]));

        if (this.selectedTabIndex == -1) {
            this.selectedTabData = this.tabDatas[0];
        }
        else {
            this.selectedTabData = this.tabDatas[this.selectedTabIndex];
        }

    }

    setupDataFromUri(uri:String): void {
        if (this.qualificationService.hasSameDetailedQualificationUri(uri)) {
            this.setupExistingData();
        }
        else {

            this.qualificationService.getQualificationDetailed(uri)
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
