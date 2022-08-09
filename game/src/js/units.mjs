import { Move } from './move.mjs';
import { Entity } from './entity.mjs';

export class Unit extends Entity {

    #team;
    #movableTiles;
    #actableTiles;

    constructor(unit, pos, team) {
        super(unit, pos, team);
        // this.#movableTiles = movable;
        // this.#actableTiles = actable;
        this.#team = team;
    }

    getTeam() {
        return this.#team;
    }

    focused() {
        return this.#movableTiles;
    }

    unfocused() {
        return this.#movableTiles;
    }
}

export class Probe extends Unit {
    static cost = 10;
    static type = 'probe';

    static moveFunction = (pos) => {
        return Move.around(pos, 1) + Move.around(pos, 1);
    };
    static actFunction = (pos) => {
        return Move.around(pos, 1) + Move.around(pos, 1);
    };

    constructor(pos, team) {
        super(
            Probe.type,
            pos,
            this.moveFunction(pos),
            this.actFunction(pos),
            team
        );
    }
}

export class SolarUnit extends Unit {
    static cost = 20;
    static type = 'solarUnit';
    
    static moveFunction = (pos) => {
        return Move.around(pos, 1) + Move.around(pos, 1);
    };

    constructor(pos, team) {
        super(
            SolarUnit,
            pos,
            team,
        );
    }
}