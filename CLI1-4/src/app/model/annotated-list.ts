
import {QualificationService} from "../service/qualification.service";
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";
import {SecurityContext} from "@angular/core";
export class AnnotatedList {

  constructor() {
  }

  values:AnnotatedListFragment[] = [];

  getAsSafeHtml(): SafeHtml {
    console.warn("UNSAFE METHOD: getAsStringAndSanitizeAnnotations - using this method could be unsafe and is used only for the skill annotations in the demo");
    let s: string = "";
    for (let fragment of this.values) {
      if (fragment.value) {
        s += fragment.value;
      }
      if (fragment.annotationValue) {
        s +=
          "<span class='annotation annotation-link'>" +
          fragment.annotationValue[0] +
          "<span class='annotationText'>" +
          fragment.annotationValue[1] +
          "</span>" + "</span>";
      }
    }
    //console.log(s);
    return s;
  }
}

export class AnnotatedListFragment {

  setValue (value:string) {
    this.value = value;
    return this;
  }

  setAnnotationValue (annotationValue:[string/*link name*/,string/*skill link*/,string/*type*/]) {
    this.annotationValue = annotationValue;
    return this;
  }

  value: string;
  annotationValue: [string,string,string];
}
