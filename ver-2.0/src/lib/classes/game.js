import { Player } from '$lib/classes/player';
import { World } from '$lib/classes/world';
import { Building, createBuilding } from './buildings';
import { checkTech } from './tech';
import { Tilemap } from './tilemap';
import { createUnit, Unit } from './units';

export class Game {
    #title;

    #world;
    #round;
    #turn;
    #first;
    #temp;

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
        this.#world.initEntities(this.#unitList, this.#buildingList);
        this.#world.initSea(temp);

        this.#round = round;
        this.#turn = turn;
        this.#first = first;
        this.#temp = temp;

        this.#playerList = [];

        for (let i = first; i < first + 6; i++) {
            let idx = i;
            if (idx >= 6) {
                idx -= 6;
            }

            this.#playerList.push(
                new Player(
                    idx,
                    energyList[idx],
                    this.#unitList,
                    this.#buildingList,
                    this.#world,
                )
            );
        }
        this.#world.initFuels(fuelList);
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

    get temp() {
        return this.#temp;
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
            temp: this.#temp,
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

    settle() {

        let totalFuel = 0;

        for (let i = 0; i < 6; i++) {
            const idx = this.#rotate(this.#first, 0, 6, i);
            const { energy, fuel }= this.#playerList[idx].settle();
            this.#energyList[idx] = energy;
            totalFuel += fuel;
        }

        this.#temp += totalFuel * 0.1;

        //물이 차올라서 파괴되는가?

        const underEntityList = this.#world.initSea(this.#temp);

        underEntityList.forEach(entity => {
            if (!checkTech(this.#playerList[entity.player].tech, 1)) {
                if (entity instanceof Building) {
                    this.#buildingList.splice(this.#buildingList.indexOf(entity), 1);
                } else if (entity instanceof Unit) {
                    this.#unitList.splice(this.#unitList.indexOf(entity), 1);
                }
            }
        });

        // 중앙 돈 주기 
        let posList = Tilemap.ring([0, 0, 0], 1);
            Tilemap.ring([0, 0, 0], 1).forEach((pos, i) => {
                let j = i - 1;
                if (j < 0) j = 5;
                posList = posList.concat([Tilemap.move(pos, j, 1)]);
            });
        
        const playerUnitList = [0, 0, 0, 0, 0, 0];

        posList.forEach(pos => {
            const entity = this.#world.getEntity(pos);
            if (entity === null) return;

            playerUnitList[entity.player] += 1;
        });

        let maxUnitCnt = 0;
        const maxPlayer = playerUnitList.reduce((prev, value, index) => {
            if (value > maxUnitCnt) {
                maxUnitCnt = value;
                return index;
            } else if (value === maxUnitCnt) {
                return null;
            } else {
                return prev;
            }
        }, null);

        if (maxPlayer !== null) {
            this.#energyList[maxPlayer] += 15;
        }

        //돈 재정산
        for (let i = 0; i < 6; i++) {
            this.#playerList[i] = new Player(i, this.#energyList[i], this.#unitList, this.#buildingList, this.#world);
        }
    }

    previousRound() {
        this.#round -= 1;
        // this.#first = this.#rotate(this.#first, 0, 6, -1);
        this.#turn = this.#first;
    }

    nextRound() {
        this.#round += 1;
        // this.#first = this.#rotate(this.#first, 0, 6, 1);
        this.#turn = this.#first;
    }

}
