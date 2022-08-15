import { Status } from '../../../src/js/status.mjs';
import { Skills } from '../../../src/js/skills.mjs';

export class DummyTeam {

    static initEnergy = 50;
    static turnEnergy = 10;
    static initSkills = [0, 1, 2];

    #name;
    #predict;
    #energy;
    #score;
    #skills;
    #researching = [];
    #status;

    constructor(_name) {
        this.#name = _name;
        this.#predict = 0;
        this.#energy = DummyTeam.initEnergy;
        this.#score = DummyTeam.initEnergy;
        this.#skills = DummyTeam.initSkills;
        this.#status = new Status();

        for (let index of this.#skills) {
            Skills[index].useAbility(this.#status);
        }
    }

    getNickname() {
        return this.#name;
    }

    setPredict(_predict) {
        this.#predict = _predict;
    }

    getPredict() {
        return this.#predict;
    }

    setEnergy(_energy) {
        this.#energy = _energy;
    }

    getEnergy() {
        return this.#energy;
    }

    setScore(_score) {
        this.#score = _score;
    }

    getScore() {
        return this.#score;
    }

    // setSkills(_skills) {
    //     this.#skills = _skills;
    // }

    getSkills() {
        return this.#skills;
    }

    setResearching(_researching) {
        this.#researching = _researching;
    }

    getStatus() {
        return this.#status;
    }

    research(index) {
        this.#researching.push(index);
    }

    settle() {
        this.#researching.forEach(index => {
            Skills[index].useAbility(this.#status);
            this.#skills.push(index);
        });
        this.#researching = [];
    }
}