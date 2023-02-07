import { Buildings } from '../../../src/js/buildings.mjs';
import { Units } from '../../../src/js/units.mjs';
import { Utils } from '../../../src/js/utils.mjs';
import { ClientTeamUI } from './clientTeamUI.mjs';

export class AdminUI {

    #btns;
    #manager;

    constructor(_manager) {
        this.#btns = new AdminBtns(_manager);
        this.#manager = _manager;
    }

    init() {
        this.#initDivs();
        this.#btns.init();
    }

    #initTeamsDiv() {
        this.#manager.getTeams().forEach((team, index) => {

            const teamDiv = ClientTeamUI.makeTeamDiv(team, index);
            console.log(teamDiv);

            document.getElementById('teamsDiv_admin').append(teamDiv);

            team.getSkillTree().initDone();
        });

        this.refresh();
    }

    #initDivs() {
        document.getElementById('roomDiv').classList.add('hidden');
        document.getElementById('readyDiv').classList.remove('hidden');
        document.getElementById('gameDiv').classList.remove('hidden');
        document.getElementById('adminDiv').classList.remove('hidden');

        document.getElementById('worldDiv').append(this.#manager.getWorld().getUI());

        document.getElementById('worldDiv').addEventListener('click', (e) => {
            if (e.target.id !== 'worldDiv') return;
            Utils.hideElement('worldDiv');
        });

        document.getElementById('buildDiv').addEventListener('click', (e) => {
            if (e.target.id !== 'buildDiv') return;
            Utils.hideElement('buildDiv');
        });

        document.getElementById('produceDiv').addEventListener('click', (e) => {
            if (e.target.id !== 'produceDiv') return;
            Utils.hideElement('produceDiv');
        });

        document.getElementById('destroyDiv').addEventListener('click', (e) => {
            if (e.target.id !== 'destroyDiv') return;
            Utils.hideElement('destroyDiv');
        });

        document.getElementById('changeBiomeDiv').addEventListener('click', (e) => {
            if (e.target.id !== 'changeBiomeDiv') return;
            Utils.hideElement('changeBiomeDiv');
        });

        document.getElementById('destroyUnitDiv').addEventListener('click', (e) => {
            if (e.target.id !== 'destroyUnitDiv') return;
            Utils.hideElement('destroyUnitDiv');
        });

        document.getElementById('adminDestroyUnitDiv').addEventListener('click', (e) => {
            if (e.target.id !== 'adminDestroyUnitDiv') return;
            Utils.hideElement('adminDestroyUnitDiv');
        });
    }

    readyDone() {
        document.getElementById('startBtn').classList.remove('hidden');
        this.#initTeamsDiv();
    }

    showWorld() {
        document.getElementById('worldDiv').classList.remove('hidden');
    }

    hideWorld() {
        document.getElementById('worldDiv').classList.add('hidden');
    }

    turnChanged() {
        document.querySelectorAll('p[id^=nameP_]').forEach(nameP => {
            nameP.style.backgroundColor = 'white';
        });
        document.getElementById('nameP_'+this.#manager.getFirstTurn()).style.backgroundColor = 'rgb(255, 190, 170)';
        document.getElementById('nameP_'+this.#manager.getNowTeam().getIndex()).style.backgroundColor = 'rgb(190, 220, 255)';
    }

    refresh() {
        this.#refreshTeamsDiv();
        this.#refreshInfo();
    }

    #refreshTeamsDiv() {
        this.#manager.getTeams().forEach((team, index) => {
            ClientTeamUI.refreshTeamDiv(team, index);
        });
    }

    #refreshInfo() {
        document.getElementById('tempP_admin').innerText = `${this.#manager.getTemp().getTemp()} °C`;
        document.getElementById('roundP_admin').innerText = `${this.#manager.getRound()}번째 라운드`;
        document.getElementById('firstP_admin').innerText = `선: ${this.#manager.getFirstTurnName()}`;
    }

    notice(msg) {
        document.getElementById('consoleP').innerText = msg;
    }

}

