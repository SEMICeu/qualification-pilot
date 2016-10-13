import {TabData} from "./tab-data";
import {Qualification} from "../model/qualification";
import {TabDataElement} from "./tab-data-element";
export class TabDataTemplates {

    static core(index:number, qualification: Qualification, lang:String): TabData {
        let data = new TabData("Core", index);

        data.addElement(new TabDataElement().setSectionHeader(data.name));
        data.addElement(new TabDataElement().setValues(["Title:", qualification.getPrefLabels(lang)]));
        data.addElement(new TabDataElement().setValues(["Alternative title:", qualification.getAltLabels(lang)]));
        data.addElement(new TabDataElement().setValues(["Reference Language:", qualification.referenceLanguage]));
        data.addElement(new TabDataElement().setValues(["Definition:", qualification.getDefinitions(lang)]));
        data.addElement(new TabDataElement().setValues(["Test",null]));
        data.addElement(new TabDataElement().setValues(["iSCED-Fcode:",qualification.getISCEDFcode(lang)]));
        data.addElement(new TabDataElement().setValues(["ECTS credits:", [qualification.eCTSCredits]]));
        data.addElement(new TabDataElement().setValues(["Volume of learning:", [qualification.volumeOfLearning]]));
        data.addElement(new TabDataElement().setValues(["Is Partial Qualification:", [qualification.isPartialQualification]]));
        data.addElement(new TabDataElement().setValues(["Ways to Acquire:", qualification.waysToAcquire]));
        let entryReqs:String[] = [];
        if (qualification.entryRequirements) for (let entryReq of qualification.entryRequirements) {
            entryReqs.push("Type: " + entryReq[0]);
            entryReqs.push("Level: " + entryReq[1]);}
        data.addElement(new TabDataElement().setValues(["Entry Requirement:", entryReqs]));
        data.addElement(new TabDataElement().setValues(["Expiry Period:",[qualification.expiryPeriod]]));

        data.addElement(new TabDataElement().setValues(["Awarding Started", [qualification.awardingStarted]]));
        data.addElement(new TabDataElement().setValues(["Awarding Ended", [qualification.awardingEnded]]));
        data.addElement(new TabDataElement().setValues(["Awarding Location",qualification.awardingLocations]));
        if (qualification.awardingBody) {
            var awardingBody: TabDataElement[] = [];
            awardingBody.push(new TabDataElement().setValues(["Name:", qualification.awardingBody.getNames(lang, qualification.referenceLanguage)]));
            awardingBody.push(new TabDataElement().setLinkValues(["Mail:", qualification.awardingBody.getMailLinks()]));
            awardingBody.push(new TabDataElement().setLinkValues(["Homepage:", qualification.awardingBody.getPageLinks()]));
            data.addElement(new TabDataElement().setElementsGroup(awardingBody).setElementsGroupTitle("Awarding Body"));
        }
        data.addElement(new TabDataElement().setLinkValues(["Homepage:",qualification.getHomepageLinks()]));
        data.addElement(new TabDataElement().setLinkValues(["Landing Page:",qualification.getLandingPageLinks()]));
        data.addElement(new TabDataElement().setLinkValues(["Supplementary Documents:",qualification.getSupplementaryDocLinks()]));
        data.addElement(new TabDataElement().setValues(["Release/Publication Date:", [qualification.issued]]));
        data.addElement(new TabDataElement().setValues(["Modification Date:", [qualification.modified]]));
        data.addElement(new TabDataElement().setValues(["Status:", [qualification.status]]));

        if (qualification.owner) {
            var owner: TabDataElement[] = [];
            owner.push(new TabDataElement().setValues(["Name:", qualification.owner.getNames(lang, qualification.referenceLanguage)]));
            owner.push(new TabDataElement().setLinkValues(["Mail:", qualification.owner.getMailLinks()]));
            owner.push(new TabDataElement().setLinkValues(["Homepage:", qualification.owner.getPageLinks()]));
            data.addElement(new TabDataElement().setElementsGroup(owner).setElementsGroupTitle("Owner"));
        }
        if (qualification.provenanceAgent) {
            var provenanceAgent: TabDataElement[] = [];
            provenanceAgent.push(new TabDataElement().setValues(["Name:", qualification.provenanceAgent.getNames(lang, qualification.referenceLanguage)]));
            provenanceAgent.push(new TabDataElement().setLinkValues(["Mail:", qualification.provenanceAgent.getMailLinks()]));
            provenanceAgent.push(new TabDataElement().setLinkValues(["Homepage:", qualification.provenanceAgent.getPageLinks()]));
            data.addElement(new TabDataElement().setElementsGroup(provenanceAgent).setElementsGroupTitle("Provenance Agent"));
        }
        if (qualification.publisher) {
            var publisher: TabDataElement[] = [];
            publisher.push(new TabDataElement().setValues(["Name:", qualification.publisher.getNames(lang, qualification.referenceLanguage)]));
            publisher.push(new TabDataElement().setLinkValues(["Mail:", qualification.publisher.getMailLinks()]));
            publisher.push(new TabDataElement().setLinkValues(["Homepage:", qualification.publisher.getPageLinks()]));
            data.addElement(new TabDataElement().setElementsGroup(publisher).setElementsGroupTitle("Publisher"));
        }
        return data;
    }

