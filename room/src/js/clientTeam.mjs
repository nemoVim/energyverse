import { SkillTree } from '../../../src/js/skillTree.mjs';
import { Timer } from './timer.mjs';
export class ClientTeam {

    static initEnergy = 50;
    static turnEnergy = 10;
    static initSkills = [0, 1, 2];

    #index;
    #name;
    #socket;
    #earn;
    #energy;
    #score;
    #learned;
    #researching;
    #skillTree;
    #timer;

    constructor(_name, _index, _socket = null) {
        this.#name = _name;
        this.#index = _index;
        this.#socket = _socket;
        this.#earn = ClientTeam.turnEnergy;
        this.#energy = ClientTeam.initEnergy;
        this.#score = ClientTeam.initEnergy;
        this.#learned = new Set([...ClientTeam.initSkills]);
        this.#researching = new Set();
        this.#skillTree = new SkillTree(_index, this);
        this.#timer = new Timer();
    }

    getName() {
        return this.#name;
    }

    getIndex() {
        return this.#index;
    }

    getSocket() {
        return this.#socket;
    }

    setEarn(_earn) {
        this.#earn = Number(_earn);
    }

    getEarn() {
        return this.#earn;
    }

    setEnergy(_energy) {
        this.#energy = Number(_energy);
    }

    modifyEnergy(delta) {
        this.#energy += Number(delta);
    }

    getEnergy() {
        return this.#energy;
    }

    setScore(_score) {
        this.#score = Number(_score);
    }
    
    modifyScore(delta) {
        this.#score += Math.ceil(Number(delta));
    }

    getScore() {
        return this.#score;
    }

    getLearned() {
        return this.#learned;
    }

    setResearching(_researching) {
        this.#researching = new Set(_researching);
        this.#researching.forEach(index => {
            this.#skillTree.research(index);
        });
    }

    getResearching() {
        return this.#researching;
    }

    getSkillTree() {
        return this.#skillTree;
    }

    getSkillTreeUI() {
        return this.#skillTree.getUI();
    }

    getTimer() {
        return this.#timer;
    }

    research(index) {
        this.#researching.add(index);
        this.#skillTree.research(index);
    }

    unResearch(index) {
        this.#researching.delete(index);
        this.#skillTree.unResearch(index);
    }

    learn() {
        this.#researching.forEach(index => {
            this.#learned.add(index);
            this.#researching.delete(index);
            this.#skillTree.learn(index);
        });
    }

}