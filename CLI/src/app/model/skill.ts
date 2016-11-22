
import {Link} from "./link";
export class Skill {


    constructor(uri: String) {
        this.uri = uri;
    }

    uri: String;
    prefLabels: Map<String, String[]>;
    descriptions: Map<String, String[]>;

    getPrefLabels(prefLang: String, refLang:String[]): String[] {
        if (!this.prefLabels) return null;
        if (this.prefLabels.has(prefLang)) return this.prefLabels.get(prefLang);
        if (this.prefLabels.has("en")) return this.prefLabels.get("en");
        for (let lang of refLang) {
            if (this.prefLabels.has(lang)) return this.prefLabels.get(lang);
        }
        return null;
    }
    getSkillLink (prefLang: String, refLang:String[]): Link {
        if (this.prefLabels) return new Link (this.uri, this.getPrefLabels(prefLang, refLang)[0]);
    }
    getDescriptions(prefLang: String, refLang:String[]): String[] {
        if (!this.descriptions) return null;
        if (this.descriptions.has(prefLang)) return this.descriptions.get(prefLang);
        if (this.descriptions.has("en")) return this.descriptions.get("en");
        for (let lang of refLang) {
            if (this.descriptions.has(lang)) return this.descriptions.get(lang);
        }
        return null;
    }

}