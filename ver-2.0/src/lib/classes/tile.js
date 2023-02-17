export class Tile {
    #pos;
    #biome;
    #entity;

    constructor(_pos, _biome, _entity) {
        this.#pos = _pos;
        this.#biome = _biome;
        this.#entity = _entity;
    }

    get pos() {
        return this.#pos;
    }

    get biome() {
        return this.#biome;
    }

    get entity() {
        return this.#entity;
    }

    set biome(_biome) {
        this.#biome = _biome;
    }

    set entity(_entity) {
        this.#entity = _entity;
    }
}