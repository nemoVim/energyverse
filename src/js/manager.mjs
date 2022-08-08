import {Entity} from './entity.mjs';
import {Team} from './team.mjs';
import {World} from './world.mjs';
import {PowerPlants} from './powerPlants.mjs';

export class Manager {
    static initEnergy = 50;
    static turnEnergy = 10;

    #world;

    #teamCnt = 0;
    #teams = [];
    #turn = -1;

    #teamsDiv;

    #worldDivToggleBtn;

    #managerUI;

    constructor(_teamCnt) {
        this.#teamCnt = _teamCnt;

        this.#init();

        this.#managerUI = new ManagerUI(this);
    }

    getTeams() {
        return this.#teams;
    }

    getWorld() {
        return this.#world;
    }

    #init() {
        for (let i = 0; i < this.#teamCnt; i++) {
            let team = new Team(this, `팀 ${i+1}`, Manager.initEnergy);
            this.#teams.push(team);
        }

        this.#world = new World(this);
    }


    start() {
        this.#turn = -1;
        this.next();
    }

    next() {
        this.#turn =
            this.#turn === this.#teamCnt-1 ? (this.#turn = 0) : (this.#turn += 1);
        this.#managerUI.turnChanged();
    }

    previous() {
        this.#turn =
            this.#turn === 0 ? (this.#turn = this.#teamCnt-1) : (this.#turn -= 1);
        this.#managerUI.turnChanged();
    }

    getTurn() {
        return this.#turn;
    }


    #isBuyable(cost) {
        if (this.#teams[this.#turn].getEnergy() < cost) {
            alert('에너지가 부족합니다!');
            return false;
        }
        return true;
    }

    build(pos) {

        let team = this.#getNowTeam();

        // TODO: Complete build function

        // let entity = PowerPlants.WIND;

        // if (!team.isBuildable(pos, this.#world)) {
        //     alert('해당 타일에는 건설이 불가능합니다.');
        //     return;
        // }

        if (entity.type === 'atomic' && !entity.isBuildable(pos, this.#world, 0, 0)) {
            alert('해당 타일에는 건설이 불가능합니다.');
            return;
        }

        if (!this.#isBuyable(entity.cost)) {
            alert('에너지가 부족합니다.');
            return;
        }

        team.buildPowerPlant(pos, entity);
    }

    destroy(pos) {

        let team = this.#getNowTeam();
        let entity = this.#world.getEntity(pos);

        if (entity.getTeam() !== team) return;

        if(!confirm('이 건물을 파괴하시겠습니까?')) return;

        team.destroy(entity);
        this.#world.setEntity(pos, null);
    }

    #getNowTeam() {
        return this.#teams[this.#turn];
    }

    settle() {
        this.#teams.forEach((team) => {
            team.settle();
            team.modifyEnergy(Manager.turnEnergy);
            team.modifyScore(Manager.turnEnergy);
        });
    }

    changeEnergy(delta) {
        this.#getNowTeam().modifyEnergy(delta);
    }

    getUI() {
        return this.#managerUI;
    }

    // summon(type, pos) {
    //     if (!this.#isBuyable(Unit.getUnit(type).cost)) return;

    //     if(!confirm('ㄱ?')) return;

    //     this.#teams[this.#turn].energy -= Unit.getUnit(type).cost;

    //     this.refresh(this.#turn);
    // }

    // refresh(cnt) {

    //     let result = this.#teams[cnt].refresh();

    //     let predict = result.get('predict');
    //     let plants = result.get('plants');

    //     this.#energyUI[cnt].innerText = '에너지: ' + (this.#teams[cnt].energy);

    //     this.#predictUI[cnt].innerText = '발전량: ' + (predict + Manager.turnEnergy);

    //     if (plants.size === 0) {
    //         this.#plantsUI[cnt].innerText = '설치된 발전소가 없습니다.';
    //     } else {
    //         this.#plantsUI[cnt].innerText = '';
    //         plants.forEach((value, key)=> {
    //             this.#plantsUI[cnt].innerText += (Entity.getName(key) + ': ' + value + '\n');
    //         });
    //     }

    //     this.#tempElement.innerText = this.#temp.toFixed(2) + ' C';

    //     this.#world.refresh();
    // }

}

class ManagerUI {

    #managerDiv;
    #manager;

    #teamDivs = [];

    constructor(_manager) {

        this.#manager = _manager;
        
        this.#managerDiv = document.createElement('div');

        this.#initUIs();
        this.#initBtns();

        let nextBtn = document.createElement('button');
        nextBtn.innerText = '다음 턴';
        nextBtn.addEventListener('click', (e) => {
            _manager.next();
        });

        let previousBtn = document.createElement('button');
        previousBtn.innerText = '이전 턴';
        previousBtn.addEventListener('click', (e) => {
            _manager.previous();
        });

        let changeEnergyBtn = document.createElement('button');
        changeEnergyBtn.innerText = '현재 팀의 에너지 변경';
        changeEnergyBtn.addEventListener('click', (e) => {
            let change = prompt('변화량을 입력하세요.');
            if (change == null || change === '') return;

            _manager.changeEnergy(Number(change));
        });

        let settleBtn = document.createElement('button');
        settleBtn.innerText = '정산';
        settleBtn.addEventListener('click', (e) => {
            _manager.settle();
        });


        this.#managerDiv.append(previousBtn);
        this.#managerDiv.append(nextBtn);
        this.#managerDiv.append(changeEnergyBtn);
        this.#managerDiv.append(settleBtn);

        this.#managerDiv.append(_manager.getWorld().getUI());
    }

    #initUIs() {

        let teamsDiv = document.createElement('div');
        teamsDiv.setAttribute('id', 'teamsDiv');

        this.#manager.getTeams().forEach((team) => {
            this.#teamDivs.push(team.getUI().getDiv());
            teamsDiv.append(team.getUI().getDiv());
        });

        this.#managerDiv.append(teamsDiv);
    }

    #initBtns() {
        let worldDivToggleBtn = document.createElement('button');
        worldDivToggleBtn.innerText = '맵 보기/끄기';
        worldDivToggleBtn.setAttribute('id', 'worldDivToggleBtn');
        worldDivToggleBtn.addEventListener('click', () => {
            this.#manager.getWorld().toggleWorldDiv();
        });

        this.#managerDiv.append(worldDivToggleBtn);
    }

    turnChanged() {
        for (let index in this.#teamDivs) {
            this.#teamDivs[index].classList.remove('turn');
        }

        this.#teamDivs[this.#manager.getTurn()].classList.add('turn');

    }

    getDiv() {
        return this.#managerDiv;
    }
}