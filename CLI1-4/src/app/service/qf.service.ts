import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {endPointUrl, endPointHeaders} from "../end-point-configs";
import {ConcatsParser} from "./support/concats-parser";
import {QualificationFramework} from "../model/qms/qualification-framework";
import {Agent} from "../model/qms/agent";
import {QueryQf} from "./query-scripts/query-qf";

@Injectable()
export class QfService {

    constructor(private http: Http) { };

    url = endPointUrl;
    headers =  endPointHeaders;
    prefLang:string = "en";

    getQualificationFrameworks (qualUri: string, langs:string[]):Promise<QualificationFramework[]> {

        //console.log(QueryScripts.makeForQualificationFrameworks(qualUri, langs));
        return this.http
            .post(this.url, QueryQf.make(qualUri, langs), {headers: this.headers})
            .toPromise()
            .then(res => {
                let objects = res.json().results.bindings;
                //console.log(res.json().results);
                var qfs: QualificationFramework[] = [];
                for (let values of objects) {
                    if (values.uri) {
                        let qf = new QualificationFramework(values.uri.value);

                        if (values.description_lang_group) qf.descriptions = ConcatsParser.makeMapOfStringArrays(values.description_lang_group.value);
                        if (values.issued) qf.issued = values.issued.value;
                        if (values.targetFramework) qf.targetFrameWork = values.targetFramework.value;
                        if (values.targetFrameworkVersion) qf.targetFrameworkVersion = values.targetFrameworkVersion.value;
                        if (values.target) qf.target = values.target.value;
                        if (values.targetLabel_lang_group) qf.targetLabels = ConcatsParser.makeMapOfStringArrays(values.targetLabel_lang_group.value);
                        if (values.targetDescription_lang_group) qf.targetDescriptions = ConcatsParser.makeMapOfStringArrays(values.targetDescription_lang_group.value);
                        if (values.targetNotation_group) qf.targetNotations = ConcatsParser.makeStringArray(values.targetNotation_group.value);
                        if (values.targetName_lang_group) qf.targetNames = ConcatsParser.makeMapOfStringArrays(values.targetName_lang_group.value);
                        if (values.targetUrl) qf.targetUrl = values.targetUrl.value;
                        if (values.homepage_group) qf.homepages =  ConcatsParser.makeStringArray(values.homepage_group.value);
                        if (values.trusted) qf.trusted = values.trusted.value;
                        if (values.publisherName_lang_group) {
                            qf.publisher = new Agent();
                            qf.publisher.names = ConcatsParser.makeMapOfStringArrays(values.publisherName_lang_group.value);
                            if (values.publisherMail_group) qf.publisher.mails = ConcatsParser.makeStringArray(values.publisherMail_group.value);
                            if (values.publisherPage_group) qf.publisher.pages = ConcatsParser.makeStringArray(values.publisherPage_group.value);
                        }
                      if (values.sourceDistributionPage) qf.sourceDistributionPage = values.sourceDistributionPage.value;
                        qfs.push(qf);
                    }
                }
                return qfs;
            });
    }
}
