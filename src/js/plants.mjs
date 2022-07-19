class PowerPlant {
    static types = ['thermal', 'solar', 'wind', 'atomic', 'solarPlus', 'windPlus', 'atomicPlus'];

    static getPlant(type) {
        if (type === 'thermal') {
            return Thermal;
        } else if (type === 'solar') {
            return Solar;
        } else if (type === 'wind') {
            return Wind;
        } else if (type === 'atomic') {
            return Atomic;
        } else if (type === 'solarPlus') {
            return SolarPlus;
        } else if (type === 'windPlus') {
            return WindPlus;
        } else if (type === 'atomicPlus') {
            return AtomicPlus;
        } else {
            throw new Error('There is no type named ' + type);
        }
    }

    static getName(type) {
        if (type === 'thermal') {
            return '화력발전소';
        } else if (type === 'solar') {
            return '태양광 발전소';
        } else if (type === 'wind') {
            return '풍력 발전소';
        } else if (type === 'atomic') {
            return '원자력 발전소';
        } else if (type === 'solarPlus') {
            return '강화 태양광 발전소';
        } else if (type === 'windPlus') {
            return '강화 풍력 발전소';
        } else if (type === 'atomicPlus') {
            return '핵융합 발전소';
        } else {
            throw new Error('There is no type named ' + type);
        }
    }

    #earn = 0;
    #position;
    #type;

    constructor(plantType, earnEnergy, pos) {
        this.#type = plantType;
        this.#earn = earnEnergy;
        this.#position = pos;
    }
    
    setEarn(value) {
        this.#earn = value;
    }

    earn() {
        return this.#earn;
    }

    getType() {
        return this.#type;
    }
}

class Thermal extends PowerPlant {
    static cost = 10;

    constructor(pos) {
        let dis = 0;
        super('thermal', (2 - dis) * 5, pos);
    }

    earn() {
        console.log('thermal power plant working!');
        return super.earn();
    }
}

class Solar extends PowerPlant {
    static cost = 10;

    constructor(pos) {
        let tile = 0;
        super('solar', tile, pos);
    }
}

class Wind extends PowerPlant {
    static cost = 10;

    constructor(pos) {
        let tile = 0;
        super('wind', tile, pos);
    }
}

class Atomic extends PowerPlant {
    static cost = 10;
    static earn = 10;

    constructor(pos) {
        super('atomic', Atomic.earn, pos);
    }
}

class SolarPlus extends PowerPlant {
    static cost = 10;

    constructor(pos) {
        let tile = 0;
        super('solarPlus', tile, pos);
    }
}

class WindPlus extends PowerPlant {
    static cost = 10;

    constructor(pos) {
        let tile = 0;
        super('windPlus', tile, pos);
    }
}

class AtomicPlus extends PowerPlant {
    static cost = 10;
    static earn = 10;

    constructor(pos) {
        super('atomicPlus', AtomicPlus.earn, pos);
    }
}

export default PowerPlant;
