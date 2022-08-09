import { Entity } from './entity.mjs';

export class Building extends Entity {
    constructor(building, pos, team) {
        super(building, pos, team);
    }
}

export class Factory extends Building {
    static cost = 20;
    static type = 'factory';
    static name = '공장';

    constructor(pos, team) {
        super(Factory, pos, team);
    }
}

export class Barricade extends Building {
    static cost = 10;
    static type = 'barricade';
    static name = '방벽';

    constructor(pos, team) {
        super(Barricade, pos, team);
    }
}

export const Buildings = {
    FACTORY: Factory,
    BARRICADE: Barricade,
};
