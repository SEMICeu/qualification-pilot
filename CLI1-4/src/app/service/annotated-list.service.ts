import {Injectable} from "@angular/core";
import {Skill} from "../model/qms/skill";
import {AnnotatedList} from "../model/annotated-list";
import {AnnotatedListParser} from "./support/annotated-list-parser";
@Injectable()
export class AnnotatedListService {

  getAnnotatedList (descriptions: Map<string, string[]>, learningOutcomes: Skill[]): Map<string, AnnotatedList[]> {
    if (descriptions == null) return null;

    let annotatedListMap = new Map<string, AnnotatedList[]>();
    descriptions.forEach((descriptionList: string[], key: string) => {

      let innerList = [];
      for (let description of descriptionList) {
        let annotatedList = AnnotatedListParser.setAndParseFromString(description);
        annotatedList = this.matchWithSkills(annotatedList, learningOutcomes, key);
        innerList.push(annotatedList)
      }
      annotatedListMap.set(key, innerList);
    });
    return annotatedListMap;
  }

  private matchWithSkills (annotatedList:AnnotatedList, learningOutcomes: Skill[], langCode: string): AnnotatedList {
    return annotatedList;//TODO
  }

}
