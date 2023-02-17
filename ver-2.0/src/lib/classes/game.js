import { Player } from '$lib/classes/player';
import { World } from '$lib/classes/world';
import { createBuilding } from './buildings';
import { createUnit } from './units';

export class Game {
    #title;

    #world;
    #round;
    #turn;
    #first;

    #energyList;

    #unitList;
    #buildingList;

    #playerList;

    constructor({
        title,
        energyList,
        unitList,
        buildingList,
        fuelList,
        round,
        turn,
        temp,
        first,
    }) {
        this.#title = title;

        this.#energyList = energyList;

        this.#unitList = [];
        unitList.forEach((unit) => {
            this.#unitList.push(createUnit(unit));
        });

        this.#buildingList = [];
        buildingList.forEach((building) => {
            this.#buildingList.push(createBuilding(building));
        });

        this.#world = new World();
        this.#world.initFuels(fuelList);
        this.#world.initSea(temp);
        this.#world.initEntities(this.#unitList, this.#buildingList);

        this.#round = round;
        this.#turn = turn;
        this.#first = first;

        this.#playerList = [];

        for (let i = first; i < first + 6; i++) {
            if (i >= 6) {
                i -= 6;
            }

            this.#playerList.push(
                new Player(
                    i,
                    energyList[i],
                    this.#unitList,
                    this.#buildingList,
                    this.#world,
                )
            );
        }
    }

    get title() {
        return this.#title;
    }

    get unitList() {
        return this.#unitList;
    }

    get buildingList() {
        return this.#buildingList;
    }

    get round() {
        return this.#round;
    }

    get turn() {
        return this.#turn;
    }

    get first() {
        return this.#first;
    }

    get playerList() {
        return this.#playerList;
    }

    get world() {
        return this.#world;
    }

    get gameObj() {
        // const { unitList, buildingList } = this.#world.getEntities();
        const energyList = this.#energyList;
        this.#playerList.forEach((player) => {
            energyList[player.index] = player.energy;
        });
        const _gameObj = {
            title: this.#title,
            energyList: energyList,
            unitList: this.#unitList,
            buildingList: this.#buildingList,
            fuelList: this.#world.getFuelList(),
            temp: this.#world.temp,
            round: this.#round,
            turn: this.#turn,
            first: this.#first,
        };
        return _gameObj;
    }

    #rotate(num, min, max, delta) {
        if (num + delta >= max) {
            return num + delta - max + min;
        } else if (num + delta < min) {
            return num + delta + max - min;
        } else {
            return num + delta;
        }
    }

    previousTurn() {
        this.#turn = this.#rotate(this.#turn, 0, 6, -1);

        if (this.#rotate(this.#turn, 0, 6, 1) === this.#first) {
            if (this.#round === 1) {
                alert('이전 라운드가 존재하지 않습니다.');
                this.#turn = this.#rotate(this.#turn, 0, 6, 1);
            } else if (confirm('이전 라운드로 돌아가겠습니까?')) {
                this.previousRound();
            } else {
                this.#turn = this.#rotate(this.#turn, 0, 6, 1);
            }
        }
    }

    nextTurn() {
        this.#turn = this.#rotate(this.#turn, 0, 6, 1);

        if (this.#turn === this.#first) {
            if (confirm('정산하겠습니까?')) {
                this.settle();
                this.nextRound();
            } else {
                this.#turn = this.#rotate(this.#turn, 0, 6, -1);
            }
        }
    }

    settle() {}

    previousRound() {
        this.#round -= 1;
        this.#first = this.#rotate(this.#first, 0, 6, -1);
        this.#turn = this.#first;
    }

    nextRound() {
        this.#round += 1;
        this.#first = this.#rotate(this.#first, 0, 6, 1);
        this.#turn = this.#first;
    }

}
