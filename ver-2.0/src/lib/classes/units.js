import { Entity } from '$lib/classes/entity';

export class Unit extends Entity {
    constructor(unitObj) {
        super(unitObj);
    }
}

export class Probe extends Unit {
    static cost = 10;
    static en = 'probe';
    static kr = '일꾼';

    constructor(unitObj) {
        super(unitObj);
    }
}

export class WindUnit extends Unit {
    static cost = 15;
    static en = 'windUnit';
    static kr = '풍력';

    constructor(unitObj) {
        super(unitObj);
    }
}

export class SolarUnit extends Unit {
    static cost = 15;
    static en = 'solarUnit';
    static kr = '태양광';

    constructor(unitObj) {
        super(unitObj);
    }
}
export class AtomicUnit extends Unit {
    static cost = 15;
    static en = 'atomicUnit';
    static kr = '원자력';

    constructor(unitObj) {
        super(unitObj);
    }
}

export class Missile extends Unit {
    static cost = 15;
    static en = 'missile';
    static kr = '미사일';

    constructor(unitObj) {
        super(unitObj);
    }
}

export const Units = {
    probe: Probe,
    windUnit: WindUnit,
    solarUnit: SolarUnit,
    atomicUnit: AtomicUnit,
    missile: Missile,
}

export function createUnit(unitObj) {
    const unit = new Units[unitObj.en]({
        pos: unitObj.pos,
        player: unitObj.player,
    });
    return unit;
}