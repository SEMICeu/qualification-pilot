import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import {Router, ActivatedRoute, Params} from "@angular/router";
import {QualificationService} from "../service/qualification.service";
import {Qualification} from "../model/qualification";
import {TabData} from "./tab-data";
import {TabDataScripts} from "./tab-data-scripts";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'qual',
  templateUrl: 'detail-view.component.html',
  styleUrls: [ 'detail-view.component.css' ],
})

export class DetailView implements OnInit {

  loading = false;

  header;
  lang = "en";
  fragment: string;

  waitingForData = true;
  selectedTabData: TabData;
  selectedTabIndex = -1;
  qualification: Qualification;

  htmlProperty:SafeHtml;

  tabDatas: TabData[] = [];

  constructor(
    private qualificationService: QualificationService,
    private route: ActivatedRoute,
    private domsanitizer: DomSanitizer) {}

  ngOnInit(): void {

    this.route.fragment.forEach((fragment: string) => {
      if (fragment) {
        this.fragment = fragment;
        var uri = this.getUriFromFragmentAndSetLang();
        if (uri) {
          this.loading = true;
          this.setupDataFromUri(uri);
        }
        else {
          this.clearData();
        }
      }
    });

    this.route.params.forEach((params: Params) => {

      if (params.hasOwnProperty("tab")) {
        this.selectedTabIndex = +params['tab'];
        this.selectedTabData = this.tabDatas[this.selectedTabIndex];
      }
    });
  }

  setupDataFromUri(uri:string): void {
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
    else {
      if (this.tabDatas.length == 0) {
        this.generateTabData();
      }
    }
  }

  clearData() {
    this.tabDatas = [];
  }

  generateTabData() {

    if (!this.qualification) return;
    this.tabDatas = [];

    let qualification = this.qualification;
    let lang = this.lang;

    this.header = qualification.getPrefLabels(lang);

    this.tabDatas.push(new TabData("All", 0));

    this.tabDatas.push(TabDataScripts.core(1, this.qualification, this.lang));
    this.tabDatas.push(TabDataScripts.accreditationRecognition(2, this.qualification, this.lang));
    this.tabDatas.push(TabDataScripts.learningOutcomes(3, this.qualification, this.lang));
    this.tabDatas.push(TabDataScripts.additional(4, this.qualification, this.lang));

    for (let i = 1; i < this.tabDatas.length; ++i) {
      for (let element of this.tabDatas[i].elements) {
        this.tabDatas[0].push(element);
      }
    }

    if (this.selectedTabIndex == -1) this.selectedTabData = this.tabDatas[0];
    else this.selectedTabData = this.tabDatas[this.selectedTabIndex];
  }

  private getUriFromFragmentAndSetLang(): string {
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
