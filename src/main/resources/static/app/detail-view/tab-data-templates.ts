import {TabData} from "./tab-data";
import {Qualification} from "../model/qualification";
import {TabDataElement} from "./tab-data-element";
export class TabDataTemplates {

    static core(index:number, qualification: Qualification, lang:String): TabData {
        let data = new TabData("Core", index);

        data.push(new TabDataElement().setSectionHeader(data.name));

        var container: TabDataElement[] = [];
        container.push(new TabDataElement().setValues(["Title:", qualification.getPrefLabels(lang)]));
        container.push(new TabDataElement().setValues(["Alternative title:", qualification.getAltLabels(lang)]));
        container.push(new TabDataElement().setValues(["Reference Language:", qualification.getReferenceLangLabels(lang)]));
        container.push(new TabDataElement().setValues(["Definition:", qualification.getDefinitions(lang)]));
        container.push(new TabDataElement().setValues(["Test",null]));
        container.push(new TabDataElement().setValues(["iSCED-Fcode:",qualification.getISCEDFcode(lang)]));
        container.push(new TabDataElement().setValues(["ECTS credits:", [qualification.eCTSCredits]]));
        container.push(new TabDataElement().setValues(["Volume of learning:", [qualification.volumeOfLearning]]));
        container.push(new TabDataElement().setValues(["Is Partial Qualification:", [qualification.isPartialQualification]]));
        container.push(new TabDataElement().setValues(["Ways to Acquire:", qualification.waysToAcquire]));
        let entryReqs:String[] = [];
        if (qualification.entryRequirements) for (let entryReq of qualification.entryRequirements) {
            entryReqs.push("Type: " + entryReq[0]);
            entryReqs.push("Level: " + entryReq[1]);}
        container.push(new TabDataElement().setValues(["Entry Requirement:", entryReqs]));
        container.push(new TabDataElement().setValues(["Expiry Period:",[qualification.expiryPeriod]]));

        container.push(new TabDataElement().setLinkValues(["Homepage:",qualification.getHomepageLinks()]));
        container.push(new TabDataElement().setLinkValues(["Landing Page:",qualification.getLandingPageLinks()]));
        container.push(new TabDataElement().setValues(["Release/Publication Date:", [qualification.issued]]));
        container.push(new TabDataElement().setValues(["Modification Date:", [qualification.modified]]));
        container.push(new TabDataElement().setValues(["Status:", [qualification.status]]));

        container.push(new TabDataElement().setValues(["Awarding Started", [qualification.awardingStarted]]));
        container.push(new TabDataElement().setValues(["Awarding Ended", [qualification.awardingEnded]]));
        container.push(new TabDataElement().setValues(["Awarding Location",qualification.getAwardingLocations(lang)]));
        if (qualification.awardingBody && qualification.awardingBody.names) {
            var awardingBody: TabDataElement[] = [];
            awardingBody.push(new TabDataElement().setValues(["Name:", qualification.awardingBody.getNames(lang, qualification.referenceLang)]));
            awardingBody.push(new TabDataElement().setLinkValues(["Mail:", qualification.awardingBody.getMailLinks()]));
            awardingBody.push(new TabDataElement().setLinkValues(["Homepage:", qualification.awardingBody.getPageLinks()]));
            container.push(new TabDataElement().setElementsGroup(awardingBody).setElementsGroupTitle("Awarding Body").setIsBordered());
        }
        if (qualification.owner && qualification.owner.names) {
            var owner: TabDataElement[] = [];
            owner.push(new TabDataElement().setValues(["Name:", qualification.owner.getNames(lang, qualification.referenceLang)]));
            owner.push(new TabDataElement().setLinkValues(["Mail:", qualification.owner.getMailLinks()]));
            owner.push(new TabDataElement().setLinkValues(["Homepage:", qualification.owner.getPageLinks()]));
            container.push(new TabDataElement().setElementsGroup(owner).setElementsGroupTitle("Owner").setIsBordered());
        }
        if (qualification.provenanceAgent && qualification.provenanceAgent.names) {
            var provenanceAgent: TabDataElement[] = [];
            provenanceAgent.push(new TabDataElement().setValues(["Name:", qualification.provenanceAgent.getNames(lang, qualification.referenceLang)]));
            provenanceAgent.push(new TabDataElement().setLinkValues(["Mail:", qualification.provenanceAgent.getMailLinks()]));
            provenanceAgent.push(new TabDataElement().setLinkValues(["Homepage:", qualification.provenanceAgent.getPageLinks()]));
            container.push(new TabDataElement().setElementsGroup(provenanceAgent).setElementsGroupTitle("Provenance Agent").setIsBordered());
        }
        if (qualification.publisher && qualification.publisher.names) {
            var publisher: TabDataElement[] = [];
            publisher.push(new TabDataElement().setValues(["Name:", qualification.publisher.getNames(lang, qualification.referenceLang)]));
            publisher.push(new TabDataElement().setLinkValues(["Mail:", qualification.publisher.getMailLinks()]));
            publisher.push(new TabDataElement().setLinkValues(["Homepage:", qualification.publisher.getPageLinks()]));
            container.push(new TabDataElement().setElementsGroup(publisher).setElementsGroupTitle("Publisher").setIsBordered());
        }
        data.push( new TabDataElement()
            .setElementsGroup(container)
            .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang)));
        // container.push( new TabDataElement().setValues(["Trusted: ", [qualification.trusted]]));
        return data;
    }

    static accreditationRecognition(index:number, qualification: Qualification, lang:String): TabData {
        let data = new TabData("Qualification Framework/Accreditation", index);

        if (qualification.qualificationFrameworks) for (let qf of qualification.qualificationFrameworks) {
            var noEqf = true;
            if (qf.trusted == "true") {
                var qfValues: TabDataElement[] = [];
                qfValues.push(new TabDataElement().setValues(["Description: ", qf.getDescriptions(lang, qualification.referenceLang)]));
                qfValues.push(new TabDataElement().setValues(["Issued:", [qf.issued]]));
                //qfValues.push(new TabDataElement().setLinkValues(["Target Framework:",[qf.targetFrameWork]]));
                qfValues.push(new TabDataElement().setValues(["Target Framework Version:", [qf.targetFrameworkVersion]]));
                qfValues.push(new TabDataElement().setValues(["EQF:", qf.getTargetLabels(lang, qualification.referenceLang)]));
                qfValues.push(new TabDataElement().setValues(["Target Description: ", qf.getTargetDescriptions(lang, qualification.referenceLang)]));
                qfValues.push(new TabDataElement().setValues(["Target Notation:", qf.targetNotations]));
                qfValues.push(new TabDataElement().setValues(["Target Name: ", qf.getTargetNames(lang, qualification.referenceLang)]));
                qfValues.push(new TabDataElement().setValues(["Target URL:", [qf.targetUrl]]));
                qfValues.push(new TabDataElement().setLinkValues(["Homepage:", qf.getHomepageLinks()]));
                if (qf.publisher) {
                    qfValues.push(new TabDataElement().setValues(["Publisher Name:", qf.publisher.getNames(lang, qualification.referenceLang)]));
                    qfValues.push(new TabDataElement().setLinkValues(["Publisher Mail :", qf.publisher.getMailLinks()]));
                    qfValues.push(new TabDataElement().setLinkValues(["Publisher Homepage :", qf.publisher.getPageLinks()]));
                }
                // qfValues.push(new TabDataElement().setValues(["Trusted:", [qf.trusted]]));
                let title = qf.target ? "European Qualification Framework" : "National Qualification Framework";
                data.push(new TabDataElement()
                    .setElementsGroup(qfValues)
                    .setElementsGroupTitle(title)
                    .setSource(qf.publisher.getAgentInformationTriple(lang, qualification.referenceLang))
                    .setIsBordered());
                if (qf.target) {
                    noEqf = false;
                    data.putLastElementInFront();
                }
            }
        }
        if (noEqf) {
            var qfValues: TabDataElement[] = [];
            qfValues.push(new TabDataElement().setValues(["", ["No information given/Not applicable"]]));
            data.push(new TabDataElement()
                .setElementsGroup(qfValues)
                .setElementsGroupTitle("European Qualification Framework")
                .setSourceColumnCssClass("source-column-none")
                .setIsBordered());
        }

        if (qualification.accreditations) for (let acc of qualification.accreditations) {
            if (acc.trusted == "true") {
                var accValues: TabDataElement[] = [];

                if (acc.recognizedBody) {
                    accValues.push(new TabDataElement().setValues(["Recognized Awarding Body: ", acc.recognizedBody.getNames(lang, qualification.referenceLang)]));
                    accValues.push(new TabDataElement().setLinkValues(["Recognized Awarding Body Mail:", acc.recognizedBody.getMailLinks()]));
                    accValues.push(new TabDataElement().setLinkValues(["Recognized Awarding Body Homepage :", acc.recognizedBody.getPageLinks()]));
                }
                if (acc.recognizingAgent) {
                    accValues.push(new TabDataElement().setValues(["Recognizer Name: ", acc.recognizingAgent.getNames(lang, qualification.referenceLang)]));
                    accValues.push(new TabDataElement().setLinkValues(["Recognizer Mail:", acc.recognizingAgent.getMailLinks()]));
                    accValues.push(new TabDataElement().setLinkValues(["Recognizer Homepage :", acc.recognizingAgent.getPageLinks()]));
                }
                accValues.push(new TabDataElement().setValues(["Issued:", [acc.issued]]));
                accValues.push(new TabDataElement().setValues(["Review Date:", [acc.reviewDate]]));
                accValues.push(new TabDataElement().setValues(["End Date:", [acc.endDate]]));

                accValues.push(new TabDataElement().setLinkValues(["Homepage:", acc.getHomepageLinks()]));
                accValues.push(new TabDataElement().setLinkValues(["Landing Page:", acc.getlandingPageLinks()]));
                accValues.push(new TabDataElement().setLinkValues(["Supplementary Documents:", acc.getsupplementaryDocLinks()]));
                // accValues.push(new TabDataElement().setValues(["Trusted:", [acc.trusted]]));

                data.push(new TabDataElement()
                    .setElementsGroup(accValues)
                    .setElementsGroupTitle("Accreditation")
                    .setSource(acc.recognizingAgent.getAgentInformationTriple(lang, qualification.referenceLang))
                    .setIsBordered());
            }
        }
        return data;
    }

    static learningOutcomes(index:number, qualification: Qualification, lang:String): TabData {

        let data = new TabData("Learning outcomes", index);

        data.push(new TabDataElement().setSectionHeader("Descriptions"));
        var container1: TabDataElement[] = [];
        var descArray = [];
        descArray.push(new TabDataElement().setValues(["",qualification.getDescriptions(lang)]));
        container1.push(new TabDataElement().setElementsGroup(descArray).setIsBordered());
        data.push( new TabDataElement()
            .setElementsGroup(container1)
            .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang)));


        if (qualification.learningOutcomes) {
            data.push(new TabDataElement().setSectionHeader("Connected skills"));
            var container2: TabDataElement[] = [];
            for (let skill of qualification.learningOutcomes) {
                var skillValues: TabDataElement[] = [];
                skillValues.push(new TabDataElement().setLinkValues(["", [skill.getSkillLink(lang, qualification.referenceLang)]]));
                skillValues.push(new TabDataElement().setValues(["", skill.getDescriptions(lang, qualification.referenceLang)]));
                container2.push(new TabDataElement().setElementsGroup(skillValues).setIsBordered());
            }
            data.push(new TabDataElement()
                .setElementsGroup(container2)
                .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang)));
        }
        return data;
    }

    static description(index:number, qualification: Qualification, lang:String) {
        let data = new TabData("Additional Notes", index);

        data.push(new TabDataElement().setSectionHeader(data.name));

        var container: TabDataElement[] = [];

        var additArray = [];
        additArray.push(new TabDataElement().setValues(["",qualification.getAdditionalNotes(lang)]));
        container.push(new TabDataElement().setElementsGroup(additArray).setIsBordered());

        container.push(new TabDataElement().setLinkValues(["Supplementary Documents:",qualification.getSupplementaryDocLinks()]));
        container.push( new TabDataElement().setValues(["Change Notes:", qualification.getChangeNotes(lang)]));
        container.push( new TabDataElement().setValues(["History Notes:", qualification.getHistoryNotes(lang)]));

        data.push(new TabDataElement()
            .setElementsGroup(container)
            .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang)));
        return data;
    }
}