    static accreditationRecognition(index:number, qualification: Qualification, lang:String): TabData {
        let data = new TabData("Accreditation/Recognition", index);

        data.addElement(new TabDataElement().setSectionHeader(data.name));
        if (qualification.accreditations) for (let acc of qualification.accreditations) {
            var qfValues:TabDataElement[] = [];

            if (acc.recognizedBody) {
                qfValues.push(new TabDataElement().setValues(["Recognized Awarding Body: ", acc.recognizedBody.getNames(lang, qualification.referenceLanguage)]));
                qfValues.push(new TabDataElement().setLinkValues(["Recognized Awarding Body Mail:", acc.recognizedBody.getMailLinks()]));
                qfValues.push(new TabDataElement().setLinkValues(["Recognized Awarding Body Homepage :", acc.recognizedBody.getPageLinks()]));
            }
            if (acc.recognizingAgent) {
                qfValues.push(new TabDataElement().setValues(["Recognizer Name: ",acc.recognizingAgent.getNames(lang, qualification.referenceLanguage)]));
                qfValues.push(new TabDataElement().setLinkValues(["Recognizer Mail:",acc.recognizingAgent.getMailLinks()]));
                qfValues.push(new TabDataElement().setLinkValues(["Recognizer Homepage :",acc.recognizingAgent.getPageLinks()]));
            }
            qfValues.push(new TabDataElement().setValues(["Issued:",[acc.issued]]));
            qfValues.push(new TabDataElement().setValues(["Review Date:",[acc.reviewDate]]));
            qfValues.push(new TabDataElement().setValues(["End Date:",[acc.endDate]]));

            qfValues.push(new TabDataElement().setLinkValues(["Homepage:",acc.getHomepageLinks()]));
            qfValues.push(new TabDataElement().setLinkValues(["Landing Page:",acc.getlandingPageLinks()]));
            qfValues.push(new TabDataElement().setLinkValues(["Supplementary Documents:",acc.getsupplementaryDocLinks()]));
            qfValues.push(new TabDataElement().setValues(["Trusted:",[acc.trusted]]));

            data.addElement(new TabDataElement().setElementsGroup(qfValues).setElementsGroupTitle("Accreditation"));
        }
        if (qualification.qualificationFrameworks) for (let qf of qualification.qualificationFrameworks) {
            var qfValues:TabDataElement[] = [];
            qfValues.push(new TabDataElement().setValues(["Description: ",qf.getDescriptions(lang, qualification.referenceLanguage)]));
            qfValues.push(new TabDataElement().setValues(["Issued:",[qf.issued]]));
            qfValues.push(new TabDataElement().setValues(["Target Framework:",[qf.targetFrameWork]]));
            qfValues.push(new TabDataElement().setValues(["Target Framework Version:",[qf.targetFrameworkVersion]]));
            qfValues.push(new TabDataElement().setValues(["Target:",[qf.target]]));
            qfValues.push(new TabDataElement().setValues(["Target Description: ",qf.getTargetDescriptions(lang, qualification.referenceLanguage)]));
            qfValues.push(new TabDataElement().setValues(["Target Notation:",qf.targetNotations]));
            qfValues.push(new TabDataElement().setValues(["Target Name: ",qf.getTargetNames(lang, qualification.referenceLanguage)]));
            qfValues.push(new TabDataElement().setValues(["Target URL:",[qf.targetUrl]]));
            qfValues.push(new TabDataElement().setLinkValues(["Homepage:",qf.getHomepageLinks()]));
            qfValues.push(new TabDataElement().setValues(["Trusted:",[qf.trusted]]));
            if (qf.publisher) {
                qfValues.push(new TabDataElement().setValues(["Publisher Name:", qf.publisher.getNames(lang, qualification.referenceLanguage)]));
                qfValues.push(new TabDataElement().setLinkValues(["Publisher Mail :", qf.publisher.getMailLinks()]));
                qfValues.push(new TabDataElement().setLinkValues(["Publisher Homepage :", qf.publisher.getPageLinks()]));
            }

            data.addElement(new TabDataElement().setElementsGroup(qfValues).setElementsGroupTitle("Qualification Frameworks"));
        }

        return data;
    }

    static learningOutcomes(index:number, qualification: Qualification, lang:String): TabData {

        let data = new TabData("Learning outcomes", index);
        data.addElement(new TabDataElement().setSectionHeader(data.name));
        if (qualification.learningOutcomes) for (let skill of qualification.learningOutcomes) {
            var skillValues: TabDataElement[] = [];
            skillValues.push(new TabDataElement().setLinkValues(["", [skill.getSkillLink(lang, qualification.referenceLanguage)]]));
            skillValues.push(new TabDataElement().setValues(["Description:", skill.getDescriptions(lang, qualification.referenceLanguage)]));

            data.addElement(new TabDataElement().setElementsGroup(skillValues));
        }

        return data;
    }

    static description(index:number, qualification: Qualification, lang:String) {
        let data = new TabData("Descriptions", index);
        data.addElement(new TabDataElement().setSectionHeader(data.name));
        data.addElement( new TabDataElement().setValues(["Description:",qualification.getDescriptions(lang)]));
        data.addElement( new TabDataElement().setValues(["Additional Notes:", qualification.getAdditionalNotes(lang)]));
        data.addElement( new TabDataElement().setValues(["Change Notes:", qualification.getChangeNotes(lang)]));
        data.addElement( new TabDataElement().setValues(["History Notes:", qualification.getHistoryNotes(lang)]));

        return data;
    }
}