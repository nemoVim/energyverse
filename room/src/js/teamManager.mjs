import { Buildings } from '../../../src/js/buildings.mjs';
import { World } from '../../../src/js/world.mjs';
import { Team } from './team.mjs';
import { DummyTeam } from './dummyTeam.mjs';
import { Status } from '../../../src/js/status.mjs';
import { Skills } from '../../../src/js/skills.mjs';

export class TeamManager {
    #socket;
    #world;
    #team;
    #name;
    #index;

    #teams = [];

    constructor(_socket, _name) {
        this.#socket = _socket;
        this.#name = _name;

        this.#addListeners();
    }

    #setClickFunctions() {
        const tileMapArray = this.#world.getTileMap().getTileMapArray();
        tileMapArray.forEach((tileArray) => {
            tileArray.forEach((tile) => {
                const biome = tile.getBiome();
                if (biome.getType() === 'fuel') {
                    tile.getUI().setClickFunction(function () {
                        alert(`자원이 ${biome.getAmount()}개 남았습니다.`);
                    });
                }

                const entity = tile.getEntity();
                tile.getUI().setClickFunction(function () {
                    alert(
                        `"${this.#teams[
                            entity.getTeam()
                        ].getNickname()}" 팀의 건물입니다.`
                    );
                });
            });
        });
    }

    #addListeners() {
        this.#socket.on('init', (teamNameList) => {
            console.log(teamNameList);
            this.#init(teamNameList);
        });

        this.#socket.on('turn', (team) => {
            this.#turnChanged(team);
        });

        this.#socket.on('build', (msg) => {
            // [type, team]
            const config = new Array(JSON.parse(msg));
            this.#build(config);
        });

        this.#socket.on('produce', (msg) => {
            // [type, pos, team]
            const config = new Array(JSON.parse(msg));
            this.#produce(config);
        });

        this.#socket.on('destroy', (msg) => {
            // [pos, team] <- team who destroyed the entity.
            const config = new Array(JSON.parse(msg));
            this.#destroy(config);
        });

        this.#socket.on('modify', (msg) => {
            // [type, delta, team] | type = 'energy' or 'score.'
            const config = new Array(JSON.parse(msg));
            this.#modify(config);
        });

        this.#socket.on('settle', (msg) => {
            // [team]
            const config = new Array(JSON.parse(msg));
            this.#settle(config);
        });

        this.#socket.on('thermal', (msg) => {
            // [pos] amount of fuel -1 at pos, and world temperature is increased.
            const config = new Array(JSON.parse(msg));
            this.#thermal(config);
        });

        this.#socket.on('refresh', (msg) => {
            // [team, predict, energy, score]
            const config = new Array(JSON.parse(msg));
            this.#refreshOther(config);
        });

        this.#socket.on('research', (msg) => {
            // [index, team]
            const config = new Array(JSON.parse(msg));
            this.#research(config);
        });

        this.#socket.on('changeBiome', (msg) => {
            // [pos, type]
            const config = new Array(JSON.parse(msg));
            this.#changeBiome(config);
        });
    }

    #init(teamNameList) {
        document.getElementById('roomDiv').classList.add('hidden');

        this.#world = new World();
        this.#team = new Team(this.#socket, this.#name);

        this.#setClickFunctions();

        for (let name of teamNameList) {
            this.#teams.push(new DummyTeam(name));
        }

        this.#index = teamNameList.indexOf(this.#name);

        this.#teams[this.#index] = this.#team;

        document.getElementById('mapDiv').append(this.#world.getUI());
        document.getElementById('mapBtn').addEventListener('click', () => {
            this.#world.toggleWorldDiv();
        });

        document.getElementById('gameDiv').classList.remove('hidden');
        document.getElementById('teamDiv').classList.remove('hidden');
    }

    #isMyAction(team) {
        if (typeof team === 'Number') {
            if (this.#teams[team].getNickname() === this.#team.getNickname()) {
                return true;
            } else {
                return false;
            }
        } else {
            if (this.#team.getNickname() === team) {
                return true;
            } else {
                return false;
            }
        }
    }

    #turnChanged(team) {
        if (this.#isMyAction(team)) {
            alert('My Turn!');
        }
    }

    #build(config) {
        const building = new Buildings[config[0]](
            config[1],
            config[2],
            this.#world,
            this.#teams[config[2]].getStatus()
        );

        this.#world.setEntity(config[1], building);

        if (this.#isMyAction(config[2])) {
            // This team built the building.
            this.#team.build(building);
        }
    }

    #produce(config) {
        const unit = new Units[config[0]](config[1]);

        if (this.#isMyAction(config[1])) {
            // This team built the building.
            this.#team.produce(unit);
        }
    }

    #destroy(config) {
        if (
            this.#isMyAction(config[1]) &&
            !this.#isMyAction(this.#world.getEntity(config[0]).getTeam())
        ) {
            // This team destroyed the entity, and this team isn't owner of the entity.
            this.#team.destroy(this.#world.getEntity(config[0]));
        }
        if (this.#isMyAction(this.#world.getEntity(config[0]).getTeam())) {
            // This team is owner of entity that is destroyed.
            this.#team.destroyed(this.#world.getEntity(config[0]));
        }
        this.#world.setEntity(config[0], null);
    }

    #modify(config) {
        if (!this.#isMyAction(config[2])) return;

        if (config[0] === 'energy') {
            this.#team.modifyEnergy(config[1]);
        } else if (config[0] === 'score') {
            this.#team.modifyScore(config[1]);
        }
    }

    #settle(config) {
        if (this.#isMyAction(config[0])) {
            this.#team.settle();
        } else {
            this.#teams[config[0]].settle();
        }
    }

    #thermal(pos) {
        this.#world.getBiome(pos).modifyAmount(-1);
        this.#world.increaseTemp();
    }

    #refreshOther(config) {
        const team = this.#teams[config[0]];
        team.setPredict(config[1]);
        team.setEnergy(config[2]);
        team.setScore(config[3]);
        this.refresh();
    }

    refresh() {
        this.#team.refresh();
    }

    #research(config) {
        if (this.#isMyAction(config[1])) {
            this.#team.research(config[0]);
        } else {
            this.#teams[config[1]].research(config[0]);
        }
    }

    #changeBiome(pos, type) {}
}
