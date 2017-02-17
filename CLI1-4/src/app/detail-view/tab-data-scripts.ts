import {TabData} from "./tab-data";
import {Qualification} from "../model/qms/qualification";
import {TabDataElement} from "./tab-data-element";
export class TabDataScripts {

  static core(index:number, qualification: Qualification, lang:string): TabData {
    let data = new TabData("Core", index);
    data.push(new TabDataElement().setSectionHeader(data.name));

    let container: TabDataElement[] = [];
    container.push(new TabDataElement().setValues(["Title:", qualification.getPrefLabels(lang)]));
    container.push(new TabDataElement().setValues(["Alternative title:", qualification.getAltLabels(lang)]));
    container.push(new TabDataElement().setValues(["Reference Language:", qualification.getReferenceLangLabels(lang)]));
    container.push(new TabDataElement().setValues(["Test",null]));
    container.push(new TabDataElement().setValues(["Subject:",qualification.getISCEDFcode(lang)]));
    container.push(new TabDataElement().setValues(["ECTS credits:", [qualification.eCTSCredits]]));
    container.push(new TabDataElement().setValues(["Volume of learning:", [qualification.volumeOfLearning]]));
    // container.push(new TabDataElement().setValues(["Is Partial Qualification:", [qualification.isPartialQualification]]));

    var waysToAcquire: string[] = [];
    if (qualification.getWaysToAcquire(lang)) {
      qualification.getWaysToAcquire(lang).forEach(way => waysToAcquire.push(this.capitalize(way)));
      container.push(new TabDataElement().setValues(["Ways to Acquire:", waysToAcquire]));
    }


    let entryReqs:string[] = [];
    if (qualification.entryRequirements) {
      for (let entryReq of qualification.entryRequirements) {
        entryReqs.push("<strong>" + this.capitalize(entryReq[1]) + ":</strong> " + this.capitalize(entryReq[0]));
      }
    }
    container.push(new TabDataElement().setValues(["Entry Requirement:", entryReqs]));

    container.push(new TabDataElement().setValues(["Expiry Period:",[qualification.expiryPeriod]]));
    container.push(new TabDataElement().setLinkValues(["Homepage:",qualification.getHomepageLinks()]));
    container.push(new TabDataElement().setLinkValues(["Landing Page:",qualification.getLandingPageLinks()]));
    container.push(new TabDataElement().setValues(["Release/Publication Date:", [qualification.issued]]));
    container.push(new TabDataElement().setValues(["Modification Date:", [qualification.modified]]));
    container.push(new TabDataElement().setValues(["Status:", [this.capitalize(qualification.status)]]));

    container.push(new TabDataElement().setValues(["Awarding Started:", [qualification.awardingStarted]]));
    container.push(new TabDataElement().setValues(["Awarding Ended:", [qualification.awardingEnded]]));

    let awardingLocations: string[] = qualification.getAwardingLocations(lang);
    if (awardingLocations) for (var i = 0; i < awardingLocations.length; ++i) {
      awardingLocations[i] = this.capitalize(awardingLocations[i].toLowerCase());
    }
    container.push(new TabDataElement().setValues(["Awarding Location:", awardingLocations]));
    if (qualification.owner && qualification.owner.names) {
      let owner: TabDataElement[] = [];
      owner.push(new TabDataElement().setValues(["Name:", qualification.owner.getNames(lang, qualification.referenceLang)]));
      owner.push(new TabDataElement().setLinkValues(["Mail:", qualification.owner.getMailLinks()]));
      owner.push(new TabDataElement().setLinkValues(["Homepage:", qualification.owner.getPageLinks()]));
      container.push(new TabDataElement().setElementsGroup(owner).setElementsGroupTitle("Owner").setIsBordered());
    }
    if (qualification.provenanceAgent && qualification.provenanceAgent.names) {
      let provenanceAgent: TabDataElement[] = [];
      provenanceAgent.push(new TabDataElement().setValues(["Name:", qualification.provenanceAgent.getNames(lang, qualification.referenceLang)]));
      provenanceAgent.push(new TabDataElement().setLinkValues(["Mail:", qualification.provenanceAgent.getMailLinks()]));
      provenanceAgent.push(new TabDataElement().setLinkValues(["Homepage:", qualification.provenanceAgent.getPageLinks()]));
      container.push(new TabDataElement().setElementsGroup(provenanceAgent).setElementsGroupTitle("Provenance Agent").setIsBordered());
    }
    if (qualification.publisher && qualification.publisher.names) {
      let publisher: TabDataElement[] = [];
      publisher.push(new TabDataElement().setValues(["Name:", qualification.publisher.getNames(lang, qualification.referenceLang)]));
      publisher.push(new TabDataElement().setLinkValues(["Mail:", qualification.publisher.getMailLinks()]));
      publisher.push(new TabDataElement().setLinkValues(["Homepage:", qualification.publisher.getPageLinks()]));
      container.push(new TabDataElement().setElementsGroup(publisher).setElementsGroupTitle("Publisher").setIsBordered());
    }
    data.push( new TabDataElement()
      .setElementsGroup(container)
      .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang), qualification.getSourceDistributionPage()));
    // container.push( new TabDataElement().setValues(["Trusted: ", [qualification.trusted]]));
    if (qualification.awardingBodies) for (let awardingBody of qualification.awardingBodies) {
      if (awardingBody.names) {
        let ABElement: TabDataElement[] = [];
        ABElement.push(new TabDataElement().setValues(["Name:", awardingBody.getNames(lang, qualification.referenceLang)]));
        ABElement.push(new TabDataElement().setLinkValues(["Mail:", awardingBody.getMailLinks()]));
        ABElement.push(new TabDataElement().setLinkValues(["Homepage:", awardingBody.getPageLinks()]));
        data.push(new TabDataElement()
          .setElementsGroup(ABElement)
          .setElementsGroupTitle("Awarding Body")
          .setIsBordered()
          .setSource(awardingBody.publisher.names ?
              awardingBody.publisher.getAgentInformationTriple(lang, qualification.referenceLang) :
              qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang),
            awardingBody.sourceDistributionPage ?
              awardingBody.getSourceDistributionPage() :
              qualification.getSourceDistributionPage())
        );
      }
    }
    return data;
  }

  static accreditationRecognition(index:number, qualification: Qualification, lang:string): TabData {
    let qfValues: TabDataElement[];
    let data = new TabData("Qualification Framework/Accreditation", index);

    let noEqf = true;

    if (qualification.qualificationFrameworks) for (let qf of qualification.qualificationFrameworks) {
      if (qf.trusted == "true" && (noEqf || !qf.target)) {
        qfValues = [];
        qfValues.push(new TabDataElement().setValues(["Description: ", qf.getDescriptions(lang, qualification.referenceLang)]));
        qfValues.push(new TabDataElement().setValues(["Issued:", [qf.issued]]));
        //qfValues.push(new TabDataElement().setLinkValues(["Target Framework:",[qf.targetFrameWork]]));
        qfValues.push(new TabDataElement().setValues(["Target Framework Version:", [qf.targetFrameworkVersion]]));
        qfValues.push(new TabDataElement().setValues(["EQF level:", qf.getTargetLabels(lang, qualification.referenceLang)]));
        qfValues.push(new TabDataElement().setValues(["Framework Description: ", qf.getTargetDescriptions(lang, qualification.referenceLang)]));
        qfValues.push(new TabDataElement().setValues(["NQF level:", qf.targetNotations]));
        qfValues.push(new TabDataElement().setValues(["Framework name: ", qf.getTargetNames(lang, qualification.referenceLang)]));
        qfValues.push(new TabDataElement().setValues(["Framework URL:", [qf.targetUrl]]));
        qfValues.push(new TabDataElement().setLinkValues(["Homepage:", qf.getHomepageLinks()]));
        // if (qf.publisher) {
        //     qfValues.push(new TabDataElement().setValues(["Publisher Name:", qf.publisher.getNames(lang, qualification.referenceLang)]));
        //     qfValues.push(new TabDataElement().setLinkValues(["Publisher Mail :", qf.publisher.getMailLinks()]));
        //     qfValues.push(new TabDataElement().setLinkValues(["Publisher Homepage :", qf.publisher.getPageLinks()]));
        // }
        // qfValues.push(new TabDataElement().setValues(["Trusted:", [qf.trusted]]));
        let title = qf.target ? "European Qualification Framework" : "National Qualification Framework";
        data.push(new TabDataElement()
          .setElementsGroup(qfValues)
          .setElementsGroupTitle(title)
          .setSource(qf.publisher.getAgentInformationTriple(lang, qualification.referenceLang), qf.getSourceDistributionPage())
          .setIsBordered());
        if (qf.target) {
          noEqf = false;
          data.putLastElementInFront();
        }
      }
    }
    if (noEqf) {
      qfValues = [];
      qfValues.push(new TabDataElement().setValues(["", ["No information given/Not applicable"]]));
      data.push(new TabDataElement()
        .setElementsGroup(qfValues)
        .setElementsGroupTitle("European Qualification Framework")
        .setSourceColumnCssClass("source-column-none")
        .setIsBordered());
    }

    if (qualification.accreditations) {
      data.push(new TabDataElement().setSectionHeader("Accreditation"));
      for (let acc of qualification.accreditations) {
        if (acc.trusted == "true" &&
          acc.recognizingAgent &&
          acc.recognizingAgent.getNames(lang, qualification.referenceLang) &&
          acc.recognizingAgent.getNames(lang, qualification.referenceLang).length>0) {
          let accValues: TabDataElement[] = [];

          if (acc.recognizingAgent) {
            // accValues.push(new TabDataElement().setValues(["Recognizer Name: ", acc.recognizingAgent.getNames(lang, qualification.referenceLang)]));
            accValues.push(new TabDataElement().setLinkValues(["Mail:", acc.recognizingAgent.getMailLinks()]));
            accValues.push(new TabDataElement().setLinkValues(["Homepage :", acc.recognizingAgent.getPageLinks()]));
          }
          if (acc.recognizedBody) {
            accValues.push(new TabDataElement().setValues(["Recognized Awarding Body: ", acc.recognizedBody.getNames(lang, qualification.referenceLang)]));
            accValues.push(new TabDataElement().setLinkValues(["Recognized Awarding Body Mail:", acc.recognizedBody.getMailLinks()]));
            accValues.push(new TabDataElement().setLinkValues(["Recognized Awarding Body Homepage :", acc.recognizedBody.getPageLinks()]));
          }
          accValues.push(new TabDataElement().setValues(["Issue date:", [acc.issued]]));
          accValues.push(new TabDataElement().setValues(["Review Date:", [acc.reviewDate]]));
          accValues.push(new TabDataElement().setValues(["End Date:", [acc.endDate]]));

          accValues.push(new TabDataElement().setLinkValues(["Homepage:", acc.getHomepageLinks()]));
          accValues.push(new TabDataElement().setLinkValues(["Landing Page:", acc.getLandingPageLinks()]));
          accValues.push(new TabDataElement().setLinkValues(["Supplementary Documents:", acc.getSupplementaryDocLinks()]));
          // accValues.push(new TabDataElement().setValues(["Trusted:", [acc.trusted]]));

          data.push(new TabDataElement()
            .setElementsGroup(accValues)
            .setElementsGroupTitle(acc.recognizingAgent.getNames(lang, qualification.referenceLang)[0])
            .setSource(acc.publisher.getAgentInformationTriple(lang, qualification.referenceLang), acc.getSourceDistributionPage())
            .setIsBordered());
        }
      }
    }
    return data;
  }

  static learningOutcomes(index:number, qualification: Qualification, lang:string): TabData {

    let data = new TabData("Descriptions", index);

    data.push(new TabDataElement().setSectionHeader(data.name));

    let container1: TabDataElement[] = [];
    container1.push(new TabDataElement().setValues(["Definition:", qualification.getDefinitions(lang)]));
    let descArray = [];
    //descArray.push(new TabDataElement().setValues(["Description:",qualification.getDescriptions(lang)]));

    descArray.push(new TabDataElement().setAnnotatedList(["Annotated:",qualification.getDescriptionAnnotations(lang)]));

    container1.push(new TabDataElement().setElementsGroup(descArray).setIsBordered());
    data.push( new TabDataElement()
      .setElementsGroup(container1)
      .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang), qualification.getSourceDistributionPage()));

    if (qualification.learningOutcomes) {
      data.push(new TabDataElement().setSectionHeader("Connected skills"));
      let container2: TabDataElement[] = [];
      for (let skill of qualification.learningOutcomes) {
        let skillValues: TabDataElement[] = [];
        skillValues.push(new TabDataElement().setLinkValues(["", [skill.getSkillLink(lang, qualification.referenceLang)]]));
        skillValues.push(new TabDataElement().setValues(["", skill.getDescriptions(lang, qualification.referenceLang)]));
        container2.push(new TabDataElement().setElementsGroup(skillValues).setIsBordered());
      }
      data.push(new TabDataElement()
        .setElementsGroup(container2)
        .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang), qualification.getSourceDistributionPage()));
    }
    return data;
  }

  static additional(index:number, qualification: Qualification, lang:string) {
    let data = new TabData("Additional Notes", index);

    data.push(new TabDataElement().setSectionHeader(data.name));

    let container: TabDataElement[] = [];

    let additionalArray = [];
    additionalArray.push(new TabDataElement().setValues(["Additional note",qualification.getAdditionalNotes(lang)]));
    container.push(new TabDataElement().setElementsGroup(additionalArray).setIsBordered());

    container.push(new TabDataElement().setLinkValues(["Supplementary Documents:",qualification.getSupplementaryDocLinks()]));
    container.push( new TabDataElement().setValues(["Change Notes:", qualification.getChangeNotes(lang)]));
    container.push( new TabDataElement().setValues(["History Notes:", qualification.getHistoryNotes(lang)]));

    data.push(new TabDataElement()
      .setElementsGroup(container)
      .setSource(qualification.publisher.getAgentInformationTriple(lang, qualification.referenceLang), qualification.getSourceDistributionPage()));

    container.push(new TabDataElement()
      .setElementsGroup([new TabDataElement().setValues(["", ["&nbsp;"]])])
      .setElementsGroupTitle("Qualification Assurance Document")
      .setIsBordered());

    return data;
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
