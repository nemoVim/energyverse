export class Entity {

    #pos;
    #player;

    constructor({ pos, player }) {
        this.#pos = pos;
        this.#player = player;
    }

    get pos() {
        return this.#pos;
    }

    set pos(_pos) {
        this.#pos = [_pos[0], _pos[1], _pos[2]];
    }

    get player() {
        return this.#player;
    }

    get en() {
        return this.constructor.en;
    }

    get kr() {
        return this.constructor.kr;
    }

    get cost() {
        return this.constructor.cost;
    }
}