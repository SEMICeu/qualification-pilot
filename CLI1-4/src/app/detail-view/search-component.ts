import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'search',
  template: ''
})

export class SearchComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {

    var stop = false;

    this.route.fragment.forEach((fragment: string) => {

      if (fragment) {
        if (fragment.includes("detailUri")) {
          this.router.navigate(["/detail"], {preserveFragment: true, replaceUrl: true});
        }
      }
    });
  }
}
