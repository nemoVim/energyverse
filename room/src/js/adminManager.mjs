import { Biomes } from '../../../src/js/biomes.mjs';
import { Buildings } from '../../../src/js/buildings.mjs';
import { Move } from '../../../src/js/move.mjs';
import { Temperature } from '../../../src/js/temperature.mjs';
import { Units } from '../../../src/js/units.mjs';
import { Utils } from '../../../src/js/utils.mjs';
import { World } from '../../../src/js/world.mjs';
import { AdminUI } from './adminUI.mjs';
import { GameTeam } from './gameTeam.mjs';

export class AdminManager {

    #name;

    #socket;
    #world;
    #teamNames = [];
    #teams = [];
    #teamCnt = 0;

    #firstTurn = -1;
    #turn = -1;

    #round = 0;

    #adminUI;

    #temp;
    #thermal = 0;
    #seaLevel = 0;

    constructor(_socket, _name) {

        this.#name = _name;

        this.#socket = _socket;
        this.#world = new World();
        this.#temp = new Temperature();

        this.#adminUI = new AdminUI(this);

        this.#socket.on('usersData', msg => {
            console.log('usersData');
            this.reSettingTeams(JSON.parse(msg));
            this.#socket.emit('loadWorld');
        });

        this.#socket.on('worldData', msg => {
            console.log('worldData');
            this.reSettingWorld(JSON.parse(msg));

            document.getElementById('readyDiv').classList.add('hidden');
            document.getElementById('startBtn').classList.add('hidden');

        });

        this.#addListeners();

        document.getElementById('readyBtn').addEventListener('click', () => {
            this.#ready();
        });
    }

    #ready() {

        this.#socket.emit('ready');

        this.#adminUI.init();

        this.#socket.on('socketList', (msg) => {

            this.#teamNames = new Array(JSON.parse(msg))[0];
            this.#teamNames.splice(this.#teamNames.indexOf(this.#name), 1);
            this.#teamCnt = this.#teamNames.length;
            this.#initTeams();

            this.#adminUI.readyDone();

            this.#socket.removeAllListeners('socketList');

            this.#socket.emit('saveUsers', this.makeUsersData());
            this.#socket.emit('saveWorld', this.makeWorldData());
        });
    }

    #addListeners() {

        this.#socket.on('wait', teamIndex => {
            this.#adminUI.notice(`${this.#teamNames[teamIndex]}팀의 턴이 종료됐습니다.`);
            this.#teams[teamIndex].getTimer().stop();
            this.#teams[teamIndex].getTimer().setTime(0);
        });

        this.#socket.on('researchClient', msg => {
            // [skillIndex, teamIndex]
            this.#teams[Number(msg[1])].research(Number(msg[0]));
        });

        this.#socket.on('unResearchClient', msg => {
            // [skillIndex, teamIndex]
            this.#teams[Number(msg[1])].unResearch(Number(msg[0]));
        });
    }

    #initTeams() {
        // TODO: Make list randomly.
        let randomTeamNameList = [...this.#teamNames];
        this.#teamNames = randomTeamNameList;

        console.log('initTeams');

        this.#socket.emit('init', this.#teamNames);

        this.#initTeamList();

    }

    #initTeamList() {
        this.#teamNames.forEach((name, index) => {
            this.#teams.push(new GameTeam(name, index, this));
        });
    }

    reSettingTeams(config) {
        // [teamNameList, earn, energy, score, researching, learned, time, nowTurn, temperature, round, firstTurn];
        console.log(config);

        this.#teamCnt = config[0].length;

        this.#teamNames = config[0];
        this.#initTeamList(config[0]);

        this.#adminUI.init();
        this.#adminUI.readyDone();

        config[0].forEach((teamName, index) => {
            this.#teams[index].setEarn(config[1][index]);
            this.#teams[index].setEnergy(config[2][index]);
            this.#teams[index].setScore(config[3][index]);
            this.#teams[index].setResearching(new Set(config[5][index]));
            this.#teams[index].learn();
            this.#teams[index].setResearching(new Set(config[4][index]));
            if (index === Number(config[7]) && Number(config[6][index]) !== 0) {
                this.#teams[index].start();
            }
            this.#teams[index].getTimer().setTime(config[6][index]);
        });

        this.#turn = Number(config[7]);

        this.#temp.setTemp(config[8]);
        this.#seaLevel = parseInt(Math.floor((this.#temp.getTemp()-Temperature.initialTemp)*10/5));

        this.#round = Number(config[9]);

        this.#firstTurn = Number(config[10]);

        this.#adminUI.refresh();

    }

    reSettingWorld(config) {
        // [biomes, buildings, units];
        let cnt = -1;
        this.#world.getTileMap().getTileMapArray().forEach((tileArray, i) => {
            tileArray.forEach((tile, j) => {
                cnt += 1;
                if (config[0][cnt][0] === 'fuel') {
                    tile.getBiome().setAmount(config[0][cnt][1]);
                } else {
                    tile.setBiome(new Biomes[[i, j], config[0][cnt][0]]);
                }
            });
        });

        config[1].forEach((teamBuildings, teamIndex) => {
            teamBuildings.forEach(buildingConfig => {
                if (buildingConfig[0] === 'atomicPower') {
                    this.#teams[teamIndex].modifyAtomicCnt(1);
                }

                const building = new Buildings[buildingConfig[0]](buildingConfig[1], teamIndex, this.#world, this.#teams[teamIndex].getStatus());

                if (buildingConfig[0] === 'windScore') {
                    building.setValue(buildingConfig[2]);
                }

                this.#world.setEntity(buildingConfig[1], building);
                this.#teams[teamIndex].getBuildings().push(building);
            });
        });

        config[2].forEach((teamUnits, teamIndex) => {
            this.#teams[teamIndex].getUnits().pop();
            teamUnits.forEach(unitType => {
                const unit = new Units[unitType](teamIndex);
                this.#teams[teamIndex].getUnits().push(unit);
            });
        });

        if (this.#firstTurn === -1) {
            this.calcEarn();
        }

        this.#adminUI.refresh();
        this.#adminUI.turnChanged();

        Utils.showElement('nextBtn');
        Utils.showElement('previousBtn');
        Utils.showElement('endBtn');
        Utils.showElement('settleBtn');

        this.#socket.emit('saveUsers', this.makeUsersData());
        this.#socket.emit('saveWorld', this.makeWorldData());
        this.saveData();
    }

    // -------------------------------

    start() {
        this.#socket.emit('start');
        this.#firstTurn = 0;
        this.#turn = 0;

        this.#adminUI.refresh();

        this.saveData();
    }

    // --------------------------------

    getNextIndex(nowIndex) {
        const nextIndex =
            nowIndex === this.#teamCnt-1 ? (nowIndex = 0) : (nowIndex += 1);
        return nextIndex;
    }

    getPreviousIndex(nowIndex) {
        const previousIndex =
            nowIndex === 0 ? (nowIndex = this.#teamCnt-1) : (nowIndex -= 1);
        return previousIndex;
    }

    startRound() {
        this.#round += 1;
        this.turnChanged();
        this.#socket.emit('round', this.#round);
        this.#adminUI.refresh();
        this.#socket.emit('saveUsers', this.makeUsersData());
    }

    next() {
        if (this.#turn === this.getPreviousIndex(this.#firstTurn)) {
            if (!confirm('현재 플레이어가 현 라운드의 마지막 플레이어입니다. 턴을 넘기시겠습니까?')) {
                Utils.showElement('settleBtn');
                return;
            }
        }
        this.#turn = this.getNextIndex(this.#turn);
        this.turnChanged();
    }

    previous() {
        this.#turn = this.getPreviousIndex(this.#turn);
        this.turnChanged();
    }

    turnChanged() {
        this.#teams.forEach((team, index) => {
            team.getTimer().stop();
            team.getTimer().setTime(0);
            this.#socket.emit('time', [0, index]);
        });
        this.#socket.emit('turn', [this.#turn, this.#firstTurn]);
        this.getNowTeam().start();
        this.#adminUI.turnChanged();
        this.#adminUI.notice(`${this.#teamNames[this.#turn]}팀의 턴이 시작되었습니다.`);
    }

    endTurn() {
        this.getNowTeam().stop();
    }


    // ------------------------------------

    getUI() {
        return this.#adminUI;
    }

    getRound() {
        return this.#round;
    }

    getTemp() {
        return this.#temp;
    }

    modifyTemp(delta) {
        this.#temp.modifyTemp(delta);
        this.#socket.emit('temperature', this.#temp.getTemp());
    }

    getTeams() {
        return this.#teams;
    }

    getNowTeam() {
        return this.#teams[this.#turn];
    }

    getNowStatus() {
        return this.#teams[this.#turn].getStatus();
    }

    getWorld() {
        return this.#world;
    }

    getFirstTurn() {
        return this.#firstTurn;
    }

    getFirstTurnName() {
        return this.#teamNames[this.#firstTurn];
    }

    emit(name, config) {
        this.#socket.emit(name, config);
    }

    //----------------------------------

    #setWorldClickFunc(func) {
        const tileMapArray = this.#world.getTileMap().getTileMapArray();
        tileMapArray.forEach(tileArray => {
            tileArray.forEach(tile => {
                tile.getUI().setClickFunction(func);
            });
        });
    }

    // ----------------------------------------

    build(type) {
        this.#setWorldClickFunc((pos, biome, entity) => {
            if (entity !== null) return;
            if (this.getNowTeam().build(type, pos, biome)) {
                this.calcEarn();
            }
        });

        this.#adminUI.showWorld();
    }

    destroyBuilding() {
        this.#setWorldClickFunc((pos, biome, entity) => {
            if (entity === null) return;
            this.getNowTeam().destroy(entity);
            this.#teams[entity.getTeam()].destroyed(entity);
            this.calcEarn();
        });

        this.#adminUI.showWorld();
    }

    destroyUnit(unit) {
        this.getNowTeam().destroy(unit);
        this.#teams[unit.getTeam()].destroyed(unit);
    }

    modify(type, delta) {
        this.getNowTeam().modify(type, delta);
    }

    produce(type) {
        this.getNowTeam().produce(type);
    }

    changeBiomeUp() {
        this.#setWorldClickFunc((pos, biome, entity) => {
            if (entity !== null) return;

            if (biome.getType() === 'water') {
                if (this.getNowTeam().changeBiome('ground', pos)) {
                    this.calcEarn();
                }
            } else if (biome.getType() === 'ground') {
                if (this.getNowTeam().changeBiome('mountain', pos)) {
                    this.calcEarn();
                }
            }
        });

        this.#adminUI.showWorld();
    }

    changeBiomeDown() {
        this.#setWorldClickFunc((pos, biome, entity) => {
            if (entity !== null) return;

            if (biome.getType() === 'mountain') {
                if(this.getNowTeam().changeBiome('ground', pos)) {
                    this.calcEarn();
                }
            } else if (biome.getType() === 'ground') {
                if(this.getNowTeam().changeBiome('water', pos)) {
                    this.calcEarn();
                }
            }
        });
        this.#adminUI.showWorld();
    }

    showDefaultWorld() {
        this.#setWorldClickFunc((pos, biome, entity) => {
            console.log('--pos--');
            console.log(pos);
            if (biome.getType() === 'fuel') {
                alert(`자원이 ${biome.getAmount()}개 남았습니다.`);
            } else if (entity !== null) {
                const choice = confirm(`${this.#teamNames[entity.getTeam()]}의 건물입니다.\n파괴하시겠습니까?`);
                if (choice) {
                    this.#teams[entity.getTeam()].destroyed(entity);
                    this.calcEarn();
                }
            } else {
                let choice = prompt('1. 물 / 2. 땅 / 3. 산');
                if (choice === null || choice === '') return;
                choice = Number(choice);

                if (choice === 1) {
                    this.#world.setBiome(pos, new Biomes.water(pos));
                } else if (choice === 2) {
                    this.#world.setBiome(pos, new Biomes.ground(pos));
                } else if (choice === 3) {
                    this.#world.setBiome(pos, new Biomes.mountain(pos));
                }

                this.calcEarn();
            }
        });

        this.#adminUI.showWorld();
    }
    // -------------------------------------
    
    calcEarn() {
        const fuelAmountList = [];
        this.#world.getTileMap().getTileMapArray().forEach(tileArray => {
            tileArray.forEach(tile => {
                if (tile.getBiome().getType() === 'fuel') {
                    fuelAmountList.push(tile.getBiome().getAmount());
                }
            });
        });

        let _thermal = 0;

        let settleIndex = this.#firstTurn;
        for (let i = 0; i < this.#teamCnt; i++) {
            _thermal += this.#teams[settleIndex].calcEarn();
            settleIndex = this.getNextIndex(settleIndex);
        }

        this.#world.getTileMap().getTileMapArray().forEach(tileArray => {
            tileArray.forEach(tile => {
                if (tile.getBiome().getType() === 'fuel') {
                    tile.getBiome().setAmount(fuelAmountList.shift());
                }
            });
        });

        this.#thermal = _thermal;

        this.#adminUI.refresh();
    }

    settle() {

        this.#teams.forEach((team, index) => {
            team.getTimer().stop();
            team.getTimer().setTime(0);
            this.#socket.emit('time', [0, index]);
        });

        this.calcEarn();

        let settleIndex = this.getNextIndex(this.#turn);
        for (let i = 0; i < this.#teamCnt; i++) {
            settleIndex = this.getNextIndex(settleIndex);
            this.#teams[settleIndex].settle();
        }

        this.#socket.emit('learn');

        this.#temp.modifyTemp(this.#thermal*0.1);
        this.#socket.emit('temperature', this.#temp.getTemp());

        const _seaLevel = parseInt(Math.floor((this.#temp.getTemp()-Temperature.initialTemp)*10/5));
        if (this.#seaLevel < _seaLevel) {
            this.#adminUI.notice(`물이 ${_seaLevel-this.#seaLevel}칸 올랐습니다!`);
            this.#seaLevel = _seaLevel;
            this.rise();
        }

        this.#turn = this.getNextIndex(this.getNextIndex(this.#turn));
        this.#firstTurn = this.#turn;

        this.calcEarn();

        this.#adminUI.refresh();
        this.#adminUI.turnChanged();

        this.#socket.emit('saveUsers', this.makeUsersData());
        this.#socket.emit('saveWorld', this.makeWorldData());
    }

    rise() {
        const size = World.worldSize;
        for (let i = 0; i <= this.#seaLevel; i++) {

            Move.around([size-1, size-1], size-i-1).forEach(pos => {
                const biome = this.#world.getBiome(pos);
                const entity = this.#world.getEntity(pos);

                if (biome.getType() === 'ground') {
                    this.#world.setBiome(pos, new Biomes.water(pos));
                    if (entity !== null) {
                        this.#teams[entity.getTeam()].destroyed(entity);
                    }
                }

            });
        }
    }

    endGame() {
        this.#socket.emit('endGame');
    }

    // ------------------------------------------

    saveData() {
        this.#socket.emit('startSave');
        this.#socket.on('save', () => {
            this.#socket.emit('saveUsers', this.makeUsersData());
            this.#socket.emit('saveWorld', this.makeWorldData());
        });
    }

    makeUsersData() {
        let earn = [];
        let energy = [];
        let score = [];
        let researching = [];
        let learned = [];
        let time = [];

        this.#teams.forEach(team => {
            earn.push(team.getEarn());
            energy.push(team.getEnergy());
            score.push(team.getScore());
            researching.push(Array.from(team.getResearching()));
            learned.push(Array.from(team.getLearned()));
            time.push(team.getTimer().getTime());
        });

        return [this.#teamNames, earn, energy, score, researching, learned, time, this.#turn, this.#temp.getTemp(), this.#round, this.#firstTurn];

    }

    makeWorldData() {

        let biomes = [];
        // let entities = [];
        this.#world.getTileMap().getTileMapArray().forEach(tileArray => {
            tileArray.forEach(tile => {
                const biome = tile.getBiome();
                const entity = tile.getEntity();
                if (biome.getType() === 'fuel') {
                    biomes.push([biome.getType(), biome.getAmount()]);
                } else {
                    biomes.push([biome.getType(), 0]);
                }

                // if (entity === null) {
                //     entities.push(entity)
                // } else {
                //     entities.push(entity.getType());
                // }
            });
        });

        let buildings = [];
        let units = [];

        this.#teams.forEach(team => {
            let teamBuildings = [];
            let teamUnits = [];
            team.getBuildings().forEach(building => {
                if (building.getType() === 'windScore') {
                    teamBuildings.push([building.getType(), building.getPos(), building.getValue()]);
                } else {
                    teamBuildings.push([building.getType(), building.getPos(), 0]);
                }
            });

            team.getUnits().forEach(unit => {
                teamUnits.push(unit.getType());
            });

            buildings.push(teamBuildings);
            units.push(teamUnits);
        });

        return [biomes, buildings, units];
    }
}
