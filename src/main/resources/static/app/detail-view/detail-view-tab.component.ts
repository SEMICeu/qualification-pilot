

import {Component} from "@angular/core";
import {TabData} from "./tab-data";
import {Input} from "@angular/core";
@Component({
    moduleId: module.id,
    selector: 'detail-view-tab',
    templateUrl: 'detail-view-tab.component.html',
    styleUrls: [ 'detail-view-tab.component.css' ]
})

export class DetailViewTab {

    @Input()
    private data: TabData;
}