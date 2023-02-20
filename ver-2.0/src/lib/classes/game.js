import { Player } from '$lib/classes/player';
import { World } from '$lib/classes/world';
import game from '$lib/models/game';
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
    #timeList;

    #unitList;
    #buildingList;

    #playerList;

    #stop;

    constructor({
        title,
        energyList,
        timeList,
        unitList,
        buildingList,
        fuelList,
        round,
        turn,
        temp,
        first,
        stop,
    }) {
        this.#title = title;

        this.#energyList = energyList;
        (this.#timeList = timeList), (this.#unitList = []);
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

        this.#stop = stop;

        this.#playerList = [];

        for (let i = first; i < first + 6; i++) {
            let idx = i;
            if (idx >= 6) {
                idx -= 6;
            }

            this.#playerList.push(
                new Player(
                    idx,
                    this.#round,
                    energyList[idx],
                    timeList[idx],
                    this.#unitList,
                    this.#buildingList,
                    this.#world
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

    set round(_round) {
        this.#round = _round;
    }

    get turn() {
        return this.#turn;
    }

    set turn(_turn) {
        this.#turn = _turn;
    }

    get first() {
        return this.#first;
    }

    get temp() {
        return this.#temp;
    }

    get stop() {
        return this.#stop;
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
        const timeList = this.#timeList;
        this.#playerList.forEach((player) => {
            energyList[player.index] = player.energy;
            timeList[player.index] = player.time;
        });

        const unitList = [];
        this.#unitList.forEach((unit) => {
            unitList.push({
                en: unit.en,
                player: unit.player,
                pos: unit.pos,
            });
        });

        const buildingList = [];
        this.#buildingList.forEach((building) => {
            buildingList.push({
                en: building.en,
                player: building.player,
                pos: building.pos,
                track: building.track || null,
            });
        });

        const _gameObj = {
            title: this.#title,
            energyList: energyList,
            timeList: timeList,
            unitList: unitList,
            buildingList: buildingList,
            fuelList: this.#world.getFuelList(),
            temp: this.#temp,
            round: this.#round,
            turn: this.#turn,
            first: this.#first,
            stop: this.#stop,
        };
        return _gameObj;
    }

    static rotate(num, min, max, delta) {
        if (num + delta >= max) {
            return num + delta - max + min;
        } else if (num + delta < min) {
            return num + delta + max - min;
        } else {
            return num + delta;
        }
    }

    previousTurn() {
        this.#turn = Game.rotate(this.#turn, 0, 6, -1);

        if (Game.rotate(this.#turn, 0, 6, 1) === this.#first) {
            if (this.#round === 1) {
                if (confirm('초기 상태로 돌아가시겠습니까?')) {
                    this.#round = 0;
                    this.playerList[this.#turn].time = new Date().getTime();
                    this.#stop = new Date().getTime();
                } else {
                    this.#turn = Game.rotate(this.#turn, 0, 6, 1);
                }
            } else if (confirm('이전 라운드로 돌아가겠습니까?')) {
                this.previousRound();
                this.#playerList[this.#turn].time = new Date().getTime();
                this.#stop = new Date().getTime();
            } else {
                this.#turn = Game.rotate(this.#turn, 0, 6, 1);
            }
        } else {
            this.playerList[this.#turn].time = new Date().getTime();
        }
    }

    nextTurn() {
        this.#turn = Game.rotate(this.#turn, 0, 6, 1);

        if (this.#turn === this.#first) {
            if (confirm('정산하겠습니까?')) {
                this.settle();
                this.nextRound();
                this.#playerList[this.#turn].time = new Date().getTime();
                this.#stop = new Date().getTime();
            } else {
                this.#turn = Game.rotate(this.#turn, 0, 6, -1);
            }
        } else {
            this.playerList[this.#turn].time = new Date().getTime();
        }
    }

    settle() {

        // 자원 소비를 위해
        for (let i = 0; i < 6; i++) {
            this.#playerList[i] = new Player(
                i,
                this.#round,
                this.#energyList[i],
                this.#timeList[i],
                this.#unitList,
                this.#buildingList,
                this.#world
            );
        }

        let totalFuel = 0;

        for (let i = 0; i < 6; i++) {
            const idx = Game.rotate(this.#first, 0, 6, i);
            const { energy, fuel } = this.#playerList[idx].settle();
            this.#energyList[idx] = energy;
            totalFuel += fuel;
        }

        this.#temp += totalFuel * 0.1;

        //물이 차올라서 파괴되는가?

        const underEntityList = this.#world.initSea(this.#temp);

        underEntityList.forEach((entity) => {
            if (!checkTech(this.#playerList[entity.player].tech, 5)) {
                if (entity instanceof Building) {
                    this.#buildingList.splice(
                        this.#buildingList.indexOf(entity),
                        1
                    );
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

        posList.forEach((pos) => {
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
    }

    previousRound() {
        this.#round -= 1;
        // this.#first = Game.rotate(this.#first, 0, 6, -1);
    }

    nextRound() {
        this.#round += 1;
        // this.#first = Game.rotate(this.#first, 0, 6, 1);
        this.#turn = this.#first;
    }

    gameStart() {
        this.#playerList[this.#turn].time += new Date().getTime() - this.#stop;
        this.#stop = 0;
    }

    gameStop() {
        this.#stop = new Date().getTime();
    }
}
