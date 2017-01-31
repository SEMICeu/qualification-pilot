import {Agent} from "./agent";
import {Link} from "../link";
export class Accreditation {

  constructor(uri: string) {
    this.uri = uri;
  }

  uri: string;
  recognizedBody: Agent;
  recognizingAgent: Agent;
  issued: string;
  reviewDate: string;
  endDate: string;
  homepages: string[];
  landingPages: string[];
  supplementaryDocs: string[];
  subjects: string[];
  trusted: string;
  publisher: Agent;
  sourceDistributionPage: string;

  getHomepageLinks(): Link[] {
    if (!this.homepages) return null;
    let links: Link[] = [];
    for (let url of this.homepages) {
      links.push(new Link(url, url));
    }
    return links;
  }

  getLandingPageLinks(): Link[] {
    if (!this.landingPages) return null;
    let links: Link[] = [];
    for (let url of this.landingPages) {
      links.push(new Link(url, url));
    }
    return links;
  }

  getSupplementaryDocLinks(): Link[] {
    if (!this.supplementaryDocs) return null;
    let links: Link[] = [];
    for (let url of this.supplementaryDocs) {
      links.push(new Link(url, url));
    }
    return links;
  }

  getSourceDistributionPage(): Link {
    if (!this.sourceDistributionPage) return null;

    var link = this.sourceDistributionPage;
    if (!this.sourceDistributionPage.startsWith("http://")) {
      link = "http://" + link;
    }
    let name = this.sourceDistributionPage
      .replace(/%20/g, " ")
      .replace("cogni.zone/qpilot2/", " ")
      .replace("http://", "");

    return new Link(link, "Source: " + name);
  }
}
