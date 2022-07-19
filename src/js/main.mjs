import PowerPlant from './plants.mjs';
import Team from './team.mjs';

class Manager {
    static initEnergy = 100;
    static turnEnergy = 10;

    #cnt = 0;
    #teams = [];
    #turn = -1;

    #plantsUI = [];
    #predictUI = [];
    #energyUI = [];
    #teamUI = [];

    #buildBtns = [];

    #buildBtnsDiv; 
    #teamsDiv;

    init() {
        this.#cnt = Number(prompt('팀 수?'));
        for (let i = 0; i < this.#cnt; i++) {
            let team = new Team();
            team.energy = Manager.initEnergy;
            this.#teams.push(team);
        }
        this.initUIs();
        this.initBtns();
        this.initDivs();
    }

    initUIs() {
        this.#teamsDiv = document.createElement('div');
        this.#teamsDiv.setAttribute('id', 'teamsDiv');

        for (let i = 0; i < this.#cnt; i++) {
            this.#plantsUI.push(document.createElement('p'));
            this.#predictUI.push(document.createElement('p')); 
            this.#energyUI.push(document.createElement('p')); 
            this.refresh(i);

            let teamDiv = document.createElement('div');
            teamDiv.classList.add('teamDiv');

            let title = document.createElement('h4');
            title.innerText = 'Team ' + (i+1);

            teamDiv.append(title);
            teamDiv.append(this.#plantsUI[i]);
            teamDiv.append(this.#predictUI[i]);
            teamDiv.append(this.#energyUI[i]);

            this.#teamUI.push(teamDiv);
            this.#teamsDiv.append(teamDiv);
        }
    }

    initBtns() {
        this.#buildBtnsDiv = document.createElement('div');
        this.#buildBtnsDiv.setAttribute('id', 'buildBtnsDiv');

        for (let i = 0; i < PowerPlant.types.length; i++) {
            let btn = document.createElement('button');
            let type = PowerPlant.types[i];

            btn.setAttribute('id', type);
            btn.innerText = PowerPlant.getName(type) + ' 설치';
            btn.addEventListener('click', (e) => {
                this.build(type, 0);
            });

            this.#buildBtns.push(btn);
            this.#buildBtnsDiv.append(btn);
        }
    }

    initDivs() {
        let body = document.getElementsByTagName('body')[0];

        body.append(this.#buildBtnsDiv);
        body.append(document.createElement('hr'));
        body.append(this.#teamsDiv);
    }

    refresh(cnt) {

        let result = this.#teams[cnt].refresh();

        let predict = result.get('predict');
        let plants = result.get('plants');

        this.#energyUI[cnt].innerText = '에너지: ' + (this.#teams[cnt].energy);

        this.#predictUI[cnt].innerText = '발전량: ' + (predict + Manager.turnEnergy);

        if (plants.size === 0) {
            this.#plantsUI[cnt].innerText = '설치된 발전소가 없습니다.';
        } else {
            this.#plantsUI[cnt].innerText = '';
            plants.forEach((value, key)=> {
                this.#plantsUI[cnt].innerText += (PowerPlant.getName(key) + ': ' + value + '\n');
            });
        }
    }

    start() {
        this.#turn = -1;
        this.next();
    }

    next() {
        this.#turn =
            this.#turn === this.#cnt-1 ? (this.#turn = 0) : (this.#turn += 1);
        this.turnChanged();
    }

    previous() {
        this.#turn =
            this.#turn === 0 ? (this.#turn = this.#cnt-1) : (this.#turn -= 1);
        this.turnChanged();
    }

    turnChanged() {
        for (let index in this.#teamUI) {
            this.#teamUI[index].classList.remove('turn');
        }

        this.#teamUI[this.#turn].classList.add('turn');

    }

    build(type, pos) {
        if(!confirm('ㄱ?')) return;

        if (this.#teams[this.#turn].energy < PowerPlant.getPlant(type).cost) {
            alert('에너지가 부족합니다!');
            return;
        }

        let plant = new (PowerPlant.getPlant(type))(pos);

        if (
            type === 'thermal' ||
            type === 'solar' ||
            type === 'solarPlus' ||
            type === 'wind' ||
            type === 'windPlus'
        ) {
            let earn = prompt('발전량?');

            if (earn == null || earn === '') return;

            plant.setEarn(earn);
        }

        this.#teams[this.#turn].energy -= PowerPlant.getPlant(type).cost;

        this.#teams[this.#turn].build(plant);

        this.refresh(this.#turn);
    }

    changeEnergy(change) {
        this.#teams[this.#turn].energy += change;
        this.refresh(this.#turn);
    }

    settle() {
        for (let i = 0; i < this.#cnt; i++) {
            this.#teams[i].settle();
            this.#teams[i].energy += Manager.turnEnergy;
            this.refresh(i);
        }
    }

}

const body = document.getElementsByTagName('body')[0];

let manager = new Manager();
manager.init();
manager.start();

let nextBtn = document.createElement('button');
nextBtn.innerText = '다음 턴';
nextBtn.addEventListener('click', (e) => {
    manager.next();
});

let previousBtn = document.createElement('button');
previousBtn.innerText = '이전 턴';
previousBtn.addEventListener('click', (e) => {
    manager.previous();
});

let changeEnergyBtn = document.createElement('button');
changeEnergyBtn.innerText = '현재 팀의 에너지 변경';
changeEnergyBtn.addEventListener('click', (e) => {
    let change = prompt('변화량을 입력하세요.');
    if (change == null || change === '') return;

    manager.changeEnergy(Number(change));
});

let settleBtn = document.createElement('button');
settleBtn.innerText = '정산';
settleBtn.addEventListener('click', (e) => {
    manager.settle();
});

body.append(document.createElement('hr'));
body.append(previousBtn);
body.append(nextBtn);
body.append(changeEnergyBtn);
body.append(settleBtn);