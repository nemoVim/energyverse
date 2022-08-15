import { AtomicPower, Buildings } from '../../../src/js/buildings.mjs';
import { World } from '../../../src/js/world.mjs';
import { DummyTeam } from './dummyTeam.mjs';

export class AdminManager {

    #socket;
    #world;
    #teamNames = [];
    #teams = [];
    #teamCnt = 0;

    #turn = -1;

    constructor(_socket) {
        this.#socket = _socket;
        this.#world = new World();

        document.getElementById('startBtn').addEventListener('click', () => {
            this.#start();
        });
    }

    #start() {
        this.#socket.on('socketList', (msg) => {

            this.#teamNames = new Array(JSON.parse(msg))[0];
            this.#teamCnt = this.#teamNames.length;

            this.#init();

            this.#socket.removeAllListeners('socketList');
        });
    }

    #init() {

        this.#initTeams();

        this.#initUI();

        this.#addListeners();

        this.#turn = -1;
        this.#turnChanged();
    }

    #initTeams() {
        // TODO: Make list randomly.
        let randomTeamNameList = teamNameList;
        this.#teamNames = randomTeamNameList;

        this.#socket.emit('init', this.#teamNames);

        this.#initDummyTeams();
    }

    #initDummyTeams() {
        for (let name of this.#teamNameList) {
            this.#teams.push(new DummyTeam(name));
        }
    }

    #initUI() {
        this.#initDivs();
        this.#initBtns();
        this.#initMap();
    }

    #initDivs() {

        document.getElementById('roomDiv').classList.add('hidden');
        document.getElementById('gameDiv').classList.remove('hidden');
        document.getElementById('adminDiv').classList.remove('hidden');

    }

    #initBtns() {

        this.#initActionBtns();
        this.#initFunctionBtns();
    }

    #initActionBtns() {
        document.getElementById('buildBtn').addEventListener('click', (e) => {
            this.#clickBuildBtn();
        });

        document.getElementById('thermalPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('THERMAL_POWER');
        });

        document.getElementById('windPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('WIND_POWER');
        });

        document.getElementById('solarPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('SOLAR_POWER');
        });

        document.getElementById('atomicPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('ATOMIC_POWER');
        });

        document.getElementById('windScoreBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('WIND_SCORE');
        });

        document.getElementById('solarScoreBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('SOLAR_SCORE');
        });

        document.getElementById('atomicScoreBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('ATOMIC_SCORE');
        });

        // -----------------------------------------

        document.getElementById('unitBtn').addEventListener('click', (e) => {
            this.#clickUnitBtn();
        });

        document.getElementById('probeBtn').addEventListener('click', (e) => {
            this.produce('PROBE');
        });

        document.getElementById('windUnitBtn').addEventListener('click', (e) => {
            this.produce('WIND_UNIT');
        });

        document.getElementById('solarUnitBtn').addEventListener('click', (e) => {
            this.produce('SOLAR_UNIT');
        });

        document.getElementById('atomicUnitBtn').addEventListener('click', (e) => {
            this.produce('ATOMIC_UNIT');
        });

        // ------------------------------------------

        document.getElementById('destroyBtn').addEventListener('click', (e) => {
            this.#clickDestroyBtn();
        });

        document.getElementById('researchBtn').addEventListener('click', (e) => {
            this.#clickResearchBtn();
        });

        // ------------------------------------------
        
        document.getElementById('changeBiomeBtn').addEventListener('click', (e) => {
            this.#clickChangeBiomeBtn();
        });

        document.getElementById('upBtn').addEventListener('click', (e) => {
            this.#clickUpBtn();
        });

        document.getElementById('downBtn').addEventListener('click', (e) => {
            this.#clickDownBtn();
        });
    }

    #initFunctionBtns() {
        document.getElementById('nextBtn').addEventListener('click', (e) => {
            this.next();
        });

        document.getElementById('previousBtn').addEventListener('click', (e) => {
            this.previous();
        });

        document.getElementById('modifyEnergyBtn').addEventListener('click', (e) => {
            let delta = prompt('변화량을 입력하세요.');
            if (delta == null || delta === '') return;

            this.modifyEnergy(Number(delta));
        });

        document.getElementById('modifyScoreBtn').addEventListener('click', (e) => {
            let delta = prompt('변화량을 입력하세요.');
            if (delta == null || delta === '') return;

            this.modifyScore(Number(delta));
        });

        document.getElementById('settleBtn').addEventListener('click', (e) => {
            this.settle();
        });
    }

    #addListeners() {
        this.#socket.on('thermal', msg => {
            // [pos] amount of fuel -1 at pos, and world temperature is increased.
            const config = new Array(JSON.parse(msg));
            this.#thermal(config);
        });

        this.#socket.on('refresh', msg => {
            // [team, predict, energy, score]
            const config = new Array(JSON.parse(msg));
            this.#refresh(config);
        });
    }

    //-------------------------------

    next() {
        this.#turn =
            this.#turn === this.#teamCnt-1 ? (this.#turn = 0) : (this.#turn += 1);
        this.#turnChanged();
    }

    previous() {
        this.#turn =
            this.#turn === 0 ? (this.#turn = this.#teamCnt-1) : (this.#turn -= 1);
        this.#turnChanged();
    }

    #turnChanged() {
        this.#socket.emit('turn', this.#turn);
    }

    //----------------------------------

    
    #setClickFunction(func) {
        const tileMapArray = this.#world.getTileMap().getTileMapArray();
        tileMapArray.forEach(tileArray => {
            tileArray.forEach(tile => {
                tile.getUI().setClickFunction(func);
            });
        });
    }

    #clickBuildBtn() {

        const buildBtns = document.querySelectorAll('#buildDiv > button');

        buildBtns.forEach(btn => {
            btn.classList.add('hidden');
        });
        
        document.getElementById('buildDiv').classList.remove('hidden');

        const team = this.#teams[this.#turn];


        if (team.getStatus().hasFactory(1)) {
            document.getElementById('factoryBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasThermalPower(1)) {
            document.getElementById('thermalPowerBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasWindPower(1)) {
            document.getElementById('windPowerBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasSolarPower(1)) {
            document.getElementById('solarPowerBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasAtomicPower(1)) {
            document.getElementById('atomicPowerBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasWindScore(1)) {
            document.getElementById('windScoreBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasSolarScore(1)) {
            document.getElementById('solarScoreBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasAtomicScore(1)) {
            document.getElementById('atomicScoreBtn').classList.remove('hidden');
        }
    }

    #clickBuildingBtn(type) {
        this.#setClickFunction((pos, biome, entity) => {
            if (entity !== null) return;

            const status = this.#teams[this.#turn].getStatus();

            if (type === 'ATOMIC_POWER' && !AtomicPower.isBuildable(pos, this.#world, status)) {
                return;
            }

            if (biome.getType() === 'ground') {
                this.build(type, pos);
            } else if (biome.getType() === 'mountain' && status.hasProbe(8)) {
                this.build(type, pos);
            }
        });
    }

    #clickUnitBtn() {

        const unitBtns = document.querySelectorAll('#unitDiv > button');

        unitBtns.forEach(btn => {
            btn.classList.add('hidden');
        });
        
        document.getElementById('unitDiv').classList.remove('hidden');

        const team = this.#teams[this.#turn];

        if (team.getStatus().hasProbe(1)) {
            document.getElementById('probeBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasWindUnit(1)) {
            document.getElementById('windUnitBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasSolarUnit(1)) {
            document.getElementById('solarUnitBtn').classList.remove('hidden');
        }

        if (team.getstatus().hasAtomicUnit(1)) {
            document.getelementbyid('atomicUnitBtn').classlist.remove('hidden');
        }

        if (team.getStatus().hasMissile(1)) {
            document.getElementById('missileBtn').classList.remove('hidden');
        }
    }

    #clickDestroyBtn() {
        document.getElementById('destroyDiv').classList.remove('hidden');

        this.#setClickFunction((pos, biome, entity) => {
            if (entity === null) return;
            this.destroy(pos);
        });
    }

    #clickResearchBtn() {
        document.getElementById('researchDiv').classList.remove('hidden');
    }
    
    #clickChangeBiomeBtn() {

        const changeBiomeBtns = document.querySelectorAll('#changeBiomeDiv > button');

        changeBiomeBtns.forEach(btn => {
            btn.classList.add('hidden');
        });
        
        document.getElementById('changeBiomeDiv').classList.remove('hidden');

        const team = this.#teams[this.#turn];

        if (team.getStatus().hasProbe(128)) {
            document.getElementById('upBtn').classList.remove('hidden');
        }

        if (team.getStatus().hasProbe(4)) {
            document.getElementById('downBtn').classList.remove('hidden');
        }
    }

    #clickUpBtn() {
        this.#setClickFunction((pos, biome, entity) => {
            if (biome.getType() === 'water') {
                this.changeBiome(pos, 'GROUND');
            } else if (biome.getType() === 'ground') {
                this.changeBiome(pos, 'MOUNTAIN');
            }
        });
    }

    #clickDownBtn() {
        this.#setClickFunction((pos, biome, entity) => {
            if (biome.getType() === 'mountain') {
                this.changeBiome(pos, 'GROUND');
            } else if (biome.getType() === 'ground') {
                this.changeBiome(pos, 'WATER');
            }
        });
    }

    build(type, pos) {
        this.#socket.emit('build', JSON.stringify([type, pos, this.#turn]));
        const building = new (Buildings[type])(pos, this.#turn, this.#world, this.#teams[this.#turn].getStatus());
        this.#world.setEntity(pos, building);
    }

    destroy(pos) {
        this.#socket.emit('destroy', JSON.stringify([pos, this.#turn]));
        this.#world.setEntity(pos, null);
    }

    modifyEnergy(delta) {
        this.modify('energy', delta);
    }

    modifyScore(delta) {
        this.modify('score', delta);
    }

    modify(type, delta) {
        this.#socket.emit('modify', JSON.stringify([type, delta, this.#turn]));
    }

    settle() {
        let index = 0;
        this.#settleTeam(index);
        this.#socket.on('doneSettle', () => {
            index += 1;
            if (index >= this.#teamCnt) {
                this.#socket.removeAllListeners('doneSettle');
                return;
            }
            this.#settleTeam(index);
        });
    }

    produce(type) {

    }

    changeBiome(pos, type) {

    }

    #settleTeam(index) {
        this.#socket.emit('settle', JSON.stringify(index));
    }

    #thermal(pos) {
        this.#world.getBiome(pos).modifyAmount(-1);
        this.#world.increaseTemp();
    }

    #refresh(config) {
        const team = this.#teams[config[0]];
        team.setPredict(config[1]);
        team.setEnergy(config[2]);
        team.setScore(config[3]);
    }
    
    getTeams() {
        return this.#teams;
    }

    getWorld() {
        return this.#world;
    }
}