class AdminBtns {

    #manager;

    constructor(_manager) {
        this.#manager = _manager;
    }

    init() {
        this.#initActionBtns();
        this.#initFunctionBtns();
    }


    #initActionBtns() {
        document.getElementById('buildBtn').addEventListener('click', (e) => {
            this.#clickBuildBtn();
        });

        document.getElementById('factoryBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('factory');
            Utils.hideElement('buildDiv');
        });

        document.getElementById('thermalPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('thermalPower');
            Utils.hideElement('buildDiv');
        });

        document.getElementById('windPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('windPower');
            Utils.hideElement('buildDiv');
        });

        document.getElementById('solarPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('solarPower');
            Utils.hideElement('buildDiv');
        });

        document.getElementById('atomicPowerBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('atomicPower');
            Utils.hideElement('buildDiv');
        });

        document.getElementById('windScoreBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('windScore');
            Utils.hideElement('buildDiv');
        });

        document.getElementById('solarScoreBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('solarScore');
            Utils.hideElement('buildDiv');
        });

        document.getElementById('atomicScoreBtn').addEventListener('click', (e) => {
            this.#clickBuildingBtn('atomicScore');
            Utils.hideElement('buildDiv');
        });

        // -----------------------------------------

        document.getElementById('produceBtn').addEventListener('click', (e) => {
            this.#clickProduceBtn();
        });

        document.getElementById('probeBtn').addEventListener('click', (e) => {
            this.#manager.produce('probe');
            Utils.hideElement('produceDiv');
        });

        document.getElementById('windUnitBtn').addEventListener('click', (e) => {
            this.#manager.produce('windUnit');
            Utils.hideElement('produceDiv');
        });

        document.getElementById('solarUnitBtn').addEventListener('click', (e) => {
            this.#manager.produce('solarUnit');
            Utils.hideElement('produceDiv');
        });

        document.getElementById('atomicUnitBtn').addEventListener('click', (e) => {
            this.#manager.produce('atomicUnit');
            Utils.hideElement('produceDiv');
        });

        document.getElementById('missileBtn').addEventListener('click', (e) => {
            this.#manager.produce('missile');
            Utils.hideElement('produceDiv');
        });

        // ------------------------------------------

        document.getElementById('destroyBtn').addEventListener('click', (e) => {
            this.#clickDestroyBtn();
        });

        document.getElementById('destroyBuildingBtn').addEventListener('click', (e) => {
            this.#clickDestroyBuildingBtn();
        });

        document.getElementById('destroyUnitBtn').addEventListener('click', (e) => {
            this.#clickDestroyUnitBtn();
        });

        // ------------------------------------------

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

        document.getElementById('adminDestroyUnitBtn').addEventListener('click', () => {
            this.#clickAdminDestroyUnitBtn();
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            document.getElementById('readyDiv').classList.add('hidden');
            document.getElementById('startBtn').classList.add('hidden');
            this.#manager.start();
        });

        document.getElementById('nextBtn').addEventListener('click', (e) => {
            Utils.hideElement('settleBtn');
            Utils.hideElement('startRoundBtn');
            this.#manager.next();
        });

        document.getElementById('previousBtn').addEventListener('click', (e) => {
            Utils.hideElement('settleBtn');
            Utils.hideElement('startRoundBtn');
            this.#manager.previous();
        });

        document.getElementById('modifyTempBtn').addEventListener('click', (e) => {
            let delta = prompt('온도 변화량을 입력하세요.');
            if (delta == null || delta === '' || delta.match(/^-?[0-9]+$/) === null) return;

            this.#manager.getTemp().modifyTemp(Number(delta));
            this.#manager.getUI().refresh();
        });

        document.getElementById('modifyEnergyBtn').addEventListener('click', (e) => {
            let delta = prompt('에너지 변화량을 입력하세요.');
            if (delta == null || delta === '' || delta.match(/^-?[0-9]+$/) === null) return;

            this.#manager.modify('energy', Number(delta));
        });

        document.getElementById('modifyScoreBtn').addEventListener('click', (e) => {
            let delta = prompt('점수 변화량을 입력하세요.');
            if (delta == null || delta === '' || delta.match(/^-?[0-9]+$/) === null) return;

            this.#manager.modify('score', Number(delta));
        });

        document.getElementById('settleBtn').addEventListener('click', (e) => {
            this.#manager.settle();
            Utils.hideElement('nextBtn');
            Utils.hideElement('previousBtn');
            Utils.hideElement('endBtn');
            Utils.hideElement('settleBtn');
            Utils.showElement('startRoundBtn');
        });

        document.getElementById('endBtn').addEventListener('click', (e) => {
            this.#manager.endTurn();
        });

        document.getElementById('startRoundBtn').addEventListener('click', () => {
            this.#manager.startRound();
            Utils.showElement('nextBtn');
            Utils.showElement('previousBtn');
            Utils.showElement('endBtn');
            Utils.hideElement('startRoundBtn');
        });

        document.getElementById('showWorldBtn').addEventListener('click', (e) => {
            this.#manager.showDefaultWorld();
        });

        document.getElementById('endGameBtn').addEventListener('click', (e) => {
            this.#manager.endGame();
            Utils.showElement('endDiv');
        });

    }

    // -----------------------------------------

    #clickBuildBtn() {

        const buildBtns = document.querySelectorAll('#buildDiv > button');

        buildBtns.forEach(btn => {
            btn.classList.add('hidden');
        });
        
        document.getElementById('buildDiv').classList.remove('hidden');

        const status = this.#manager.getNowStatus();
        const team  = this.#manager.getNowTeam();


        if (status.hasFactory(1) && team.isEnough(Buildings.factory)) {
            document.getElementById('factoryBtn').classList.remove('hidden');
        }

        if (status.hasThermalPower(1) && team.isEnough(Buildings.thermalPower)) {
            document.getElementById('thermalPowerBtn').classList.remove('hidden');
        }

        if (status.hasWindPower(1) && team.isEnough(Buildings.windPower)) {
            document.getElementById('windPowerBtn').classList.remove('hidden');
        }

        if (status.hasSolarPower(1) && team.isEnough(Buildings.solarPower)) {
            document.getElementById('solarPowerBtn').classList.remove('hidden');
        }

        if (status.hasAtomicPower(1) && team.isEnough(Buildings.atomicPower)) {
            document.getElementById('atomicPowerBtn').classList.remove('hidden');
        }

        if (status.hasWindScore(1) && team.isEnough(Buildings.windScore)) {
            document.getElementById('windScoreBtn').classList.remove('hidden');
        }

        if (status.hasSolarScore(1) && team.isEnough(Buildings.solarScore)) {
            document.getElementById('solarScoreBtn').classList.remove('hidden');
        }

        if (status.hasAtomicScore(1) && team.isEnough(Buildings.atomicScore)) {
            document.getElementById('atomicScoreBtn').classList.remove('hidden');
        }
    }

    #clickBuildingBtn(type) {
        this.#manager.build(type);
    }

    #clickProduceBtn() {

        const produceBtns = document.querySelectorAll('#produceDiv > button');

        produceBtns.forEach(btn => {
            btn.classList.add('hidden');
        });
        
        document.getElementById('produceDiv').classList.remove('hidden');

        const status = this.#manager.getNowStatus();
        console.log(this.#manager.getNowTeam());
        const team = this.#manager.getNowTeam();

        if (status.hasProbe(1) && team.isEnough(Units.probe)) {
            document.getElementById('probeBtn').classList.remove('hidden');
        }

        if (status.hasWindUnit(1) && team.isEnough(Units.windUnit)) {
            document.getElementById('windUnitBtn').classList.remove('hidden');
        }

        if (status.hasSolarUnit(1) && team.isEnough(Units.solarUnit)) {
            document.getElementById('solarUnitBtn').classList.remove('hidden');
        }

        if (status.hasAtomicUnit(1) && team.isEnough(Units.atomicUnit)) {
            document.getElementById('atomicUnitBtn').classList.remove('hidden');
        }

        if (status.hasMissile(1) && team.isEnough(Units.missile)) {
            document.getElementById('missileBtn').classList.remove('hidden');
        }
    }

    #clickDestroyBtn() {
        Utils.showElement('destroyDiv');
    }

    #clickDestroyBuildingBtn() {
        Utils.hideElement('destroyDiv');
        this.#manager.destroyBuilding();
    }

    #clickDestroyUnitBtn() {
        Utils.showElement('destroyUnitDiv');
        const destroyUnitDiv = document.getElementById('destroyUnitDiv');
        destroyUnitDiv.innerHTML = '';
        this.#addDestroyUnitDiv(destroyUnitDiv, false)
    }

    #clickAdminDestroyUnitBtn() {
        Utils.showElement('adminDestroyUnitDiv');
        const destroyUnitDiv = document.getElementById('adminDestroyUnitDiv');
        destroyUnitDiv.innerHTML = '';
        this.#addDestroyUnitDiv(destroyUnitDiv, true)
    }

    #addDestroyUnitDiv(destroyUnitDiv, isAdmin) {
        this.#manager.getTeams().forEach(team => {

            const unitTeamBtn = document.createElement('button');
            unitTeamBtn.innerText = `${team.getName()}의 유닛`;
            unitTeamBtn.addEventListener('click', () => {
                Utils.removeHidden(unitTeamDiv);
            });

            const unitTeamDiv = document.createElement('div');
            unitTeamDiv.classList.add('back');
            unitTeamDiv.setAttribute('id', `unitTeamDiv_${team.getIndex()}`);
            Utils.addHidden(unitTeamDiv);

            unitTeamDiv.addEventListener('click', (e) => {
                if (e.target.id !==  `unitTeamDiv_${team.getIndex()}`)
                    return;
                
                Utils.addHidden(unitTeamDiv);
            });

            team.getUnits().forEach(unit => {
                const unitBtn = document.createElement('button');
                unitBtn.classList.add('unitBtn');
                unitBtn.innerText = unit.getName();

                unitBtn.addEventListener('click', () => {
                    if (isAdmin) {
                        team.destroyed(unit);
                    } else {
                        this.#manager.destroyUnit(unit);
                    }
                    Utils.addHidden(unitBtn);
                });

                unitTeamDiv.append(unitBtn);
            });
            
            destroyUnitDiv.append(unitTeamBtn);
            destroyUnitDiv.append(unitTeamDiv);

        });

    }

    #clickResearchBtn() {
        Utils.showElement('skillBtnDiv_'+this.#manager.getNowTeam().getIndex());
    }
    
    #clickChangeBiomeBtn() {

        const changeBiomeBtns = document.querySelectorAll('#changeBiomeDiv > button');

        changeBiomeBtns.forEach(btn => {
            btn.classList.add('hidden');
        });
        
        document.getElementById('changeBiomeDiv').classList.remove('hidden');

        const status = this.#manager.getNowStatus();

        if (status.hasProbe(64) && this.#manager.getNowTeam().getEnergy() >= 3) {
            document.getElementById('upBtn').classList.remove('hidden');
        }

        if (status.hasProbe(4) && this.#manager.getNowTeam().getEnergy() >= 3) {
            document.getElementById('downBtn').classList.remove('hidden');
        }
    }

    #clickUpBtn() {
        Utils.hideElement('changeBiomeDiv');
        this.#manager.changeBiomeUp();
    }

    #clickDownBtn() {
        Utils.hideElement('changeBiomeDiv');
        this.#manager.changeBiomeDown();
    }

}