import {Component} from "@angular/core";
import {RecognitionService} from "../service/recognition.service";
import {AccreditationService} from "../service/accreditation.service";
import {QfService} from "../service/qf.service";
import {SkillService} from "../service/skill.service";
import {QualificationService} from "../service/qualification.service";
import {AwardingBodyService} from "../service/awarding-body-service";
import {AnnotatedListService} from "../service/annotated-list.service";

@Component({
  selector: 'app-root',
  providers: [QualificationService,
    SkillService,
    QfService,
    AccreditationService,
    RecognitionService,
    AwardingBodyService,
  AnnotatedListService],
  template:`<router-outlet></router-outlet>`,
})

export class AppComponent {
}
