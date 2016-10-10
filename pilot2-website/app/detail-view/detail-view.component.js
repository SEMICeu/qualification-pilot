"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require("@angular/router");
var qualification_service_1 = require("../service/qualification.service");
var tab_data_1 = require("./tab-data");
var tab_data_element_1 = require("./tab-data-element");
var DetailView = (function () {
    function DetailView(qualificationService, router, route) {
        this.qualificationService = qualificationService;
        this.router = router;
        this.route = route;
        this.setupNeeded = true;
        this.currentLanguage = "en";
        this.selectedTabIndex = -1;
        this.tabDatas = [];
    }
    DetailView.prototype.ngOnInit = function () {
        var _this = this;
        this.route.fragment.forEach(function (fragment) {
            if (fragment) {
                _this.fragment = fragment;
                console.log("here");
                var uri = _this.getUriFromFragmentAndSetLang();
                if (uri)
                    _this.setupDataFromUri(uri);
            }
        });
        this.route.params.forEach(function (params) {
            if (params.hasOwnProperty("tab")) {
                _this.selectedTabIndex = +params['tab'];
                _this.setupExistingData();
            }
        });
    };
    DetailView.prototype.getUriFromFragmentAndSetLang = function () {
        var uri;
        var split1 = this.fragment.split("&");
        for (var _i = 0, split1_1 = split1; _i < split1_1.length; _i++) {
            var str = split1_1[_i];
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
    };
    DetailView.prototype.generateTabData = function () {
        this.tabDatas = [];
        this.tabDatas.push(new tab_data_1.TabData("General", 0));
        this.tabDatas[0].addElement(new tab_data_element_1.TabDataElement(["Title", "<i>" + this.qualification.prefLabels.get(this.currentLanguage)[0] + "</i>"]));
        this.tabDatas[0].addElement(new tab_data_element_1.TabDataElement(["Reference Language", this.qualification.referenceLanguage]));
        this.tabDatas[0].addElement(new tab_data_element_1.TabDataElement(["Definition", this.qualification.definitions.get(this.currentLanguage)[0]]));
        this.tabDatas.push(new tab_data_1.TabData("Accreditation/Recognition", 1));
        this.tabDatas[1].addElement(new tab_data_element_1.TabDataElement(["EQF-level", this.qualification.eqfTarget]));
        this.tabDatas.push(new tab_data_1.TabData("Learning outcomes", 2));
        if (this.selectedTabIndex == -1) {
            this.selectedTabData = this.tabDatas[0];
        }
        else {
            this.selectedTabData = this.tabDatas[this.selectedTabIndex];
        }
    };
    DetailView.prototype.setupDataFromUri = function (uri) {
        var _this = this;
        if (this.qualificationService.hasSameState(uri, this.currentLanguage)) {
            this.setupExistingData();
        }
        else {
            this.qualificationService.getQualificationDetailed(uri, this.currentLanguage)
                .then(function (qualification) {
                _this.qualification = qualification;
                _this.generateTabData();
            });
        }
    };
    DetailView.prototype.setupExistingData = function () {
        if (this.qualificationService.hasExistingDetailedQualification()) {
            this.qualification = this.qualificationService.getExistingQualificationDetailed();
            this.generateTabData();
        }
    };
    DetailView = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'detail',
            templateUrl: 'detail-view.component.html',
            styleUrls: ['detail-view.component.css'],
        }), 
        __metadata('design:paramtypes', [qualification_service_1.QualificationService, router_1.Router, router_1.ActivatedRoute])
    ], DetailView);
    return DetailView;
}());
exports.DetailView = DetailView;
//# sourceMappingURL=detail-view.component.js.map