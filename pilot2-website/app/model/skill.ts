
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

}