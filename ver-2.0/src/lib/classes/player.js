import { Factory, Lab, PowerPlant } from '$lib/classes/buildings';
import { checkTech } from './tech';

export class Player {

    static labEnergyStorage = 5;
    static labUnitStorage = 1;
    static defaultEnergyStorage = 40;
    static defaultUnitStorage = 1;
    static defaultEarn = 10;
    static defaultLimit = 100;

    #index;
    #energy;
    #time;
    #energyStorage;
    #unitStorage;
    #units;
    #unitList;
    #buildings;
    #buildingList;
    #earn;
    #tech;
    #fuel;

    #hydrogenLabCnt;

    constructor(index, energy, time, unitList, buildingList, world) {

        this.#index = index;
        this.#energy = energy;
        this.#time = time;
        this.#energyStorage = Player.defaultEnergyStorage;
        this.#unitStorage = Player.defaultUnitStorage;

        this.#units = {
            '일꾼': 0,
            '풍력': 0,
            '태양광': 0,
            '원자력': 0,
            '미사일': 0,
        };

        this.#unitList = [];

        unitList.forEach(unit => {
            if(unit.player === this.#index) {
                this.#unitList.push(unit);
                this.#units[unit.kr] += 1;
            }
        });

        this.#earn = Player.defaultEarn;

        this.#tech = {
            material: 0,
            hydrogen: 0,
            environment: 0,
            grid: 0,
            ai: 0,
        };

        this.#buildings = {
            '공장': 0,
            '화력': 0,
            '풍력': 0,
            '태양광': 0,
            '원자력': 0,
            '연구소': 0,
        };

        this.#buildingList = [];

        this.#hydrogenLabCnt = 0;
        this.#fuel = 0;

        buildingList.forEach(building => {
            if (building.player === this.#index) {
                if (building instanceof Lab) {
                    this.#buildingList.push(building);
                    this.#buildings[building.kr] += 1;
                    this.#tech[building.track] += building.floor;
                    if (building.track === 'hydrogen') {
                        this.#hydrogenLabCnt += 1;
                    }
                } else if (building instanceof Factory) {
                    this.#buildingList.push(building);
                    this.#buildings[building.kr] += 1;
                }
            }
        });

        buildingList.forEach(building => {
            if (building.player === this.#index) {
                if (building instanceof PowerPlant) {
                    this.#buildingList.push(building);
                    this.#buildings[building.kr] += 1;
                    const _earn = world.getEntity(building.pos).getEarn(world, this.#tech);
                    if (building.en === 'thermalPower' && _earn !== 0) {
                        // 이번 라운드에 화력 발전할 양
                        this.#fuel += 1;
                    }
                    this.#earn += _earn;
                }
            }
        });

        if (checkTech(this.#tech, 9)) {
            this.#energyStorage += Player.labEnergyStorage * this.#hydrogenLabCnt;
            this.#unitStorage += Player.labUnitStorage * this.#hydrogenLabCnt;
        }

        this.#energyStorage += Player.labEnergyStorage * this.#buildings['연구소'];
        this.#unitStorage += Player.labUnitStorage * this.#buildings['연구소'];

        if (this.#energy >= this.#energyStorage) {
            this.#energy = this.#energyStorage;
        }
    }

    settle() {
        this.#energy += this.#earn;
        if (this.#energy >= this.#energyStorage) {
            this.#energy = this.#energyStorage;
        }

        return {
            energy: this.#energy,
            fuel: this.#fuel,
        }
    }

    get index() {
        return this.#index;
    }

    get energy() {
        return this.#energy;
    }

    set energy(_energy) {
        this.#energy = _energy;
        if (this.#energy >= this.#energyStorage) {
            this.#energy = this.#energyStorage;
        }
    }

    get time() {
        return this.#time;
    }

    set time(_time) {
        this.#time = _time;
    }

    get limit() {
        const _limit = Player.defaultLimit - (new Date().getTime() - this.#time)/1000;
        if (_limit < 0) {
            return 0;
        } else {
            return _limit;
        }
    }

    get energyStorage() {
        return this.#energyStorage;
    }

    get unitStorage() {
        return this.#unitStorage;
    }

    get units() {
        return this.#units;
    }

    get unitList() {
        return this.#unitList;
    }

    get buildings() {
        return this.#buildings;
    }
    
    get buildingList() {
        return this.#buildingList;
    }

    get tech() {
        return this.#tech;
    }

    get earn() {
        return this.#earn;
    }
}