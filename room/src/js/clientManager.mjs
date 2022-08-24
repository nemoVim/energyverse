import { Temperature } from '../../../src/js/temperature.mjs';
import { ClientTeam } from './clientTeam.mjs';

export class ClientManager {

    #socket;
    #name;
    #index;

    #temp;

    #round = 0;

    #isMyTurn;

    #teams = [];

    constructor(_socket, _name) {
        this.#socket = _socket;
        this.#name = _name;

        this.#isMyTurn = false;

        this.#temp = new Temperature();

        this.#addListeners();
    }

    #addListeners() {

        this.#socket.on('usersData', config => {
            console.log(config);
            this.#reSetting(JSON.parse(config));
        });

        this.#socket.on('ready', () => {
            this.#ready();
        });

        this.#socket.on('init', (teamNameList) => {
            console.log(teamNameList);
            this.#init(teamNameList);
        });

        this.#socket.on('start', () => {
            this.#start();
        });

        this.#socket.on('endGame', () => {
            this.#endGame();
        });

        this.#socket.on('turn', (teamIndex) => {
            this.#turnChanged(teamIndex);
        });

        this.#socket.on('modify', (config) => {
            // [type, delta, teamIndex] | type ='energy' or 'score.'
            this.#modify(config);
        });

        this.#socket.on('earn', (config) => {
            // [earnValue, teamIndex]
            this.#setEarn(config);
        });

        this.#socket.on('research', (config) => {
            // [skillIndex, teamIndex]
            this.#research(config);
        });

        this.#socket.on('unResearch', (config) => {
            // [skillIndex, teamIndex]
            this.#unResearch(config);
        });

        this.#socket.on('learn', () => {
            this.#learn();
        });

        this.#socket.on('temperature', (temp) => {
            this.#setTemp(temp);
        });

        this.#socket.on('round', (round) => {
            this.#round = Number(round);
            this.#refreshUIs();
        });

        this.#socket.on('wait', (teamIndex)=> {
            this.#wait(teamIndex);
        });

        this.#socket.on('time', (msg)=> {
            // [time, teamIndex]
            this.#teams[msg[1]].getTimer().setTime(msg[0]);
        });
    }

    // ------------------------------------------------

    #reSetting(config) {
        // [teamNameList, earn, energy, score, researching, learned, time, nowTurn, temperature, round];
        console.log(config);

        this.#ready();
        this.#init(config[0]);
        this.#start();
        config[0].forEach((teamName, index) => {
            this.#teams[index].setEarn(config[1][index]);
            this.#teams[index].setEnergy(config[2][index]);
            this.#teams[index].setScore(config[3][index]);
            this.#teams[index].setResearching(new Set(config[5][index]));
            this.#teams[index].learn();
            this.#teams[index].setResearching(new Set(config[4][index]));
            this.#teams[index].getTimer().setTime(config[6][index]);
        });

        if (Number(config[7]) !== -1) {
            this.#turnChanged(Number(config[7]));
        } else {
            document.getElementById('waitDiv').classList.remove('hidden');
        }

        this.#temp.setTemp(config[8]);
        this.#seaLevel = parseInt(Math.floor((this.#temp.getTemp()-Temperature.initialTemp)*10/5));

        this.#round = Number(config[9]);
        this.#refreshUIs();
    }

    // ------------------------------------------------

    #ready() {
        document.getElementById('readyDiv').classList.remove('hidden');
        document.getElementById('readyP').classList.remove('hidden');
    }

    #init(teamNameList) {
        this.#initTeams(teamNameList);
        this.#initUIs();

        console.log('teamName: ' + this.#name);
        console.log('teamIndex: ' + this.#index);
        console.log('--allTeams--');
        console.log(this.#teams);
        console.log('--------------');

        this.#refreshUIs();
    }

    #initTeams(teamNameList) {
        this.#index = teamNameList.indexOf(this.#name);

        teamNameList.forEach((name, index) => {
            if (this.#index === index) {
                this.#teams.push(new ClientTeam(name, index, this.#socket));
            } else {
                this.#teams.push(new ClientTeam(name, index));
            }
        });
    }

    #initUIs() {
        document.getElementById('roomDiv').classList.add('hidden');
        document.getElementById('gameDiv').classList.remove('hidden');
        document.getElementById('clientDiv').classList.remove('hidden');

        document.getElementById('thisTeamDiv').append(this.#teams[this.#index].getSkillTreeUI());
        this.#teams[this.#index].getSkillTree().initDone();

        document.getElementById('nameP').before(this.#teams[this.#index].getTimer().getUI());

        document.getElementById('nameP').innerText = this.#teams[this.#index].getName();

        document.getElementById('turnEndBtn').addEventListener('click', () => {
            this.#turnEnd();
        })

        this.#teams.forEach((team, index) => {
            if (index === this.#index)
                return;
            
            const teamDiv = document.createElement('div');
            teamDiv.setAttribute('id', 'teamDiv_'+index);

            const nameP = document.createElement('p');
            nameP.setAttribute('id', 'nameP'+index);
            nameP.innerText = team.getName();
            
            const earnP = document.createElement('p');
            earnP.setAttribute('id', 'earnP_'+index);
            
            const energyP = document.createElement('p');
            energyP.setAttribute('id', 'energyP_'+index);
            
            const scoreP = document.createElement('p');
            scoreP.setAttribute('id', 'scoreP_'+index);

            teamDiv.append(team.getTimer().getUI());

            teamDiv.append(nameP);
            teamDiv.append(earnP);
            teamDiv.append(energyP);
            teamDiv.append(scoreP);
            teamDiv.append(team.getSkillTreeUI());

            document.getElementById('otherTeamsDiv').append(teamDiv);

            team.getSkillTree().initDone();
        });

    }

    #start() {
        document.getElementById('readyDiv').classList.add('hidden');
        document.getElementById('readyP').classList.add('hidden');
        document.getElementById('waitDiv').classList.remove('hidden');
    }

    #endGame() {
        document.getElementById('waitDiv').classList.add('hidden');
        document.getElementById('endDiv').classList.remove('hidden');
    }

    // -----------------------------------------------

    #stop() {
        this.#wait(this.#index);
        this.#socket.emit('wait', this.#index);
    }

    #wait(teamIndex) {
        this.#teams[teamIndex].getTimer().stop();
        this.#teams[teamIndex].getTimer().setTime(0);
        document.getElementById('waitDiv').classList.remove('hidden');
    }

    #turnEnd() {
        if (this.#isMyTurn) {
            document.getElementById('turnEndBtn').classList.add('hidden');
            this.#stop();
        }
    }

    #turnChanged(teamIndex) {
        document.getElementById('waitDiv').classList.add('hidden');
        if (teamIndex === this.#index) {
            this.#isMyTurn = true;
            document.getElementById('turnEndBtn').classList.remove('hidden');
        } else {
            this.#isMyTurn = false;
            document.getElementById('turnEndBtn').classList.add('hidden');
        }
        this.#refreshUIs();
        document.getElementById('turnP').innerText = `${this.#teams[teamIndex].getName()}의 차례입니다.`;
    }

    #modify(config) {
        if (config[0] === 'energy') {
            this.#teams[config[2]].modifyEnergy(config[1]);
        } else if (config[0] === 'score') {
            this.#teams[config[2]].modifyScore(config[1]);
        }
        this.#refreshUIs();
    }

    #setEarn(config) {
        this.#teams[config[1]].setEarn(config[0]);
        this.#refreshUIs();
    }

    #research(config) {
        this.#teams[config[1]].research(config[0]);
        this.#refreshUIs();
    }

    #unResearch(config) {
        this.#teams[config[1]].unResearch(config[0]);
        this.#refreshUIs();
    }

    #learn() {
        this.#teams.forEach(team => {
            team.learn();
        });
        this.#refreshUIs();
    }

    #seaLevel = 0;
    #setTemp(_temp) {
        this.#temp.setTemp(_temp);
        console.log('--temp--');
        console.log(_temp);
        const _seaLevel = parseInt(Math.floor((this.#temp.getTemp()-Temperature.initialTemp)*10/5));
        console.log('--seaLevel--');
        console.log(this.#seaLevel);
        console.log('--_seaLevel--');
        console.log(_seaLevel);
        if (this.#seaLevel < _seaLevel) {
            alert(`물이 ${_seaLevel-this.#seaLevel}칸 올랐습니다!`);
            this.#seaLevel = _seaLevel;
        }
        this.#refreshUIs();
    }

    // ----------------------------------

    #refreshUIs() {
        this.#refreshThisTeamUI();
        this.#refreshOtherTeamsUI();
        document.getElementById('roundP').innerText = this.#round + '번째 라운드';
    }

    #refreshThisTeamUI() {
        const team = this.#teams[this.#index];
        // TODO: Add turn mark element
        document.getElementById('tempP').innerText = `${this.#temp.getTemp()} °C`;
        document.getElementById('earnP').innerText = `발전량: ${team.getEarn()}`;
        document.getElementById('energyP').innerText = `에너지: ${team.getEnergy()}`;
        document.getElementById('scoreP').innerText = `점수: ${team.getScore()}`;
    }

    #refreshOtherTeamsUI() {
        this.#teams.forEach((team, index) => {
            if (index === this.#index)
                return;

            document.getElementById('earnP_'+index).innerText = `발전량: ${team.getEarn()}`;
            document.getElementById('energyP_'+index).innerText = `에너지: ${team.getEnergy()}`;
            document.getElementById('scoreP_'+index).innerText = `점수: ${team.getScore()}`;
        });
    }
}