export class Biome {
    #pos;

    constructor(_pos) {
        this.#pos = _pos;
    }

    get pos() {
        return this.#pos;
    }

    get en() {
        return this.constructor.en;
    }
}

export class Water extends Biome {
    static en = 'water';

    constructor({ pos }) {
        super(pos);
    }
}

export class Ground extends Biome {
    static en = 'ground';

    constructor({ pos }) {
        super(pos);
    }
}

export class Mountain extends Biome {
    static en = 'mountain';

    constructor({ pos }) {
        super(pos);
    }
}

export class Fuel extends Biome {
    static en = 'fuel';

    #amount;

    constructor({ pos, amount }) {
        super(pos);
        this.#amount = amount;
    }

    set amount(_amount) {
        this.#amount = Number(_amount);
    }

    get amount() {
        return this.#amount;
    }
}

export const Biomes = {
    water: Water,
    ground: Ground,
    mountain: Mountain,
    fuel: Fuel,
};

export function createBiome(biomeObj) {
    const biome = new Biomes[biomeObj.en](biomeObj);
    return biome;
}