import { Nickname } from './nickname.mjs';

export class Team {
    #manager;
    #socket;
    #name;
    #energy;
    #score;
    #teamUI;

    #powerPlants = [];
    #buildings = [];
    #units = [];

    constructor(_manager, _socket, _energy) {
        this.#manager = _manager;
        this.#socket = _socket;
        this.#name = new Nickname(_socket);
        this.#energy = _energy;
        this.#score = _energy;

        this.#teamUI = new TeamUI(_name, _energy, this.#score);
    }

    getNickname() {
        return this.#name.getNickname();
    }

    modifyEnergy(delta) {
        this.#energy += delta;
        this.#teamUI.refresh(this.getPredictedValue(), this.#energy, this.#score);
    }

    getEnergy() {
        return this.#energy;
    }

    modifyScore(delta) {
        this.#score += delta;
        this.#score = this.#score.toFixed(1);
        this.#teamUI.refresh(this.getPredictedValue(), this.#energy, this.#score);
    }

    getScore() {
        return this.#score;
    }

    buildPowerPlant(pos, powerPlant) {
        let entity = new powerPlant(pos, this, this.#manager.getWorld(), 0);
        this.#manager.getWorld().setEntity(pos, entity);
        this.#powerPlants.push(entity);
        console.log(entity.getCost());
        this.modifyEnergy(-entity.getCost());
    }

    buildBuilding(building) {
        this.#buildings.push(building);
        this.modifyEnergy(-building.getCost());
    }

    destroy(entity) {
        let index = this.#powerPlants.indexOf(entity);
        this.#powerPlants.splice(index, 1);
        this.modifyScore(-entity.getCost()/2);
    }

    getPredictedValue() {
        return this.#powerPlants.reduce((prev, plant) => {
            return prev + Number(plant.getEarn());
        }, 0);
    }

    settle() {
        this.#powerPlants.forEach((plant) => {

            let generatedEnergy = Number(plant.generate());
            this.modifyEnergy(Number(plant.generate()));

            if (plant.getType() === 'thermal') {
                this.#manager.getWorld().increaseTemp();
                this.modifyScore(generatedEnergy/2);
            } else {
                this.modifyScore(generatedEnergy);
            }

        });
    }

    getUI() {
        return this.#teamUI;
    }
}

class TeamUI {

    #teamDiv;

    #nameTitle;
    #predictedP;
    #energyP;
    #scoreP;

    constructor(_name, energy, score) {
        this.#teamDiv = document.createElement('div');
        this.#teamDiv.classList.add('teamDiv');

        this.#nameTitle = document.createElement('h1');
        this.#predictedP = document.createElement('p');
        this.#energyP = document.createElement('p');
        this.#scoreP = document.createElement('p');

        this.#teamDiv.append(this.#nameTitle);
        this.#teamDiv.append(this.#predictedP);
        this.#teamDiv.append(this.#energyP);
        this.#teamDiv.append(this.#scoreP);

        this.refresh(0, energy, score);
    }

    refresh(predicted, energy, score) {
        this.#predictedP.innerText = `발전량: ${predicted}`;
        this.#energyP.innerText = `에너지: ${energy}`;
        this.#scoreP.innerText = `점수: ${score}`;
    }

    getDiv() {
        return this.#teamDiv;
    }
}