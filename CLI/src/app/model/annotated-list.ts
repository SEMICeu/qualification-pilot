
import {QualificationService} from "../service/qualification.service";
export class AnnotatedList {

    constructor(
        private qualificationService?: QualificationService) {

    }

    identifier = "<span about=";
    typeIdentifier = "typeof=";
    endIdentifier = "</span>";


    values:AnnotatedListFragment[] = [];

    // setAndParseFromStrings (strings:String[]) {
    //
    //     if (strings) {
    //         for (let string of strings) {
    //             console.log(string);
    //
    //             let i = 0;
    //             let elementStart = 0;
    //
    //             while (i < string.length) {
    //
    //                 if (string[i] == '<') {
    //
    //                     if (string.length >= i + this.identifier.length && string.substring(i, i + this.identifier.length) == this.identifier) {
    //                         this.values.push(new AnnotatedListFragment().setValue(string.substring(elementStart, i)));
    //                         elementStart = i;
    //                         while (i + this.endIdentifier.length < string.length && string.substring(i, i + this.endIdentifier.length) != this.endIdentifier) {
    //                             ++i;
    //                         }
    //                         if (i == string.length) {
    //                             console.error("LO annotation parse error: unexpected end of string")
    //                         }
    //                         else {
    //                             i = i + this.endIdentifier.length;
    //                             this.values.push(this.parseAnnotation(string.substring(elementStart, i)));
    //                             elementStart = i;
    //                         }
    //                     }
    //
    //                 }
    //                 ++i;
    //             }
    //             if (i > elementStart) {
    //                 this.values.push(new AnnotatedListFragment().setValue(string.substring(elementStart, i - 1)));
    //             }
    //         }
    //     }
    //     console.log(this.values);
    //     return this;
    // }
    //
    // parseAnnotation(annotation: String):AnnotatedListFragment {
    //
    //     let uri: String;
    //     let type: String;
    //     let value: String;
    //
    //     console.log(annotation);
    //     if (annotation.substring(0, this.identifier.length) == this.identifier && annotation[this.identifier.length]=='\"') {
    //         var i = this.identifier.length + 1;
    //         while (i < annotation.length && annotation[i] != "\"") {
    //             ++i;
    //         }
    //         uri = annotation.substring(this.identifier.length + 1, i);
    //         console.log(uri);
    //
    //         while (i + this.typeIdentifier.length < annotation.length && annotation.substring(i, i + this.typeIdentifier.length) != this.typeIdentifier) {
    //             i++;
    //         }
    //         i = i + this.typeIdentifier.length;
    //         if (i == annotation.length) {
    //             console.error("LO annotation parse error: missing typeof in annotation='" + annotation + "'");
    //         }
    //         else {
    //             ++i;
    //             let startOfType = i;
    //             while (i < annotation.length && annotation[i] != "\"") {
    //                 ++i;
    //             }
    //             type = annotation.substring(startOfType, i);
    //             console.log(type);
    //             if (type != "esco:skill") {
    //                 console.error("LO annotation parse error: only 'esco:skill' is allowed as typeof in annotation='" + annotation + "'");
    //             }
    //             else {
    //                 while (i < annotation.length && annotation[i] != ">") {
    //                     ++i;
    //                 }
    //                 ++i;
    //                 let startOfValue = i;
    //                 while (i < annotation.length && annotation[i] != "<") {
    //                     ++i;
    //                 }
    //                 value = annotation.substring(startOfValue, i);
    //                 console.log(value);
    //                 return new AnnotatedListFragment().setAnnotationValue([value,uri,null]);
    //             }
    //         }
    //     }
    //
    //     return null;
    // }
    // getAsString ():String {
    //     let s:String = "";
    //     for (let fragment of this.values) {
    //         if (fragment.value) {
    //             s += fragment.value;
    //         }
    //         if (fragment.annotationValue) {
    //             s += "<span class='tooltip annotation-link'>" + fragment.annotationValue[0] +
    //                 "<span class='tooltiptext'>" + fragment.annotationValue[1] + "</span>" +
    //                 "</span>"
    //         }
    //     }
    //     return s;
    // }
}

export class AnnotatedListFragment {

    setValue (value:String) {
        this.value = value;
        return this;
    }

    setAnnotationValue (annotationValue:[String,String,String]) {
        this.annotationValue = annotationValue;
        return this;
    }

    value: String;
    annotationValue: [String,String,String];
}
