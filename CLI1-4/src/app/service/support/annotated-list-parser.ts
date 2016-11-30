import {AnnotatedList, AnnotatedListFragment} from "../../model/annotated-list";
export class AnnotatedListParser {

  static identifier = "<span about=";
  static typeIdentifier = "typeof=";
  static endIdentifier = "</span>";


  static setAndParseFromString(str: string): AnnotatedList {
    // console.log(str);

    let annotatedList = new AnnotatedList();

    let i = 0;
    let elementStart = 0;

    while (i < str.length) {

      if (str[i] == '<') {

        if (str.length >= i + this.identifier.length && str.substring(i, i + this.identifier.length) == this.identifier) {
          annotatedList.values.push(new AnnotatedListFragment().setValue(str.substring(elementStart, i)));
          elementStart = i;
          while (i + this.endIdentifier.length < str.length && str.substring(i, i + this.endIdentifier.length) != this.endIdentifier) {
            ++i;
          }
          if (i == str.length) {
            console.error("LO annotation parse error: unexpected end of string")
          }
          else {
            i = i + this.endIdentifier.length;
            annotatedList.values.push(this.parseAnnotation(str.substring(elementStart, i)));
            elementStart = i;
          }
        }

      }
      ++i;
    }
    if (i > elementStart) {
      annotatedList.values.push(new AnnotatedListFragment().setValue(str.substring(elementStart, i - 1)));
    }
    return annotatedList;
  }

  static parseAnnotation(annotation: string): AnnotatedListFragment {

    let uri: string;
    let type: string;
    let value: string;

    //console.log(annotation);
    if (annotation.substring(0, this.identifier.length) == this.identifier && annotation[this.identifier.length] == '\"') {
      let i = this.identifier.length + 1;
      while (i < annotation.length && annotation[i] != "\"") {
        ++i;
      }
      uri = annotation.substring(this.identifier.length + 1, i);
      //console.log(uri);

      while (i + this.typeIdentifier.length < annotation.length && annotation.substring(i, i + this.typeIdentifier.length) != this.typeIdentifier) {
        i++;
      }
      i = i + this.typeIdentifier.length;
      if (i == annotation.length) {
        console.error("LO annotation parse error: missing typeof in annotation='" + annotation + "'");
      }
      else {
        ++i;
        let startOfType = i;
        while (i < annotation.length && annotation[i] != "\"") {
          ++i;
        }
        type = annotation.substring(startOfType, i);
        //console.log(type);
        if (type != "esco:skill") {
          console.error("LO annotation parse error: only 'esco:skill' is allowed as typeof in annotation='" + annotation + "'");
        }
        else {
          while (i < annotation.length && annotation[i] != ">") {
            ++i;
          }
          ++i;
          let startOfValue = i;
          while (i < annotation.length && annotation[i] != "<") {
            ++i;
          }
          value = annotation.substring(startOfValue, i);
          //console.log(value);
          return new AnnotatedListFragment().setAnnotationValue([value, uri, type]);
        }
      }
    }
    return null;
  }
}
