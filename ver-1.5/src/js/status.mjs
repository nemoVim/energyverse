export class Status {
    #probe = 0;
    #factory = 0;
    #thermalPower = 0;
    #windPower = 0;
    #solarPower = 0;
    #atomicPower = 0;
    #windUnit = 0;
    #solarUnit = 0;
    #atomicUnit = 0;
    #windScore = 0;
    #solarScore = 0;
    #atomicScore = 0;
    #missile = 0;
    #units = 0;

    constructor() {}

    hasProbe(upgrade) {
        return (this.#probe & upgrade) === upgrade;
    }

    upgradeProbe(upgrade) {
        this.#probe |= upgrade;
        return this;
    }

    hasFactory(upgrade) {
        return (this.#factory & upgrade) === upgrade;
    }

    upgradeFactory(upgrade) {
        this.#factory |= upgrade;
        return this;
    }

    hasThermalPower(upgrade) {
        return (this.#thermalPower & upgrade) === upgrade;
    }

    upgradeThermalPower(upgrade) {
        this.#thermalPower |= upgrade;
        return this;
    }

    hasWindPower(upgrade) {
        return (this.#windPower & upgrade) === upgrade;
    }

    upgradeWindPower(upgrade) {
        this.#windPower |= upgrade;
        return this;
    }

    hasSolarPower(upgrade) {
        return (this.#solarPower & upgrade) === upgrade;
    }

    upgradeSolarPower(upgrade) {
        this.#solarPower |= upgrade;
        return this;
    }

    hasAtomicPower(upgrade) {
        return (this.#atomicPower & upgrade) === upgrade;
    }

    upgradeAtomicPower(upgrade) {
        this.#atomicPower |= upgrade;
        return this;
    }

    hasWindUnit(upgrade) {
        return (this.#windUnit & upgrade) === upgrade;
    }

    upgradeWindUnit(upgrade) {
        this.#windUnit |= upgrade;
        return this;
    }

    hasSolarUnit(upgrade) {
        return (this.#solarUnit & upgrade) === upgrade;
    }

    upgradeSolarUnit(upgrade) {
        this.#solarUnit |= upgrade;
        return this;
    }

    hasAtomicUnit(upgrade) {
        return (this.#atomicUnit & upgrade) === upgrade;
    }

    upgradeAtomicUnit(upgrade) {
        this.#atomicUnit |= upgrade;
        return this;
    }

    hasWindScore(upgrade) {
        return (this.#windScore & upgrade) === upgrade;
    }

    upgradeWindScore(upgrade) {
        this.#windScore |= upgrade;
        return this;
    }

    hasSolarScore(upgrade) {
        return (this.#solarScore & upgrade) === upgrade;
    }

    upgradeSolarScore(upgrade) {
        this.#solarScore |= upgrade;
        return this;
    }

    hasAtomicScore(upgrade) {
        return (this.#atomicScore & upgrade) === upgrade;
    }

    upgradeAtomicScore(upgrade) {
        this.#atomicScore |= upgrade;
        return this;
    }

    hasMissile(upgrade) {
        return (this.#missile & upgrade) === upgrade;
    }

    upgradeMissile(upgrade) {
        this.#missile |= upgrade;
        return this;
    }

    hasUnits(upgrade) {
        return (this.#units & upgrade) === upgrade;
    }

    upgradeUnits(upgrade) {
        this.#units |= upgrade;
        return this;
    }
}
