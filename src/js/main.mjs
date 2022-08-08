import {Manager} from './manager.mjs';

const body = document.getElementsByTagName('body')[0];

let teamCnt = Number(prompt('팀 수?'));
let manager = new Manager(teamCnt);

body.append(manager.getUI().getDiv());

manager.start();