export class Entity {

    #entity;
    #pos;
    #team;

    constructor(_entity, _pos, _team) {
        this.#entity = _entity;
        this.#pos = _pos;
        this.#team = _team;
    }

    getEntity() {
        return this.#entity;
    }

    getPos() {
        return this.#pos;
    }

    getTeam() {
        return this.#team;
    }

    getType() {
        return this.#entity.type;
    }

    getName() {
        return this.#entity.name;
    }

    getCost() {
        return this.#entity.cost;
    }
}