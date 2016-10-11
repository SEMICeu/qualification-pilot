import { Component } from '@angular/core';
import {QualificationService} from "../service/qualification.service";
import {SkillService} from "../service/skill.service";

@Component({
  moduleId: module.id,
  selector: 'my-app',
  providers: [QualificationService, SkillService],
  template:`
<!--{{title}}<br/>-->
  <router-outlet></router-outlet>
 `,
})

export class AppComponent {
  title = 'angular 2:';
  id: String;
}