import { Skills } from '../../../src/js/skills.mjs';
import { SkillTreeUI } from '../../../src/js/skillTreeUI.mjs';
import { Status } from '../../../src/js/status.mjs';

export class Team {

    static initEnergy = 50;
    static turnEnergy = 10;
    static initSkills = [0, 1, 2];

    #socket;
    #name;
    #energy;
    #score;
    #teamUI;

    #buildings = [];

    #status;

    #skills;

    #researching = [];

    #skillTreeUI;

    constructor(_socket, _name) {
        this.#socket = _socket;
        this.#name = _name;
        this.#energy = Team.initEnergy;
        this.#score = Team.initEnergy;

        this.#status = new Status();
        this.#skills = Team.initSkills;

        this.#skillTreeUI = new SkillTreeUI();

        for (let index of this.#skills) {
            Skills[index].useAbility(this.#status);
        }

        this.#teamUI = new TeamUI(_name, Team.initEnergy, this.#score);

        this.#teamUI.refresh(this.getPredictedValue(), this.#energy, this.#score);
    }

    getNickname() {
        return this.#name;
    }

    modifyEnergy(delta) {
        this.#energy += delta;
        this.refresh();
    }

    getEnergy() {
        return this.#energy;
    }

    modifyScore(delta) {
        this.#score += delta;
        this.#score = this.#score.toFixed(1);
        this.refresh();
    }

    getScore() {
        return this.#score;
    }

    getStatus() {
        return this.#status;
    }

    getSkills() {
        return this.#skills;
    }

    // ----------------------------------------------

    refresh() {
        this.#socket.emit('refresh', [this.#name, this.#energy, this.#score]);
        this.#teamUI.refresh(this.getPredictedValue(), this.#energy, this.#score);
    }

    // --------------------------------------------

    build(building) {
        this.#buildings.push(building);
        if (this.#status.hasProbe(32)) {
            this.modifyEnergy(-building.getCost()+5);
        } else {
            this.modifyEnergy(-building.getCost());
        }
    }

    produce(unit) {
        this.#units.push(unit);
        if (this.#status.hasFactory(2) && unit.getType() === 'probe') {
            this.modifyEnergy(-unit.getCost()+3);
        } else if (this.#status.hasFactory(4) && unit.getType() !== 'probe') {
            this.modifyEnergy(-unit.getCost()+3);
        } else {
            this.modifyEnergy(-unit.getCost());
        }
    }

    destroy(entity) {
        this.modifyScore(+entity.getCost()/2);
    }

    destroyed(entity) {

        if (entity instanceof Unit) {
            const index = this.#units.indexOf(entity);
            this.#units.splice(index, 1);
        } else if (entity instanceof Building) {
            const index = this.#buildings.indexOf(entity);
            this.#buildings.splice(index, 1);
        }

        this.modifyScore(-entity.getCost()/2);
    }

    research(index) {
        const skill = Skills[index];
        this.#skills.push(skill.getSerial());
        this.modifyEnergy(-skill.getCost());
    }

    // ----------------------------------------------

    getPredictedValue() {
        return this.#buildings.reduce((prev, plant) => {
            if (!(plant instanceof PowerPlant)) return prev;
            return prev + Number(plant.getEarn());
        }, 0);
    }

    learn() {
        this.#researching.forEach(index => {
            Skills[index].useAbility(this.#status);
        });
    }

    generate() {
        this.#buildings.forEach((plant) => {

            if (!(plant instanceof PowerPlant)) return;

            let generatedEnergy = Number(plant.generate());

            this.modifyEnergy(generatedEnergy);

            if (plant.getType() === 'thermal') {
                this.#socket.emit('thermal', plant.getFuel().getPos());
                this.modifyScore(generatedEnergy/2);
            } else {
                this.modifyScore(generatedEnergy);
            }

        });
    }

    settle() {

        this.generate();
        this.learn();

        this.modifyEnergy(Team.turnEnergy);
        this.modifyScore(Team.turnEnergy);

        this.#socket.emit('doneSettle');
    }
}

class TeamUI {

    #predictedP;
    #energyP;
    #scoreP;

    constructor(_name, energy, score) {

        this.#predictedP = document.getElementById('predictedP');
        this.#energyP = document.getElementById('energyP');
        this.#scoreP = document.getElementById('scoreP');

        this.refresh(0, energy, score);
    }

    refresh(predicted, energy, score) {
        this.#predictedP.innerText = `발전량: ${predicted}`;
        this.#energyP.innerText = `에너지: ${energy}`;
        this.#scoreP.innerText = `점수: ${score}`;
    }
}