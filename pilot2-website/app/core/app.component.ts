import { Component } from '@angular/core';
import {QualificationService} from "../service/qualification.service";
import {SkillService} from "../service/skill.service";
import {QfService} from "../service/qf.service";
import {AccreditationService} from "../service/accreditation.service";
import {RecognitionService} from "../service/recognition.service";

@Component({
  moduleId: module.id,
  selector: 'my-app',
  providers: [QualificationService, SkillService, QfService, AccreditationService, RecognitionService],
  template:`
<!--{{title}}<br/>-->
  <router-outlet></router-outlet>
 `,
})

export class AppComponent {
  title = 'angular 2:';
  id: String;
}