import { Component } from '@angular/core';
import {RecognitionService} from "../service/recognition.service";
import {AccreditationService} from "../service/accreditation.service";
import {QfService} from "../service/qf.service";
import {SkillService} from "../service/skill.service";
import {QualificationService} from "../service/qualification.service";
import {AwardingBodyService} from "../service/awarding-body-service";

@Component({
  selector: 'app-root',
  providers: [QualificationService, SkillService, QfService, AccreditationService, RecognitionService, AwardingBodyService],
  template:`<router-outlet></router-outlet>`,
})

export class AppComponent {
  title = 'angular 2:';
}
