import { Lab, PowerPlant } from '$lib/classes/buildings';

export class Player {

    static labStorage = 5;
    static defaultStorage = 40;
    static defaultEarn = 10;

    #index;
    #energy;
    #storage;
    #units;
    #unitList;
    #buildings;
    #buildingList;
    #earn;
    #tech;
    #fuel;

    constructor(index, energy, unitList, buildingList, world) {

        this.#index = index;
        this.#energy = energy;
        this.#storage = Player.defaultStorage;

        this.#units = {
            '일꾼': 0,
            '풍력 유닛': 0,
            '태양광 유닛': 0,
            '원자력 유닛': 0,
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
            ai: 0,
            grid: 0,
            hydrogen: 0,
            material: 0,
            environment: 0,
        };

        this.#buildings = {
            '공장': 0,
            '화력 발전소': 0,
            '풍력 발전소': 0,
            '태양광 발전소': 0,
            '원자력 발전소': 0,
            '연구소': 0,
        };

        this.#buildingList = [];

        buildingList.forEach(building => {
            if (building.player === this.#index) {
                this.#buildingList.push(building);
                this.#buildings[building.kr] += 1;
                if (building instanceof PowerPlant) {
                    const _earn = world.getEntity(building.pos).getEarn(world);
                    if (building.en === 'thermalPower' && _earn !== 0) {
                        // 이번 라운드에 화력 발전할 양
                        this.#fuel += 1;
                    }
                    this.#earn += _earn;
                } else if (building instanceof Lab) {
                    this.#tech[building.track] += building.floor;
                }
            }
        });

        this.#storage += Player.labStorage * this.#buildings['연구소'];

    }

    settle() {
        this.#energy += this.#earn;
        if (this.#energy > this.#storage) {
            this.#energy = this.#storage;
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
        if (this.#energy >= this.#storage) {
            this.#energy = this.#storage;
        }
    }

    get storage() {
        return this.#storage;
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