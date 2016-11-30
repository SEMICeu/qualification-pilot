

import {Component} from "@angular/core";
import {TabData} from "./tab-data";
import {Input} from "@angular/core";
@Component({
    selector: 'data-view',
    templateUrl: 'data-view.component.html',
    styleUrls: [ 'data-view.component.css' ]
})

export class DataView {

    @Input()
    private data: TabData;
}
