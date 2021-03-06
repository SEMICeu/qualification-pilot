import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {QualificationService} from "../service/qualification.service";
import {Qualification} from "../model/qms/qualification";
import {TabData} from "./tab-data";
import {TabDataScripts} from "./tab-data-scripts";

@Component({
  selector: 'detail',
  templateUrl: 'detail-view.component.html',
  styleUrls: [ 'detail-view.component.css' ],
})

export class DetailView implements OnInit {

  loading = true;

  header;
  lang = "en";
  fragment: string;

  selectedTabData: TabData;
  selectedTabIndex = -1;
  qualification: Qualification;

  tabDataList: TabData[] = [];

  constructor(
    private qualificationService: QualificationService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.fragment.forEach((fragment: string) => {
      if (fragment) {
        this.fragment = fragment;
        let uri = this.getUriFromFragmentAndSetLang();
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
        this.selectedTabData = this.tabDataList[this.selectedTabIndex];
      }
    });
  }

  setupDataFromUri(uri:string): void {
    if (this.qualificationService.hasNewState(uri, this.lang) || !this.qualification) {
      this.qualificationService.getQualificationDetailed(uri, this.lang)
        .then(qualification => {

          if (!qualification) return;

          this.qualificationService.getQualificationRelatedObjects(qualification).then(qualification => {
            this.qualification = qualification;
            this.generateTabData();
          });

        });
    }
    else {
      if (this.tabDataList.length == 0 && this.qualification) {
        this.generateTabData();
      }
    }
  }

  clearData() {
    this.tabDataList = [];
  }

  generateTabData() {

    this.tabDataList = [];

    let qualification = this.qualification;
    let lang = this.lang;

    this.header = qualification.getPrefLabels(lang);

    this.tabDataList.push(new TabData("All", 0));

    this.tabDataList.push(TabDataScripts.core(1, this.qualification, this.lang));
    this.tabDataList.push(TabDataScripts.accreditationRecognition(2, this.qualification, this.lang));
    this.tabDataList.push(TabDataScripts.learningOutcomes(3, this.qualification, this.lang));
    this.tabDataList.push(TabDataScripts.additional(4, this.qualification, this.lang));

    for (let i = 1; i < this.tabDataList.length; ++i) {
      for (let element of this.tabDataList[i].elements) {
        this.tabDataList[0].push(element);
      }
    }

    if (this.selectedTabIndex == -1) this.selectedTabData = this.tabDataList[0];
    else this.selectedTabData = this.tabDataList[this.selectedTabIndex];
    this.loading = false;
  }

  private getUriFromFragmentAndSetLang(): string {
    let uri;
    let split1 = this.fragment.split("&");
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
