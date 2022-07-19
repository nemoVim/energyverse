class Team {
    #energy = 0;
    #plants = [];

    set energy(e) {
        if (e < 0) {
            // throw new Error('Energy can not have negative value');
            return false;
        }
        this.#energy = e;
        return true;
    }

    get energy() {
        return this.#energy;
    }

    build(plant) {
        this.#plants.push(plant);
    }

    refresh() {
        let predictValue = 0;
        let plants = new Map();
        this.#plants.forEach((value) => {
            predictValue += Number(value.earn());
            let type = value.getType();
            if (plants.has(type)) {
                plants.set(type, plants.get(type) + 1);
            } else {
                plants.set(type, 1);
            }
        });
        return new Map([["predict", predictValue], ["plants", plants]]);
    }

    settle() {
        this.#plants.forEach((value) => {
            this.#energy += Number(value.earn());
        });
    }
}

export default Team;