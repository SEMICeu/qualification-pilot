
import {Skill} from "./skill";
export class LearningOutcome {


    constructor(uri: String, skill: Skill) {
        this.uri = uri;
        this.skill = skill;
    }

    uri:String;
    skill: Skill;

}