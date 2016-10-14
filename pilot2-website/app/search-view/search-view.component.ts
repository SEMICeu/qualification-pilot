import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'search',
    template: ``
})

export class SearchView {//implements OnInit {

    //constructor(
    //    private route: ActivatedRoute, private router: Router) {}

    // ngOnInit(): void {
    //     this.route.fragment.forEach((fragment: string) => {
    //         // if (fragment) {
    //         //     console.log(fragment);
    //         //     if (this.getFragmentQualificationUri(fragment))  {
    //         //             this.router.navigate(['/detail'] , {fragment: fragment});
    //         //         }
    //         //     }
    //     });
    // }

    getFragmentQualificationUri(fragment: String): String {
        let uri;
        var split1 = fragment.split("&");
        for (let str of split1) {
            let split2 = str.split("=");
            if (split2.length == 2) {
                if (split2[0] == "detailUri") {
                    uri = split2[1];
                }
            }
        }
        return uri;
    }

}
